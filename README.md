# Research Paper AI Agent

A comprehensive AI-powered platform for managing, analyzing, and enhancing research papers with advanced document tools.

## Features

### Core Features
- **Paper Management**: Upload, organize, and manage your research papers
- **AI-Powered Summaries**: Get instant summaries of research papers
- **Citation Management**: Extract and format citations from papers
- **AI Assistant**: Ask questions about your papers and get intelligent answers
- **Citation Graph**: Visualize citation relationships between papers
- **Paper Comparison**: Compare multiple papers to identify similarities and differences
- **Annotations**: Add notes and highlights to your papers

### Advanced Features
- **Real-time PDF Editing**: Edit PDF documents directly in the browser
  - Add text annotations, highlights, and drawings
  - Collaborate on documents in real-time
  - Save edited PDFs with all annotations

- **Plagiarism Detection and Removal**:
  - Check text for potential plagiarism
  - Identify suspicious segments with confidence scores
  - Get AI-powered suggestions for rewriting problematic sections
  - Add proper citations automatically

- **Real-time Document Analysis**:
  - Analyze document readability, structure, and clarity
  - Get detailed feedback on improving your writing
  - Track document quality metrics over time
  - Receive specific suggestions for enhancement

## Technology Stack

### Frontend
- React with TypeScript
- Radix UI components with custom styling
- React Query for data fetching and caching
- Wouter for routing

### Backend
- Express.js with TypeScript
- PostgreSQL database with Drizzle ORM
- PDF.js for PDF processing
- Multer for file uploads

### AI Integration
- Google's Gemini 1.5 Flash model for advanced AI capabilities
- OpenAI integration for specialized tasks

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- API keys for Gemini and OpenAI (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Tusharkukreti07/Reasearchpaperai.git
cd Reasearchpaperai
```

2. Install dependencies:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables:
Create a `.env` file in the server directory with the following variables:
```
DATABASE_URL=postgresql://username:password@localhost:5432/researchpaperai
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
```

4. Start the development servers:
```bash
# Start the backend server
cd server
npm run dev

# Start the frontend server
cd ../client
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to all the open-source libraries that made this project possible
- Special thanks to the AI research community for advancing the field