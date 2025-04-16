import { createWorker } from 'tesseract.js';
import * as fs from 'fs';
import * as path from 'path';
import { savePDFToTempFile, cleanupTempFile } from './extraction';

/**
 * Extract text from PDF using OCR
 */
export async function extractTextFromPDFWithOCR(pdfBuffer: Buffer): Promise<string> {
  try {
    console.log('Starting OCR-based text extraction');
    
    // Save PDF to temp file
    const tempFilePath = await savePDFToTempFile(pdfBuffer);
    
    // Initialize Tesseract worker
    const worker = await createWorker('eng');
    
    // OCR the PDF
    console.log('Running OCR on PDF...');
    const { data } = await worker.recognize(tempFilePath);
    
    // Terminate the worker
    await worker.terminate();
    
    // Clean up the temp file
    await cleanupTempFile(tempFilePath);
    
    console.log('OCR completed successfully');
    return data.text;
  } catch (error) {
    console.error('Error extracting text with OCR:', error);
    throw error;
  }
}

/**
 * Advanced metadata extraction using heuristics
 */
export interface AdvancedExtractedMetadata {
  title?: string;
  authors?: string[];
  authorAffiliations?: string[];
  abstract?: string;
  keywords?: string[];
  sections?: Record<string, string>;
  references?: string[];
  publicationInfo?: string;
  figures?: Array<{id: string, caption: string}>;
  tables?: Array<{id: string, caption: string}>;
  equations?: string[];
}

/**
 * Extract advanced metadata using heuristics
 */
export async function extractAdvancedMetadataFromText(text: string): Promise<AdvancedExtractedMetadata> {
  const metadata: AdvancedExtractedMetadata = {
    authors: [],
    authorAffiliations: [],
    sections: {},
    references: [],
    keywords: [],
    figures: [],
    tables: [],
    equations: []
  };
  
  console.log('Extracting advanced metadata using heuristics');
  
  try {
    // Split into lines for easier processing
    const lines = text.split('\n').map(line => line.trim());
    
    // Identify document parts
    let currentSection = '';
    let inAbstract = false;
    let inReferences = false;
    let sectionContent = '';
    
    // Get the first page content (roughly first 15% of text) for title and author detection
    const firstPageText = text.substring(0, Math.floor(text.length * 0.15));
    const firstPageLines = firstPageText.split('\n').map(line => line.trim());
    
    // Extract title - usually the first non-empty line in the document
    // Often the largest font or ALL CAPS or Title Case
    for (let i = 0; i < firstPageLines.length; i++) {
      const line = firstPageLines[i];
      if (line && line.length > 10 && !line.toLowerCase().includes('journal of') && !line.match(/^(vol|volume|issue)/i)) {
        metadata.title = line;
        break;
      }
    }
    
    // Extract authors - usually after the title, before the abstract
    // Look for patterns like multiple names separated by commas, with possible superscripts
    // Look for email addresses with @ - strong indicator of author line
    let potentialAuthorLines = [];
    let authorLineIndex = -1;
    
    if (metadata.title) {
      const titleIndex = firstPageLines.findIndex(line => line === metadata.title);
      if (titleIndex !== -1) {
        // Authors typically appear within the next 5 lines after title
        for (let i = titleIndex + 1; i < Math.min(titleIndex + 6, firstPageLines.length); i++) {
          const line = firstPageLines[i];
          
          // Skip empty lines
          if (!line.trim()) continue;
          
          // Check if line contains email indicators
          if (line.includes('@') || 
              // Check for comma-separated names pattern
              (line.includes(',') && !line.includes(':') && !line.toLowerCase().includes('abstract'))) {
            potentialAuthorLines.push(line);
            if (authorLineIndex === -1) authorLineIndex = i;
          }
        }
      }
    }
    
    if (potentialAuthorLines.length > 0) {
      // Join multiple author lines if they exist
      const authorText = potentialAuthorLines.join(' ');
      
      // Try to separate individual authors
      // Authors are often separated by commas or 'and'
      let authors = authorText.split(/,(?![^(]*\))|(?:\s+and\s+)/i)
        .map(author => author.trim())
        .filter(author => author && !author.includes('@') && author.length > 1);
      
      metadata.authors = authors;
      
      // Look for affiliations - often after author line with university names
      if (authorLineIndex !== -1) {
        for (let i = authorLineIndex + 1; i < Math.min(authorLineIndex + 5, firstPageLines.length); i++) {
          const line = firstPageLines[i].trim();
          if (line && 
              (line.toLowerCase().includes('university') || 
               line.toLowerCase().includes('institute') || 
               line.toLowerCase().includes('department') || 
               line.toLowerCase().includes('school'))) {
            metadata.authorAffiliations.push(line);
          }
        }
      }
    }
    
    // Process the entire text line by line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines
      if (!line) continue;
      
      // Detect abstract section
      if (line.toLowerCase() === 'abstract' || line.match(/^abstract[\s\.]/) || line.match(/^ABSTRACT[\s\.]/)) {
        inAbstract = true;
        inReferences = false;
        currentSection = '';
        continue;
      }
      
      // Extract abstract content
      if (inAbstract) {
        // Abstract typically ends when we hit keywords, introduction, or another section header
        if (line.toLowerCase().startsWith('keywords') || 
            line.match(/^(1\.?\s+|i\.?\s+)?introduction/i) || 
            line.match(/^(2\.?\s+|ii\.?\s+)/i) ||
            line.match(/^[0-9]+[\.\s]+[A-Z]/) // Numbered section
           ) {
          inAbstract = false;
          metadata.abstract = sectionContent.trim();
          sectionContent = '';
          
          // If this is the keywords line, extract keywords
          if (line.toLowerCase().startsWith('keywords')) {
            const keywordText = line.substring(line.toLowerCase().indexOf('keywords') + 8).trim();
            if (keywordText) {
              metadata.keywords = keywordText
                .split(/[,;]/)
                .map(keyword => keyword.trim())
                .filter(keyword => keyword);
            }
          }
        } else {
          sectionContent += line + ' ';
        }
        continue;
      }
      
      // Detect keywords if not caught in abstract section
      if (line.toLowerCase().startsWith('keywords') || line.toLowerCase().startsWith('key words')) {
        const keywordText = line.substring(line.toLowerCase().indexOf('words') + 5).trim();
        metadata.keywords = keywordText
          .split(/[,;]/)
          .map(keyword => keyword.trim())
          .filter(keyword => keyword);
        continue;
      }
      
      // Detect section headers
      // Look for common section patterns: numbered sections, ALL CAPS, or Title Case headers
      if (line.match(/^[0-9]+[\.\s]+[A-Z]/) || // Numbered sections like "1. Introduction"
          line.match(/^[IVX]+[\.\s]+[A-Z]/) || // Roman numeral sections like "I. Introduction"
          (line === line.toUpperCase() && line.length > 3 && !line.includes('FIGURE') && !line.includes('TABLE')) || // ALL CAPS headers
          (line.match(/^[A-Z][a-z]+(\s+[A-Z][a-z]+){0,3}$/) && i > 0 && !lines[i-1].trim() && !lines[i+1]?.trim())) { // Title Case isolated headers
        
        // If we were in a section, save its content
        if (currentSection) {
          metadata.sections[currentSection] = sectionContent.trim();
        }
        
        // Start new section
        currentSection = line.trim();
        sectionContent = '';
        inReferences = currentSection.toLowerCase().includes('reference') || 
                       currentSection.toLowerCase().includes('bibliography');
        continue;
      }
      
      // Detect references section if not caught by section header pattern
      if (!inReferences && 
          (line.toLowerCase() === 'references' || 
           line.toLowerCase() === 'bibliography' || 
           line.toLowerCase() === 'works cited')) {
        if (currentSection) {
          metadata.sections[currentSection] = sectionContent.trim();
        }
        currentSection = 'References';
        sectionContent = '';
        inReferences = true;
        continue;
      }
      
      // Extract references
      if (inReferences) {
        // References often start with numbers, brackets, or author names
        if (line.match(/^\[[0-9]+\]/) || // [1] style
            line.match(/^[0-9]+\./) ||   // 1. style
            line.match(/^\([A-Za-z]/) || // (Author style
            line.match(/^[A-Z][a-z]+,/)) { // Author, Initial style
          metadata.references.push(line);
        } else if (metadata.references.length > 0) {
          // Continuation of previous reference
          metadata.references[metadata.references.length - 1] += ' ' + line;
        }
        // Also accumulate in section content
        sectionContent += line + ' ';
        continue;
      }
      
      // Extract figures
      if (line.match(/^Fig(ure)?\.?\s*[0-9]+:?/i) || line.match(/^Figure\s*[0-9]+[\.:]?/i)) {
        const figureMatch = line.match(/^Fig(ure)?\.?\s*([0-9]+):?(.*)/i);
        if (figureMatch) {
          const figureId = 'Figure ' + figureMatch[2];
          const caption = (figureMatch[3] || '').trim();
          metadata.figures.push({ id: figureId, caption });
        }
        // Also accumulate in section content
        sectionContent += line + ' ';
        continue;
      }
      
      // Extract tables
      if (line.match(/^Table\.?\s*[0-9]+:?/i) || line.match(/^TABLE\s*[0-9]+[\.:]?/i)) {
        const tableMatch = line.match(/^Table\.?\s*([0-9]+):?(.*)/i);
        if (tableMatch) {
          const tableId = 'Table ' + tableMatch[1];
          const caption = (tableMatch[2] || '').trim();
          metadata.tables.push({ id: tableId, caption });
        }
        // Also accumulate in section content
        sectionContent += line + ' ';
        continue;
      }
      
      // Extract equations - often surrounded by special characters or indented
      if (line.includes('$$') || line.includes('\\begin{equation}') || 
          (line.trim().startsWith('$') && line.trim().endsWith('$')) ||
          // Look for equation numbers in parentheses, common in papers
          line.match(/\([0-9]+\)$/) && 
          (line.includes('=') || line.includes('+') || line.includes('-') || 
           line.includes('∫') || line.includes('∑') || line.includes('∏'))) {
        metadata.equations.push(line);
      }
      
      // Accumulate content for current section
      if (currentSection) {
        sectionContent += line + ' ';
      }
    }
    
    // Save last section content if any
    if (currentSection && !inReferences) {
      metadata.sections[currentSection] = sectionContent.trim();
    }
    
    console.log('Completed advanced metadata extraction');
    
    return metadata;
  } catch (error) {
    console.error('Error extracting advanced metadata:', error);
    return metadata;
  }
}