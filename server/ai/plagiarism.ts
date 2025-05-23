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
 * Detect potential plagiarism in text
 */
export async function detectPlagiarism(text: string): Promise<{
  hasPlagiarism: boolean;
  plagiarismScore: number;
  suspiciousSegments: Array<{
    text: string;
    startIndex: number;
    endIndex: number;
    confidence: number;
    reason: string;
  }>;
}> {
  try {
    const prompt = `Analyze the following text for potential plagiarism. Look for:
      1. Common phrases or sentences that appear to be directly copied from standard academic sources
      2. Text that doesn't match the style of the surrounding content
      3. Overly sophisticated language that seems inconsistent with the author's voice
      4. Technical terminology used without proper context or explanation
      
      For each suspicious segment, provide:
      - The exact text
      - Start and end character indices
      - Confidence score (0.0-1.0)
      - Reason for suspicion
      
      Also provide an overall plagiarism score from 0.0 to 1.0, where 0.0 means no plagiarism detected and 1.0 means definitely plagiarized.
      
      Format your response as JSON with these keys:
      - "hasPlagiarism": boolean
      - "plagiarismScore": number
      - "suspiciousSegments": array of objects with "text", "startIndex", "endIndex", "confidence", and "reason" keys
      
      Here is the text to analyze:
      ${text}`;

    const systemPrompt = "You are a plagiarism detection expert. Analyze the provided text for signs of plagiarism and provide detailed, specific feedback. Be thorough but fair in your assessment.";
    
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
      const parsed = JSON.parse(jsonStr);
      return {
        hasPlagiarism: parsed.hasPlagiarism || false,
        plagiarismScore: parsed.plagiarismScore || 0,
        suspiciousSegments: parsed.suspiciousSegments || []
      };
    } catch (jsonError) {
      console.error("Failed to parse JSON response:", jsonError);
      return {
        hasPlagiarism: false,
        plagiarismScore: 0,
        suspiciousSegments: []
      };
    }
  } catch (error) {
    console.error("Error detecting plagiarism:", error);
    return {
      hasPlagiarism: false,
      plagiarismScore: 0,
      suspiciousSegments: []
    };
  }
}

/**
 * Rewrite text to remove plagiarism
 */
export async function rewriteText(text: string, suspiciousSegments: Array<{
  text: string;
  startIndex: number;
  endIndex: number;
  confidence: number;
  reason: string;
}>): Promise<string> {
  try {
    // If no suspicious segments, return the original text
    if (suspiciousSegments.length === 0) {
      return text;
    }
    
    // Sort segments by start index to process them in order
    const sortedSegments = [...suspiciousSegments].sort((a, b) => a.startIndex - b.startIndex);
    
    // Create a prompt that highlights the suspicious segments
    let textWithMarkers = text;
    let offset = 0;
    
    sortedSegments.forEach((segment, index) => {
      const startMarker = `[SUSPICIOUS_${index}_START]`;
      const endMarker = `[SUSPICIOUS_${index}_END]`;
      
      const adjustedStart = segment.startIndex + offset;
      offset += startMarker.length;
      
      const adjustedEnd = segment.endIndex + offset;
      offset += endMarker.length;
      
      textWithMarkers = 
        textWithMarkers.substring(0, adjustedStart) + 
        startMarker + 
        textWithMarkers.substring(adjustedStart, adjustedEnd) + 
        endMarker + 
        textWithMarkers.substring(adjustedEnd);
    });
    
    const prompt = `Rewrite the following text to remove potential plagiarism. The suspicious segments are marked with [SUSPICIOUS_X_START] and [SUSPICIOUS_X_END] tags.
      
      For each suspicious segment:
      1. Completely rewrite it in a different style while preserving the meaning
      2. Use simpler language where possible
      3. Restructure sentences to avoid direct copying
      4. Add proper citations if the information appears to be from a specific source
      
      Return the entire text with the suspicious segments replaced. Do NOT include the [SUSPICIOUS_X_START] and [SUSPICIOUS_X_END] markers in your response.
      
      Here is the text to rewrite:
      ${textWithMarkers}`;

    const systemPrompt = "You are an academic writing assistant specializing in helping researchers avoid plagiarism. Rewrite the marked sections of text to eliminate potential plagiarism while preserving the original meaning.";
    
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

    return result.response.text() || text;
  } catch (error) {
    console.error("Error rewriting text:", error);
    return text;
  }
}

/**
 * Check if text contains citations and add them if missing
 */
export async function addMissingCitations(text: string): Promise<{
  textWithCitations: string;
  addedCitations: Array<{
    insertionPoint: number;
    citationText: string;
    reason: string;
  }>;
}> {
  try {
    const prompt = `Analyze the following academic text and identify statements that should have citations but don't.
      For each statement that needs a citation:
      1. Identify the exact location where a citation should be added
      2. Suggest appropriate citation text (in a generic format like "(Author, Year)")
      3. Explain why this statement needs a citation
      
      Then, provide a version of the text with these citations added.
      
      Format your response as JSON with these keys:
      - "textWithCitations": the original text with citations added
      - "addedCitations": array of objects with "insertionPoint" (character index), "citationText", and "reason" keys
      
      Here is the text to analyze:
      ${text}`;

    const systemPrompt = "You are an academic writing assistant specializing in proper citation practices. Identify statements in the text that make factual claims, reference specific research, or present statistics that should be cited. Add appropriate generic citations where needed.";
    
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
      const parsed = JSON.parse(jsonStr);
      return {
        textWithCitations: parsed.textWithCitations || text,
        addedCitations: parsed.addedCitations || []
      };
    } catch (jsonError) {
      console.error("Failed to parse JSON response:", jsonError);
      return {
        textWithCitations: text,
        addedCitations: []
      };
    }
  } catch (error) {
    console.error("Error adding citations:", error);
    return {
      textWithCitations: text,
      addedCitations: []
    };
  }
}

/**
 * Comprehensive plagiarism check and fix
 */
export async function checkAndFixPlagiarism(text: string): Promise<{
  originalText: string;
  rewrittenText: string;
  plagiarismDetected: boolean;
  plagiarismScore: number;
  suspiciousSegments: Array<{
    text: string;
    startIndex: number;
    endIndex: number;
    confidence: number;
    reason: string;
  }>;
  addedCitations: Array<{
    insertionPoint: number;
    citationText: string;
    reason: string;
  }>;
}> {
  try {
    // Step 1: Detect plagiarism
    const plagiarismResult = await detectPlagiarism(text);
    
    // Step 2: Rewrite suspicious segments
    const rewrittenText = await rewriteText(text, plagiarismResult.suspiciousSegments);
    
    // Step 3: Add missing citations to the rewritten text
    const citationResult = await addMissingCitations(rewrittenText);
    
    return {
      originalText: text,
      rewrittenText: citationResult.textWithCitations,
      plagiarismDetected: plagiarismResult.hasPlagiarism,
      plagiarismScore: plagiarismResult.plagiarismScore,
      suspiciousSegments: plagiarismResult.suspiciousSegments,
      addedCitations: citationResult.addedCitations
    };
  } catch (error) {
    console.error("Error in plagiarism check and fix:", error);
    return {
      originalText: text,
      rewrittenText: text,
      plagiarismDetected: false,
      plagiarismScore: 0,
      suspiciousSegments: [],
      addedCitations: []
    };
  }
}