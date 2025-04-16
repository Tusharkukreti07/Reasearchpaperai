import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { z } from "zod";
import { extractTextFromPDF, extractMetadataFromPDFText } from "./pdf/extraction";
import { extractTextFromPDFAdvanced, extractAdvancedMetadataFromText, convertToBasicMetadata } from "./pdf/advanced-extraction";
import { 
  summarizePaper,
  extractCitations,
  formatCitation,
  askQuestion,
  generateLiteratureReview,
  comparePapers
} from "./ai/gemini";
import {
  insertPaperSchema,
  insertSummarySchema,
  insertCitationSchema,
  insertAnnotationSchema,
  insertChatSchema,
  insertMessageSchema,
  insertResearchGoalSchema,
  Paper
} from "@shared/schema";

// Set up multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, callback) => {
    if (file.mimetype !== 'application/pdf') {
      return callback(new Error('Only PDF files are supported'));
    }
    callback(null, true);
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get user (simplified for demo)
  app.get("/api/user", async (req: Request, res: Response) => {
    const user = await storage.getUserByUsername("sarah");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  // Upload and process a paper
  app.post("/api/papers/upload", upload.single('file'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      const userId = 1; // In a real app, would be from authenticated user
      
      // Extract text from the PDF with enhanced OCR if needed
      console.log("Starting PDF extraction with OCR fallback...");
      const pdfBuffer = req.file.buffer;
      const extractedText = await extractTextFromPDFAdvanced(pdfBuffer);
      
      console.log(`Extracted ${extractedText.length} characters of text from PDF`);
      
      // Try to extract advanced metadata first
      let metadata;
      try {
        console.log("Attempting advanced metadata extraction...");
        const advancedMetadata = await extractAdvancedMetadataFromText(extractedText);
        metadata = convertToBasicMetadata(advancedMetadata);
        
        // Log what we found
        console.log("Advanced metadata extraction results:");
        console.log(`Title: ${metadata.title ? 'Found' : 'Not found'}`);
        console.log(`Authors: ${metadata.authors ? 'Found' : 'Not found'}`);
        console.log(`Abstract: ${metadata.abstract ? `Found (${metadata.abstract.length} chars)` : 'Not found'}`);
        console.log(`Sections: ${Object.keys(metadata.sections || {}).length} found`);
      } catch (extractError) {
        console.error("Error in advanced metadata extraction:", 
                     extractError instanceof Error ? extractError.message : String(extractError));
        
        // Fall back to basic metadata extraction
        console.log("Falling back to basic metadata extraction...");
        metadata = await extractMetadataFromPDFText(extractedText);
      }
      
      // Create paper record
      const paper = await storage.createPaper({
        userId,
        title: metadata.title || req.file.originalname,
        authors: metadata.authors || '',
        abstract: metadata.abstract || '',
        content: extractedText,
        filename: req.file.originalname,
        fileType: 'pdf',
        fileSize: req.file.size,
        tags: [],
        metadata
      });
      
      // Process paper in background (in a real app this would be a job queue)
      processPaperAsync(paper.id).catch(err => 
        console.error("Error processing paper:", err instanceof Error ? err.message : String(err)));
      
      res.json({ 
        id: paper.id,
        title: paper.title,
        isProcessing: true,
        message: "Paper uploaded and queued for processing" 
      });
    } catch (error) {
      console.error("Error uploading paper:", 
                   error instanceof Error ? error.message : String(error));
      res.status(500).json({ 
        message: "Failed to upload paper", 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  });
  
  // Get all papers for a user
  app.get("/api/papers", async (req: Request, res: Response) => {
    try {
      const userId = 1; // In a real app, would be from authenticated user
      const papers = await storage.getPapersByUserId(userId);
      
      // Don't return the full content to save bandwidth
      const simplifiedPapers = papers.map(paper => {
        const { content, ...paperWithoutContent } = paper;
        return {
          ...paperWithoutContent,
          // Include a short preview of the content
          contentPreview: content ? content.slice(0, 200) + "..." : ""
        };
      });
      
      res.json(simplifiedPapers);
    } catch (error) {
      console.error("Error getting papers:", error);
      res.status(500).json({ message: "Failed to fetch papers", error: error.message });
    }
  });
  
  // Get a specific paper
  app.get("/api/papers/:id", async (req: Request, res: Response) => {
    try {
      const paperId = parseInt(req.params.id);
      if (isNaN(paperId)) {
        return res.status(400).json({ message: "Invalid paper ID" });
      }
      
      const paper = await storage.getPaper(paperId);
      if (!paper) {
        return res.status(404).json({ message: "Paper not found" });
      }
      
      res.json(paper);
    } catch (error) {
      console.error("Error getting paper:", error);
      res.status(500).json({ message: "Failed to fetch paper", error: error.message });
    }
  });
  
  // Get paper summary
  app.get("/api/papers/:id/summary", async (req: Request, res: Response) => {
    try {
      const paperId = parseInt(req.params.id);
      if (isNaN(paperId)) {
        return res.status(400).json({ message: "Invalid paper ID" });
      }
      
      const summary = await storage.getSummaryByPaperId(paperId);
      if (!summary) {
        return res.status(404).json({ message: "Summary not found for this paper" });
      }
      
      res.json(summary);
    } catch (error) {
      console.error("Error getting summary:", error);
      res.status(500).json({ message: "Failed to fetch summary", error: error.message });
    }
  });
  
  // Get paper citations
  app.get("/api/papers/:id/citations", async (req: Request, res: Response) => {
    try {
      const paperId = parseInt(req.params.id);
      if (isNaN(paperId)) {
        return res.status(400).json({ message: "Invalid paper ID" });
      }
      
      const citations = await storage.getCitationsByPaperId(paperId);
      res.json(citations);
    } catch (error) {
      console.error("Error getting citations:", error);
      res.status(500).json({ message: "Failed to fetch citations", error: error.message });
    }
  });
  
  // Format citation
  app.post("/api/citations/format", async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        title: z.string(),
        authors: z.string(),
        year: z.string(),
        journal: z.string().optional(),
        volume: z.string().optional(),
        issue: z.string().optional(),
        pages: z.string().optional(),
        doi: z.string().optional(),
        style: z.enum(["APA", "MLA", "Chicago", "BibTeX"])
      });
      
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid citation data", errors: result.error.format() });
      }
      
      const { style, ...citation } = result.data;
      const formattedCitation = await formatCitation(citation, style);
      
      res.json({ formatted: formattedCitation });
    } catch (error) {
      console.error("Error formatting citation:", error);
      res.status(500).json({ message: "Failed to format citation", error: error.message });
    }
  });
  
  // Create annotation
  app.post("/api/annotations", async (req: Request, res: Response) => {
    try {
      const result = insertAnnotationSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid annotation data", errors: result.error.format() });
      }
      
      const annotation = await storage.createAnnotation(result.data);
      res.status(201).json(annotation);
    } catch (error) {
      console.error("Error creating annotation:", error);
      res.status(500).json({ message: "Failed to create annotation", error: error.message });
    }
  });
  
  // Get annotations for a paper
  app.get("/api/papers/:id/annotations", async (req: Request, res: Response) => {
    try {
      const paperId = parseInt(req.params.id);
      if (isNaN(paperId)) {
        return res.status(400).json({ message: "Invalid paper ID" });
      }
      
      const annotations = await storage.getAnnotationsByPaperId(paperId);
      res.json(annotations);
    } catch (error) {
      console.error("Error getting annotations:", error);
      res.status(500).json({ message: "Failed to fetch annotations", error: error.message });
    }
  });
  
  // Create a new chat
  app.post("/api/chats", async (req: Request, res: Response) => {
    try {
      const result = insertChatSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid chat data", errors: result.error.format() });
      }
      
      const chat = await storage.createChat(result.data);
      res.status(201).json(chat);
    } catch (error) {
      console.error("Error creating chat:", error);
      res.status(500).json({ message: "Failed to create chat", error: error.message });
    }
  });
  
  // Get user's chats
  app.get("/api/chats", async (req: Request, res: Response) => {
    try {
      const userId = 1; // In a real app, would be from authenticated user
      const chats = await storage.getChatsByUserId(userId);
      res.json(chats);
    } catch (error) {
      console.error("Error getting chats:", error);
      res.status(500).json({ message: "Failed to fetch chats", error: error.message });
    }
  });
  
  // Get chat messages
  app.get("/api/chats/:id/messages", async (req: Request, res: Response) => {
    try {
      const chatId = parseInt(req.params.id);
      if (isNaN(chatId)) {
        return res.status(400).json({ message: "Invalid chat ID" });
      }
      
      const messages = await storage.getMessagesByChatId(chatId);
      res.json(messages);
    } catch (error) {
      console.error("Error getting messages:", error);
      res.status(500).json({ message: "Failed to fetch messages", error: error.message });
    }
  });
  
  // Send a message to the AI assistant
  app.post("/api/chats/:id/messages", async (req: Request, res: Response) => {
    try {
      const chatId = parseInt(req.params.id);
      if (isNaN(chatId)) {
        return res.status(400).json({ message: "Invalid chat ID" });
      }
      
      const messageSchema = insertMessageSchema.extend({
        paperIds: z.array(z.number()).optional()
      });
      
      const result = messageSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid message data", errors: result.error.format() });
      }
      
      const { paperIds, ...messageData } = result.data;
      
      // Save user message
      const userMessage = await storage.createMessage({
        chatId,
        content: messageData.content,
        role: 'user'
      });
      
      // Get paper content if paperIds provided
      let paperContents = [];
      if (paperIds && paperIds.length > 0) {
        const papers = await Promise.all(
          paperIds.map(async (id) => await storage.getPaper(id))
        );
        
        // Enhance with summaries if available
        const papersWithSummaries = await Promise.all(
          papers
            .filter(paper => paper !== undefined)
            .map(async (paper) => {
              // Get paper summary if available
              const summary = await storage.getSummaryByPaperId(paper.id);
              
              // Extract sections from metadata if available
              const sections = paper.metadata?.sections || {};
              
              return {
                id: paper.id,
                title: paper.title,
                authors: paper.authors || 'Unknown',
                content: paper.content || '',
                sections: sections, // Include extracted sections
                summary: summary ? {
                  bulletPoints: summary.bulletPoints,
                  sectionWise: summary.sectionWise
                } : null
              };
            })
        );
        
        paperContents = papersWithSummaries;
      }
      
      // Analyze if the question is about authors, sections, or specific paper elements
      const lowerQuestion = messageData.content.toLowerCase();
      const isAuthorQuestion = lowerQuestion.includes('author') || lowerQuestion.includes('who wrote');
      const isSectionQuestion = lowerQuestion.includes('section') || 
                               lowerQuestion.includes('introduction') || 
                               lowerQuestion.includes('methodology') || 
                               lowerQuestion.includes('result') || 
                               lowerQuestion.includes('discussion') || 
                               lowerQuestion.includes('conclusion');
      
      // Check for specific section requests
      const sectionKeywords = ['introduction', 'methodology', 'methods', 'results', 'discussion', 
                               'conclusion', 'abstract', 'background', 'literature review', 'references'];
      
      // Find which section might be requested
      let requestedSection = '';
      for (const keyword of sectionKeywords) {
        if (lowerQuestion.includes(keyword)) {
          requestedSection = keyword;
          break;
        }
      }
      
      console.log(`Question analysis - Author question: ${isAuthorQuestion}, Section question: ${isSectionQuestion}, Requested section: ${requestedSection}`);
      
      // If we have a section-specific question, prioritize the extracted sections in the message
      if (requestedSection && paperContents.length > 0) {
        // Enhance context with section-specific information if available
        paperContents = paperContents.map(paper => {
          // Check if we have this specific section from OCR extraction
          const sectionMatches = Object.keys(paper.sections || {})
            .filter(sectionName => 
              sectionName.toLowerCase().includes(requestedSection) || 
              requestedSection.includes(sectionName.toLowerCase()));
          
          if (sectionMatches.length > 0) {
            console.log(`Found matching section "${sectionMatches[0]}" in paper ID ${paper.id}`);
            
            // Add special context to highlight this section in the query
            return {
              ...paper,
              relevantSectionName: sectionMatches[0],
              relevantSectionContent: paper.sections[sectionMatches[0]]
            };
          }
          
          // Also check in AI-generated summary sections if not found in OCR extraction
          if (paper.summary?.sectionWise) {
            const summaryMatches = Object.keys(paper.summary.sectionWise)
              .filter(sectionName => 
                sectionName.toLowerCase().includes(requestedSection) ||
                requestedSection.includes(sectionName.toLowerCase()));
            
            if (summaryMatches.length > 0) {
              console.log(`Found matching section "${summaryMatches[0]}" in AI summary for paper ID ${paper.id}`);
              
              return {
                ...paper,
                relevantSectionName: summaryMatches[0],
                relevantSectionContent: paper.summary.sectionWise[summaryMatches[0]]
              };
            }
          }
          
          return paper;
        });
      }
      
      // Get AI response with enhanced context for specific question types
      const aiResponse = await askQuestion(messageData.content, paperContents);
      
      // Save AI response
      const aiMessage = await storage.createMessage({
        chatId,
        content: aiResponse,
        role: 'assistant'
      });
      
      res.json({ userMessage, aiMessage });
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Failed to send message", error: error.message });
    }
  });
  
  // Compare papers
  app.post("/api/papers/compare", async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        paperIds: z.array(z.number()).min(2).max(5)
      });
      
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid data. Provide 2-5 paper IDs to compare", 
          errors: result.error.format() 
        });
      }
      
      const { paperIds } = result.data;
      
      // Get the papers
      const papers = await Promise.all(
        paperIds.map(async (id) => await storage.getPaper(id))
      );
      
      const validPapers = papers
        .filter(paper => paper !== undefined)
        .map(paper => ({
          title: paper.title,
          content: paper.content || ''
        }));
      
      if (validPapers.length < 2) {
        return res.status(400).json({ message: "At least 2 valid papers are required for comparison" });
      }
      
      // Compare papers
      const comparison = await comparePapers(validPapers);
      res.json(comparison);
    } catch (error) {
      console.error("Error comparing papers:", error);
      res.status(500).json({ message: "Failed to compare papers", error: error.message });
    }
  });
  
  // Generate literature review
  app.post("/api/literature-review", async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        paperIds: z.array(z.number()).min(2)
      });
      
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid data. Provide at least 2 paper IDs", 
          errors: result.error.format() 
        });
      }
      
      const { paperIds } = result.data;
      
      // Get the papers
      const papers = await Promise.all(
        paperIds.map(async (id) => await storage.getPaper(id))
      );
      
      const validPapers = papers
        .filter(paper => paper !== undefined)
        .map(paper => ({
          title: paper.title,
          authors: paper.authors || 'Unknown',
          abstract: paper.abstract || '',
          year: paper.metadata?.publicationDate || 'Unknown'
        }));
      
      if (validPapers.length < 2) {
        return res.status(400).json({ message: "At least 2 valid papers are required for a literature review" });
      }
      
      // Generate literature review
      const review = await generateLiteratureReview(validPapers);
      res.json({ review });
    } catch (error) {
      console.error("Error generating literature review:", error);
      res.status(500).json({ message: "Failed to generate literature review", error: error.message });
    }
  });
  
  // Get research goals
  app.get("/api/research-goals", async (req: Request, res: Response) => {
    try {
      const userId = 1; // In a real app, would be from authenticated user
      const goals = await storage.getResearchGoalsByUserId(userId);
      res.json(goals);
    } catch (error) {
      console.error("Error getting research goals:", error);
      res.status(500).json({ message: "Failed to fetch research goals", error: error.message });
    }
  });
  
  // Create research goal
  app.post("/api/research-goals", async (req: Request, res: Response) => {
    try {
      const result = insertResearchGoalSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid goal data", errors: result.error.format() });
      }
      
      const goal = await storage.createResearchGoal(result.data);
      res.status(201).json(goal);
    } catch (error) {
      console.error("Error creating research goal:", error);
      res.status(500).json({ message: "Failed to create research goal", error: error.message });
    }
  });
  
  // Update research goal
  app.patch("/api/research-goals/:id", async (req: Request, res: Response) => {
    try {
      const goalId = parseInt(req.params.id);
      if (isNaN(goalId)) {
        return res.status(400).json({ message: "Invalid goal ID" });
      }
      
      const goalUpdateSchema = z.object({
        description: z.string().optional(),
        isCompleted: z.boolean().optional(),
        dueDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
        completedDate: z.string().optional().transform(val => val ? new Date(val) : undefined)
      });
      
      const result = goalUpdateSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid update data", errors: result.error.format() });
      }
      
      const updatedGoal = await storage.updateResearchGoal(goalId, result.data);
      if (!updatedGoal) {
        return res.status(404).json({ message: "Research goal not found" });
      }
      
      res.json(updatedGoal);
    } catch (error) {
      console.error("Error updating research goal:", error);
      res.status(500).json({ message: "Failed to update research goal", error: error.message });
    }
  });
  
  // Get stats for dashboard
  app.get("/api/dashboard/stats", async (req: Request, res: Response) => {
    try {
      const userId = 1; // In a real app, would be from authenticated user
      
      // Get total papers
      const papers = await storage.getPapersByUserId(userId);
      
      // Get total citations
      let citationCount = 0;
      for (const paper of papers) {
        const citations = await storage.getCitationsByPaperId(paper.id);
        citationCount += citations.length;
      }
      
      // Get total AI queries (messages from user)
      const chats = await storage.getChatsByUserId(userId);
      let messageCount = 0;
      for (const chat of chats) {
        const messages = await storage.getMessagesByChatId(chat.id);
        messageCount += messages.filter(m => m.role === 'user').length;
      }
      
      res.json({
        paperCount: papers.length,
        citationCount,
        queryCount: messageCount
      });
    } catch (error) {
      console.error("Error getting dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats", error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Process a paper asynchronously (in a real app this would be in a job queue)
async function processPaperAsync(paperId: number): Promise<void> {
  try {
    // Get the paper
    const paper = await storage.getPaper(paperId);
    if (!paper || !paper.content) {
      console.error(`Paper ${paperId} not found or has no content`);
      return;
    }
    
    console.log(`Processing paper ${paperId}...`);
    
    // First, try to extract better metadata using advanced heuristics
    console.log(`Applying advanced document analysis heuristics to paper ${paperId}...`);
    
    try {
      const advancedMetadata = await extractAdvancedMetadataFromText(paper.content);
      
      // Update paper with improved metadata
      const paperMetadataUpdates: Partial<Paper> = {};
      
      // Update title if found and current one seems like a filename
      if (advancedMetadata.title && 
          (paper.title.endsWith('.pdf') || paper.title.length < 10 || paper.title === 'Untitled Document')) {
        paperMetadataUpdates.title = advancedMetadata.title;
        console.log(`Updated title from OCR analysis: ${advancedMetadata.title}`);
      }
      
      // Update authors if found and missing
      if (advancedMetadata.authors && advancedMetadata.authors.length > 0 && 
          (!paper.authors || paper.authors.trim() === '' || paper.authors === 'Unknown Author(s)')) {
        paperMetadataUpdates.authors = advancedMetadata.authors.join('; ');
        console.log(`Updated authors from OCR analysis: ${paperMetadataUpdates.authors}`);
      }
      
      // Update abstract if found and missing
      if (advancedMetadata.abstract && 
          (!paper.abstract || paper.abstract.trim() === '' || paper.abstract === 'No abstract available')) {
        paperMetadataUpdates.abstract = advancedMetadata.abstract;
        console.log(`Updated abstract from OCR analysis, ${advancedMetadata.abstract.length} characters`);
      }
      
      // Extract section content from OCR
      const sectionData: Record<string, string> = {};
      if (advancedMetadata.sections) {
        Object.keys(advancedMetadata.sections).forEach(section => {
          if (advancedMetadata.sections && advancedMetadata.sections[section]) {
            sectionData[section] = advancedMetadata.sections[section];
          }
        });
        console.log(`Extracted ${Object.keys(sectionData).length} sections from OCR analysis`);
      }
      
      // Update paper metadata if we found improvements
      if (Object.keys(paperMetadataUpdates).length > 0) {
        console.log(`Updating paper ${paperId} with improved metadata from OCR analysis`);
        // Add the section data to metadata
        const updatedMetadata = {
          ...paper.metadata,
          sections: sectionData,
          figures: advancedMetadata.figures || [],
          tables: advancedMetadata.tables || [],
          keywords: advancedMetadata.keywords || []
        };
        paperMetadataUpdates.metadata = updatedMetadata;
        
        await storage.updatePaper(paperId, paperMetadataUpdates);
      }
    } catch (analysisError) {
      console.error(`Error during advanced metadata extraction for paper ${paperId}:`, 
                   analysisError instanceof Error ? analysisError.message : String(analysisError));
      // Continue with normal processing even if advanced extraction fails
    }
    
    // Generate summary using AI
    const summary = await summarizePaper(paper.content);
    console.log(`Generated summary for paper ${paperId}`);
    
    // Save the summary
    await storage.createSummary({
      paperId,
      bulletPoints: summary.bulletPoints,
      sectionWise: summary.sectionWise
    });
    
    // Extract and update more accurate paper metadata from the AI summary
    const paperUpdates: Partial<Paper> = { isProcessed: true };
    
    // Update authors if found in AI summary and paper doesn't already have authors
    if (summary.authors && summary.authors.length > 0 && (!paper.authors || paper.authors.trim() === '')) {
      paperUpdates.authors = summary.authors.join('; ');
      console.log(`Updated authors for paper ${paperId}: ${paperUpdates.authors}`);
    }
    
    // Update abstract if found in AI summary and paper doesn't already have abstract
    if (summary.sectionWise && summary.sectionWise['Introduction'] && 
        (!paper.abstract || paper.abstract.trim() === '')) {
      paperUpdates.abstract = summary.sectionWise['Introduction'].substring(0, 500);
      console.log(`Updated abstract for paper ${paperId}`);
    }
    
    // Extract citations
    const extractedCitations = await extractCitations(paper.content);
    console.log(`Extracted ${extractedCitations.length} citations from paper ${paperId}`);
    
    for (const citation of extractedCitations) {
      await storage.createCitation({
        paperId,
        citedTitle: citation.citedTitle,
        citedAuthors: citation.citedAuthors,
        citedYear: citation.citedYear,
        citedDoi: citation.citedDoi,
        citationText: citation.citationText
      });
    }
    
    // Mark paper as processed and update other extracted metadata
    await storage.updatePaper(paperId, paperUpdates);
    
    console.log(`Completed processing paper ${paperId}`);
  } catch (error) {
    console.error(`Error processing paper ${paperId}:`, 
                 error instanceof Error ? error.message : String(error));
  }
}
