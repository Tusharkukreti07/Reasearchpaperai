declare module 'pdf-parse' {
  interface PDFParseOptions {
    max?: number;
    pagerender?: (pageData: any) => string;
  }

  interface PDFParseData {
    numpages: number;
    numrender: number;
    info: Record<string, any>;
    metadata: Record<string, any>;
    text: string;
    version: string;
  }

  function parse(dataBuffer: Buffer, options?: PDFParseOptions): Promise<PDFParseData>;
  
  export = parse;
}