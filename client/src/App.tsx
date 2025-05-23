import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

// Import pages
import Dashboard from "@/pages/dashboard";
import Papers from "@/pages/papers";
import Search from "@/pages/search";
import AIAssistant from "@/pages/ai-assistant";
import CitationGraph from "@/pages/citation-graph";
import ComparePapers from "@/pages/compare-papers";
import Annotations from "@/pages/annotations";
import Export from "@/pages/export";
import PDFEditorPage from "@/pages/pdf-editor";
import PlagiarismCheckerPage from "@/pages/plagiarism-checker";
import DocumentAnalyzerPage from "@/pages/document-analyzer";
import CitationGeneratorPage from "@/pages/citation-generator";
import ResearchCollaborationPage from "@/pages/research-collaboration";
import LiteratureReviewPage from "@/pages/literature-review";
import SmartReferenceManagerPage from "@/pages/smart-reference-manager";
import AcademicWritingAssistantPage from "@/pages/academic-writing-assistant";
import ResearchTrendAnalyzerPage from "@/pages/research-trend-analyzer";
import JournalRecommenderPage from "@/pages/journal-recommender";
import PeerReviewSimulatorPage from "@/pages/peer-review-simulator";
import VisualAbstractCreatorPage from "@/pages/visual-abstract-creator";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/papers" component={Papers} />
      <Route path="/search" component={Search} />
      <Route path="/ai-assistant" component={AIAssistant} />
      <Route path="/citation-graph" component={CitationGraph} />
      <Route path="/compare-papers" component={ComparePapers} />
      <Route path="/annotations" component={Annotations} />
      <Route path="/export" component={Export} />
      <Route path="/pdf-editor/:id" component={PDFEditorPage} />
      <Route path="/plagiarism-checker" component={PlagiarismCheckerPage} />
      <Route path="/document-analyzer" component={DocumentAnalyzerPage} />
      <Route path="/citation-generator" component={CitationGeneratorPage} />
      <Route path="/research-collaboration" component={ResearchCollaborationPage} />
      <Route path="/literature-review" component={LiteratureReviewPage} />
      <Route path="/smart-reference-manager" component={SmartReferenceManagerPage} />
      <Route path="/academic-writing-assistant" component={AcademicWritingAssistantPage} />
      <Route path="/research-trend-analyzer" component={ResearchTrendAnalyzerPage} />
      <Route path="/journal-recommender" component={JournalRecommenderPage} />
      <Route path="/peer-review-simulator" component={PeerReviewSimulatorPage} />
      <Route path="/visual-abstract-creator" component={VisualAbstractCreatorPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
