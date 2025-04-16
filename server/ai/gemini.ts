import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Initialize the Google Generative AI with the API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");

// Create a Gemini 1.5 Flash model instance
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash" 
});

// Standard safety settings
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
  },
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
  }
];

/**
 * Summarize text content from a research paper
 */
export async function summarizePaper(content: string): Promise<{
  authors?: string[];
  affiliations?: string;
  publicationInfo?: string;
  bulletPoints: string;
  sectionWise: Record<string, string>;
}> {
  try {
    const prompt = `Please thoroughly analyze and summarize the following research paper:

      1. Identify the authors and their affiliations
      2. Identify the publication date and journal/conference if available
      3. Provide a bullet-point summary of the key findings, methods, and conclusions
      4. Create a detailed section-by-section summary with the following common sections:
         - Introduction and background
         - Literature review or related work
         - Methodology or approach
         - Results or findings
         - Discussion
         - Conclusion
         - Limitations and future work
      
      Be thorough in your summary of each section. Format your response as JSON with these keys:
      - "authors": Array of author names
      - "affiliations": String of author affiliations
      - "publicationInfo": Publication date and journal/venue
      - "bulletPoints": Bullet point summary of key points
      - "sectionWise": Object with section names as keys and detailed summaries as values
      
      Here is the paper content:
      ${content.slice(0, 8000)}`; // Limit to first 8000 chars to stay within token limits

    const systemPrompt = "You are an academic research assistant tasked with thoroughly analyzing and summarizing research papers. Carefully extract all key information including author details and provide comprehensive section summaries. Be extremely attentive to author names and ensure they are correctly extracted.";
    
    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: systemPrompt + "\n\n" + prompt + "\n\nPlease format your response as valid JSON." }] }
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2048,
      },
      safetySettings
    });

    const responseText = result.response.text();
    
    // Try to extract JSON from the response text
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : responseText;
    
    try {
      return JSON.parse(jsonStr);
    } catch (jsonError) {
      console.error("Failed to parse JSON response:", jsonError);
      return {
        bulletPoints: responseText.includes("•") ? responseText : "Failed to generate bullet point summary.",
        sectionWise: { "Summary": responseText }
      };
    }
  } catch (error) {
    console.error("Error summarizing paper:", error);
    return {
      bulletPoints: "Failed to generate bullet point summary due to an error.",
      sectionWise: { error: "Failed to generate section-wise summary due to an error." }
    };
  }
}

/**
 * Extract citations from paper content
 */
export async function extractCitations(content: string): Promise<Array<{
  citedTitle: string;
  citedAuthors: string;
  citedYear: string;
  citedDoi?: string;
  citationText: string;
}>> {
  try {
    const prompt = `Please extract all citations from the following paper content. 
      For each citation, provide:
      - The cited title
      - The cited authors
      - The cited year
      - The cited DOI (if available)
      - The citation text as it appears in the paper
      
      Format your response as a JSON array of citation objects.
      
      Here is the paper content:
      ${content.slice(0, 8000)}`; // Limit to first 8000 chars to stay within token limits

    const systemPrompt = "You are a citation analysis expert. Your task is to extract citations from academic papers accurately.";
    
    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: systemPrompt + "\n\n" + prompt + "\n\nPlease format your response as valid JSON." }] }
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2048,
      },
      safetySettings
    });

    const responseText = result.response.text();
    
    // Try to extract JSON from the response text
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    const jsonStr = jsonMatch ? jsonMatch[0] : responseText;
    
    try {
      const parsed = JSON.parse(jsonStr);
      return Array.isArray(parsed) ? parsed : (parsed.citations || []);
    } catch (jsonError) {
      console.error("Failed to parse JSON response:", jsonError);
      return [];
    }
  } catch (error) {
    console.error("Error extracting citations:", error);
    return [];
  }
}

/**
 * Format a citation in different styles
 */
export async function formatCitation(
  citation: {
    title: string;
    authors: string;
    year: string;
    journal?: string;
    volume?: string;
    issue?: string;
    pages?: string;
    doi?: string;
  },
  style: "APA" | "MLA" | "Chicago" | "BibTeX"
): Promise<string> {
  try {
    const prompt = `Please format this citation in ${style} style:
      Title: ${citation.title}
      Authors: ${citation.authors}
      Year: ${citation.year}
      ${citation.journal ? `Journal: ${citation.journal}` : ''}
      ${citation.volume ? `Volume: ${citation.volume}` : ''}
      ${citation.issue ? `Issue: ${citation.issue}` : ''}
      ${citation.pages ? `Pages: ${citation.pages}` : ''}
      ${citation.doi ? `DOI: ${citation.doi}` : ''}
      
      Respond with only the formatted citation text.`;

    const systemPrompt = "You are a citation formatting assistant. Format the given citation information in the requested style.";
    
    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: systemPrompt + "\n\n" + prompt }] }
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 1024,
      },
      safetySettings
    });

    return result.response.text() || "Failed to format citation";
  } catch (error) {
    console.error("Error formatting citation:", error);
    return "Error: Failed to format citation";
  }
}

/**
 * Ask a question about one or more papers
 */
export async function askQuestion(question: string, paperContents: Array<{id: number; title: string; content: string}>): Promise<string> {
  try {
    // Create a context from the papers
    const context = paperContents.map(paper => 
      `Paper Title: ${paper.title}\nPaper ID: ${paper.id}\nContent:\n${paper.content.slice(0, 4000)}`
    ).join('\n\n');

    const prompt = `I have the following research papers:\n\n${context}\n\nMy question is: ${question}`;
    
    const systemPrompt = "You are a research assistant AI that helps users understand academic papers. Pay careful attention to accurately identifying author names, publication dates, and section details when asked. When users ask about authors, always provide the complete author list with their affiliations if available. For section-specific questions, provide detailed summaries of those sections. Answer questions based on the provided research papers only. If the answer cannot be found in the papers, state that clearly. When referencing information, mention which paper it came from by citing the Paper ID or title.";
    
    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: systemPrompt + "\n\n" + prompt }] }
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2048,
      },
      safetySettings
    });

    return result.response.text() || "Failed to answer question";
  } catch (error) {
    console.error("Error asking question:", error);
    return "Error: Failed to process your question";
  }
}

/**
 * Generate a literature review based on multiple papers
 */
export async function generateLiteratureReview(papers: Array<{title: string; authors: string; abstract: string; year: string}>): Promise<string> {
  try {
    // Create a context from the papers
    const context = papers.map(paper => 
      `Title: ${paper.title}\nAuthors: ${paper.authors}\nYear: ${paper.year}\nAbstract: ${paper.abstract}`
    ).join('\n\n');

    const prompt = `Please create a literature review based on these papers:\n\n${context}\n\nThe literature review should include:
      1. An introduction to the research area
      2. A synthesis of the key findings across papers
      3. Identification of trends, patterns, and gaps
      4. A conclusion summarizing the state of the field`;
      
    const systemPrompt = "You are an academic writing assistant that helps researchers create literature reviews. Generate a well-structured, cohesive literature review based on the provided paper information.";
    
    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: systemPrompt + "\n\n" + prompt }] }
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 4096,
      },
      safetySettings
    });

    return result.response.text() || "Failed to generate literature review";
  } catch (error) {
    console.error("Error generating literature review:", error);
    return "Error: Failed to generate literature review";
  }
}

/**
 * Compare multiple research papers
 */
export async function comparePapers(papers: Array<{title: string; content: string}>): Promise<{
  aims: Record<string, string>;
  datasets: Record<string, string>;
  methods: Record<string, string>;
  results: Record<string, string>;
  conclusions: Record<string, string>;
  similarities: string[];
  differences: string[];
}> {
  try {
    const paperSummaries = papers.map((paper, index) => 
      `Paper ${index + 1}: ${paper.title}\n\n${paper.content.slice(0, 4000)}`
    ).join('\n\n---\n\n');

    const prompt = `Compare the following research papers and provide a structured analysis of their aims, datasets, methods, results, and conclusions. Also identify key similarities and differences.
      
      ${paperSummaries}
      
      Format your response as JSON with the following structure:
      {
        "aims": {"Paper 1": "...", "Paper 2": "..."},
        "datasets": {"Paper 1": "...", "Paper 2": "..."},
        "methods": {"Paper 1": "...", "Paper 2": "..."},
        "results": {"Paper 1": "...", "Paper 2": "..."},
        "conclusions": {"Paper 1": "...", "Paper 2": "..."},
        "similarities": ["similarity 1", "similarity 2"],
        "differences": ["difference 1", "difference 2"]
      }`;

    const systemPrompt = "You are a research analysis assistant that compares academic papers objectively and precisely.";
    
    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: systemPrompt + "\n\n" + prompt + "\n\nPlease format your response as valid JSON." }] }
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 4096,
      },
      safetySettings
    });

    const responseText = result.response.text();
    
    // Try to extract JSON from the response text
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : responseText;
    
    try {
      return JSON.parse(jsonStr);
    } catch (jsonError) {
      console.error("Failed to parse JSON response:", jsonError);
      return {
        aims: { error: "Failed to compare paper aims" },
        datasets: { error: "Failed to compare datasets" },
        methods: { error: "Failed to compare methods" },
        results: { error: "Failed to compare results" },
        conclusions: { error: "Failed to compare conclusions" },
        similarities: ["Failed to identify similarities"],
        differences: ["Failed to identify differences"]
      };
    }
  } catch (error) {
    console.error("Error comparing papers:", error);
    return {
      aims: { error: "Failed to compare paper aims" },
      datasets: { error: "Failed to compare datasets" },
      methods: { error: "Failed to compare methods" },
      results: { error: "Failed to compare results" },
      conclusions: { error: "Failed to compare conclusions" },
      similarities: ["Failed to identify similarities"],
      differences: ["Failed to identify differences"]
    };
  }
}