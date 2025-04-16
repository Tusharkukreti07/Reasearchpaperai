import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { z } from "zod";
import { extractTextFromPDF, extractMetadataFromPDFText } from "./pdf/extraction";
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
  insertResearchGoalSchema
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
      
      // Extract text from the PDF
      const pdfBuffer = req.file.buffer;
      const extractedText = await extractTextFromPDF(pdfBuffer);
      
      // Extract metadata from the text
      const metadata = await extractMetadataFromPDFText(extractedText);
      
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
      processPaperAsync(paper.id).catch(err => console.error("Error processing paper:", err));
      
      res.json({ 
        id: paper.id,
        title: paper.title,
        isProcessing: true,
        message: "Paper uploaded and queued for processing" 
      });
    } catch (error) {
      console.error("Error uploading paper:", error);
      res.status(500).json({ message: "Failed to upload paper", error: error.message });
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
        
        paperContents = papers
          .filter(paper => paper !== undefined)
          .map(paper => ({
            id: paper.id,
            title: paper.title,
            content: paper.content || ''
          }));
      }
      
      // Get AI response
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
    
    // Generate summary using AI
    const summary = await summarizePaper(paper.content);
    await storage.createSummary({
      paperId,
      bulletPoints: summary.bulletPoints,
      sectionWise: summary.sectionWise
    });
    
    // Extract citations
    const extractedCitations = await extractCitations(paper.content);
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
    
    // Mark paper as processed
    await storage.updatePaper(paperId, { isProcessed: true });
    
    console.log(`Completed processing paper ${paperId}`);
  } catch (error) {
    console.error(`Error processing paper ${paperId}:`, error);
  }
}
