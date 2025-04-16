import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Summarize text content from a research paper
 */
export async function summarizePaper(content: string): Promise<{
  bulletPoints: string;
  sectionWise: Record<string, string>;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: 
            "You are an academic research assistant tasked with analyzing and summarizing research papers. Extract the key information and organize it into a concise summary."
        },
        {
          role: "user",
          content: `Please summarize the following research paper in two formats:
            1. A bullet-point summary of the key findings, methods, and conclusions
            2. A section-wise summary with common sections like Introduction, Methodology, Results, Discussion, etc.
            
            Format your response as JSON with keys "bulletPoints" and "sectionWise" (which should be an object with section names as keys).
            
            Here is the paper content:
            ${content.slice(0, 8000)}` // Limit to first 8000 chars to stay within token limits
        }
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content);
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
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: 
            "You are a citation analysis expert. Your task is to extract citations from academic papers accurately."
        },
        {
          role: "user",
          content: `Please extract all citations from the following paper content. 
            For each citation, provide:
            - The cited title
            - The cited authors
            - The cited year
            - The cited DOI (if available)
            - The citation text as it appears in the paper
            
            Format your response as a JSON array of citation objects.
            
            Here is the paper content:
            ${content.slice(0, 8000)}` // Limit to first 8000 chars to stay within token limits
        }
      ],
      response_format: { type: "json_object" },
    });

    const parsed = JSON.parse(response.choices[0].message.content);
    return Array.isArray(parsed) ? parsed : (parsed.citations || []);
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
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: 
            "You are a citation formatting assistant. Format the given citation information in the requested style."
        },
        {
          role: "user",
          content: `Please format this citation in ${style} style:
            Title: ${citation.title}
            Authors: ${citation.authors}
            Year: ${citation.year}
            ${citation.journal ? `Journal: ${citation.journal}` : ''}
            ${citation.volume ? `Volume: ${citation.volume}` : ''}
            ${citation.issue ? `Issue: ${citation.issue}` : ''}
            ${citation.pages ? `Pages: ${citation.pages}` : ''}
            ${citation.doi ? `DOI: ${citation.doi}` : ''}
            
            Respond with only the formatted citation text.`
        }
      ]
    });

    return response.choices[0].message.content || "Failed to format citation";
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

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: 
            "You are a research assistant AI that helps users understand academic papers. Answer questions based on the provided research papers only. If the answer cannot be found in the papers, state that clearly. When referencing information, mention which paper it came from by citing the Paper ID or title."
        },
        {
          role: "user",
          content: `I have the following research papers:\n\n${context}\n\nMy question is: ${question}`
        }
      ]
    });

    return response.choices[0].message.content || "Failed to answer question";
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

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: 
            "You are an academic writing assistant that helps researchers create literature reviews. Generate a well-structured, cohesive literature review based on the provided paper information."
        },
        {
          role: "user",
          content: `Please create a literature review based on these papers:\n\n${context}\n\nThe literature review should include:
            1. An introduction to the research area
            2. A synthesis of the key findings across papers
            3. Identification of trends, patterns, and gaps
            4. A conclusion summarizing the state of the field`
        }
      ]
    });

    return response.choices[0].message.content || "Failed to generate literature review";
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

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: 
            "You are a research analysis assistant that compares academic papers objectively and precisely."
        },
        {
          role: "user",
          content: `Compare the following research papers and provide a structured analysis of their aims, datasets, methods, results, and conclusions. Also identify key similarities and differences.
            
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
            }`
        }
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content);
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
