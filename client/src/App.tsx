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
