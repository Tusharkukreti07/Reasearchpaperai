import { Router } from 'express';
import { z } from 'zod';
import { detectPlagiarism, rewriteText, addMissingCitations, checkAndFixPlagiarism } from '../ai/plagiarism';

const router = Router();

// Schema for plagiarism check request
const plagiarismCheckSchema = z.object({
  text: z.string().min(1, "Text is required").max(10000, "Text is too long")
});

// Schema for rewrite request
const rewriteSchema = z.object({
  text: z.string().min(1, "Text is required").max(10000, "Text is too long"),
  suspiciousSegments: z.array(z.object({
    text: z.string(),
    startIndex: z.number(),
    endIndex: z.number(),
    confidence: z.number(),
    reason: z.string()
  }))
});

// Schema for citation request
const citationSchema = z.object({
  text: z.string().min(1, "Text is required").max(10000, "Text is too long")
});

// Schema for comprehensive check and fix request
const checkAndFixSchema = z.object({
  text: z.string().min(1, "Text is required").max(10000, "Text is too long")
});

// Detect plagiarism in text
router.post('/detect', async (req, res) => {
  try {
    const result = plagiarismCheckSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        message: "Invalid request data", 
        errors: result.error.format() 
      });
    }
    
    const { text } = result.data;
    const plagiarismResult = await detectPlagiarism(text);
    
    res.json(plagiarismResult);
  } catch (error) {
    console.error("Error detecting plagiarism:", error);
    res.status(500).json({ 
      message: "Failed to detect plagiarism", 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
});

// Rewrite text to remove plagiarism
router.post('/rewrite', async (req, res) => {
  try {
    const result = rewriteSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        message: "Invalid request data", 
        errors: result.error.format() 
      });
    }
    
    const { text, suspiciousSegments } = result.data;
    const rewrittenText = await rewriteText(text, suspiciousSegments);
    
    res.json({ rewrittenText });
  } catch (error) {
    console.error("Error rewriting text:", error);
    res.status(500).json({ 
      message: "Failed to rewrite text", 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
});

// Add missing citations to text
router.post('/add-citations', async (req, res) => {
  try {
    const result = citationSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        message: "Invalid request data", 
        errors: result.error.format() 
      });
    }
    
    const { text } = result.data;
    const citationResult = await addMissingCitations(text);
    
    res.json(citationResult);
  } catch (error) {
    console.error("Error adding citations:", error);
    res.status(500).json({ 
      message: "Failed to add citations", 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
});

// Comprehensive plagiarism check and fix
router.post('/check-and-fix', async (req, res) => {
  try {
    const result = checkAndFixSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        message: "Invalid request data", 
        errors: result.error.format() 
      });
    }
    
    const { text } = result.data;
    const checkAndFixResult = await checkAndFixPlagiarism(text);
    
    res.json(checkAndFixResult);
  } catch (error) {
    console.error("Error in plagiarism check and fix:", error);
    res.status(500).json({ 
      message: "Failed to check and fix plagiarism", 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
});

export default router;