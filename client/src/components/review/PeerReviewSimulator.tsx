import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  MessageSquare,
  Download,
  RefreshCw,
  Lightbulb,
  BarChart,
  Clipboard,
  Edit,
  Save
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ReviewFeedback {
  section: string;
  rating: 'excellent' | 'good' | 'fair' | 'poor';
  comments: string;
  suggestions: string[];
}

interface ReviewResult {
  overallScore: number;
  recommendation: 'accept' | 'minor_revisions' | 'major_revisions' | 'reject';
  strengths: string[];
  weaknesses: string[];
  feedback: ReviewFeedback[];
  summary: string;
}

const PeerReviewSimulator: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [paperTitle, setPaperTitle] = useState('');
  const [paperAbstract, setPaperAbstract] = useState('');
  const [paperContent, setPaperContent] = useState('');
  const [journalType, setJournalType] = useState('');
  const [reviewerType, setReviewerType] = useState('balanced');
  const [loading, setLoading] = useState(false);
  const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null);
  const [editingResponse, setEditingResponse] = useState(false);
  const [responseText, setResponseText] = useState('');

  // Sample review result (in a real app, this would come from an AI model)
  const sampleReviewResult: ReviewResult = {
    overallScore: 7.2,
    recommendation: 'minor_revisions',
    strengths: [
      'Novel approach to the research problem',
      'Comprehensive literature review',
      'Clear methodology description',
      'Interesting findings with potential impact'
    ],
    weaknesses: [
      'Some statistical analyses need more justification',
      'Discussion section could be more thorough',
      'Limited sample size affects generalizability',
      'Some figures need improvement for clarity'
    ],
    feedback: [
      {
        section: 'Abstract',
        rating: 'good',
        comments: 'The abstract provides a clear overview of the study, but could be more concise. Consider reducing the background information and focusing more on the key findings and implications.',
        suggestions: [
          'Reduce background information by 30%',
          'Add 1-2 sentences about the implications of your findings',
          'Include a brief mention of limitations'
        ]
      },
      {
        section: 'Introduction',
        rating: 'excellent',
        comments: 'The introduction effectively establishes the research context and clearly articulates the research gap. The research questions are well-formulated and the significance of the study is well-justified.',
        suggestions: [
          'Consider adding a brief paragraph about theoretical implications',
          'The flow could be improved by reorganizing paragraphs 3 and 4'
        ]
      },
      {
        section: 'Methodology',
        rating: 'fair',
        comments: 'The methodology section provides adequate information about the research design, but lacks sufficient detail about the data collection procedures. The sample selection process needs more justification, and the statistical analyses should be explained more thoroughly.',
        suggestions: [
          'Add more details about participant recruitment',
          'Justify the choice of statistical tests',
          'Include power analysis for sample size determination',
          'Provide more information about the validity and reliability of instruments'
        ]
      },
      {
        section: 'Results',
        rating: 'good',
        comments: 'The results are presented clearly and the tables/figures are generally well-designed. However, some statistical results need more context and interpretation. The organization of this section could be improved for better flow.',
        suggestions: [
          'Add brief interpretations after each statistical result',
          'Consider reorganizing results by research question rather than by analysis type',
          'Improve Figure 3 for better clarity',
          'Add confidence intervals to your results where appropriate'
        ]
      },
      {
        section: 'Discussion',
        rating: 'fair',
        comments: 'The discussion addresses the main findings but does not sufficiently connect them to the broader literature. The theoretical implications are underdeveloped, and the limitations section needs expansion. The conclusion is somewhat abrupt.',
        suggestions: [
          'Expand on theoretical implications',
          'Add more connections to previous literature',
          'Develop a more comprehensive limitations section',
          'Strengthen the conclusion with clearer future research directions'
        ]
      },
      {
        section: 'References',
        rating: 'good',
        comments: 'The reference list is comprehensive and follows the required format. However, some recent relevant studies are missing, and a few citations in the text do not appear in the reference list.',
        suggestions: [
          'Add these missing references: [specific references would be listed]',
          'Check for consistency between in-text citations and reference list',
          'Consider adding 2-3 more recent studies (published in the last 2 years)'
        ]
      }
    ],
    summary: 'This manuscript presents a valuable contribution to the field with its novel approach and interesting findings. The research is generally well-executed, but several aspects require revision before it meets the standards for publication. The methodology needs more detail and justification, the discussion should be expanded to better connect findings to existing literature, and several minor issues with figures and references need to be addressed. With these revisions, the paper has good potential for publication.'
  };

  const handleSimulateReview = () => {
    if (!paperTitle.trim() || (!paperAbstract.trim() && !paperContent.trim())) {
      toast({
        title: 'Input required',
        description: 'Please enter at least the paper title and either the abstract or full content.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setReviewResult(sampleReviewResult);
      setLoading(false);
      setActiveTab('results');
      
      toast({
        title: 'Review completed',
        description: 'Your simulated peer review is ready.',
      });
    }, 3000);
  };

  const handleClear = () => {
    setPaperTitle('');
    setPaperAbstract('');
    setPaperContent('');
    setJournalType('');
    setReviewerType('balanced');
    setReviewResult(null);
    setActiveTab('upload');
  };

  const handleStartResponse = () => {
    setEditingResponse(true);
    setResponseText('Dear Editor,\n\nThank you for the opportunity to revise our manuscript. We appreciate the reviewer\'s thoughtful comments and have addressed them as follows:\n\n[Your response to reviewers would go here]\n\nSincerely,\nThe Authors');
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-blue-500';
      case 'fair': return 'text-amber-500';
      case 'poor': return 'text-red-500';
      default: return '';
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'accept': return 'bg-green-100 text-green-800';
      case 'minor_revisions': return 'bg-blue-100 text-blue-800';
      case 'major_revisions': return 'bg-amber-100 text-amber-800';
      case 'reject': return 'bg-red-100 text-red-800';
      default: return '';
    }
  };

  const getRecommendationText = (recommendation: string) => {
    switch (recommendation) {
      case 'accept': return 'Accept';
      case 'minor_revisions': return 'Minor Revisions';
      case 'major_revisions': return 'Major Revisions';
      case 'reject': return 'Reject';
      default: return '';
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Peer Review Simulator</CardTitle>
          <CardDescription>
            Get realistic peer review feedback on your manuscript before submission to increase your chances of acceptance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="upload">Paper Details</TabsTrigger>
              <TabsTrigger value="settings">Review Settings</TabsTrigger>
              <TabsTrigger value="results" disabled={!reviewResult}>Review Results</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="paper-title">Paper Title</Label>
                  <Input 
                    id="paper-title"
                    placeholder="Enter the title of your paper" 
                    value={paperTitle}
                    onChange={(e) => setPaperTitle(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="paper-abstract">Abstract</Label>
                  <Textarea 
                    id="paper-abstract"
                    placeholder="Paste your paper's abstract here" 
                    className="min-h-[150px]"
                    value={paperAbstract}
                    onChange={(e) => setPaperAbstract(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="paper-content">Full Paper Content (Optional)</Label>
                  <Textarea 
                    id="paper-content"
                    placeholder="For more accurate review, paste your full paper content here" 
                    className="min-h-[200px]"
                    value={paperContent}
                    onChange={(e) => setPaperContent(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-6 border-gray-300">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2">
                      <Button variant="outline">
                        Upload PDF
                      </Button>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Or drag and drop your paper (PDF, DOCX, or LaTeX)
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="journal-type">Target Journal Type</Label>
                  <Select onValueChange={setJournalType}>
                    <SelectTrigger id="journal-type">
                      <SelectValue placeholder="Select journal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top_tier">Top-tier (e.g., Nature, Science)</SelectItem>
                      <SelectItem value="high_impact">High Impact Factor (Q1)</SelectItem>
                      <SelectItem value="mid_tier">Mid-tier Journals (Q2)</SelectItem>
                      <SelectItem value="specialized">Specialized Field Journals</SelectItem>
                      <SelectItem value="open_access">Open Access Journals</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    This helps simulate the appropriate level of scrutiny for your target journal.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Label>Reviewer Personality</Label>
                  <RadioGroup value={reviewerType} onValueChange={setReviewerType}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="supportive" id="supportive" />
                      <Label htmlFor="supportive">Supportive</Label>
                      <span className="text-sm text-muted-foreground ml-2">
                        (Focuses more on strengths, provides constructive feedback)
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="balanced" id="balanced" />
                      <Label htmlFor="balanced">Balanced</Label>
                      <span className="text-sm text-muted-foreground ml-2">
                        (Equal focus on strengths and weaknesses)
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="critical" id="critical" />
                      <Label htmlFor="critical">Critical</Label>
                      <span className="text-sm text-muted-foreground ml-2">
                        (Rigorous scrutiny, focuses on methodological issues and gaps)
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nitpicky" id="nitpicky" />
                      <Label htmlFor="nitpicky">Nitpicky</Label>
                      <span className="text-sm text-muted-foreground ml-2">
                        (Attention to small details, formatting, references)
                      </span>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="pt-4">
                  <Button onClick={handleSimulateReview} disabled={loading} className="w-full">
                    {loading ? 'Generating Review...' : 'Simulate Peer Review'}
                  </Button>
                  <p className="text-sm text-center text-muted-foreground mt-2">
                    This process may take 1-2 minutes depending on paper length.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="results">
              {reviewResult && (
                <div className="space-y-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">Review Summary</h3>
                      <div className="flex items-center space-x-4">
                        <div>
                          <span className="text-sm font-medium">Overall Score:</span>
                          <div className="flex items-center">
                            <span className="text-2xl font-bold">{reviewResult.overallScore.toFixed(1)}</span>
                            <span className="text-sm text-muted-foreground">/10</span>
                          </div>
                        </div>
                        <Separator orientation="vertical" className="h-10" />
                        <div>
                          <span className="text-sm font-medium">Recommendation:</span>
                          <div>
                            <Badge className={getRecommendationColor(reviewResult.recommendation)}>
                              {getRecommendationText(reviewResult.recommendation)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4 md:mt-0">
                      <Button variant="outline" size="sm" onClick={handleClear}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        New Review
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export PDF
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-green-600 flex items-center">
                          <CheckCircle2 className="mr-2 h-5 w-5" />
                          Strengths
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {reviewResult.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-red-600 flex items-center">
                          <XCircle className="mr-2 h-5 w-5" />
                          Weaknesses
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {reviewResult.weaknesses.map((weakness, index) => (
                            <li key={index} className="flex items-start">
                              <XCircle className="mr-2 h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                              <span>{weakness}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Detailed Feedback by Section</CardTitle>
                      <CardDescription>
                        Review comments and suggestions for each section of your paper
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        {reviewResult.feedback.map((section, index) => (
                          <AccordionItem key={index} value={`section-${index}`}>
                            <AccordionTrigger>
                              <div className="flex items-center">
                                <span>{section.section}</span>
                                <Badge variant="outline" className={`ml-2 ${getRatingColor(section.rating)}`}>
                                  {section.rating.charAt(0).toUpperCase() + section.rating.slice(1)}
                                </Badge>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-2">Comments:</h4>
                                  <p className="text-muted-foreground">{section.comments}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2 flex items-center">
                                    <Lightbulb className="mr-2 h-4 w-4 text-amber-500" />
                                    Suggestions for Improvement:
                                  </h4>
                                  <ul className="space-y-1 list-disc pl-5">
                                    {section.suggestions.map((suggestion, idx) => (
                                      <li key={idx}>{suggestion}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Reviewer's Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{reviewResult.summary}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Response to Reviewers</CardTitle>
                      <CardDescription>
                        Draft your response to address the reviewer's comments
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {!editingResponse ? (
                        <div className="flex flex-col items-center justify-center py-8">
                          <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium mb-2">Prepare Your Response</h3>
                          <p className="text-muted-foreground text-center max-w-md mb-4">
                            A well-crafted response to reviewers can significantly increase your chances of acceptance.
                          </p>
                          <Button onClick={handleStartResponse}>
                            <Edit className="mr-2 h-4 w-4" />
                            Start Response
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Textarea 
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            className="min-h-[300px] font-mono text-sm"
                          />
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline">
                              <Clipboard className="mr-2 h-4 w-4" />
                              Copy
                            </Button>
                            <Button>
                              <Save className="mr-2 h-4 w-4" />
                              Save Response
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleClear}>Clear All</Button>
          {activeTab !== 'results' && (
            <Button 
              onClick={activeTab === 'upload' ? () => setActiveTab('settings') : handleSimulateReview}
              disabled={loading}
            >
              {activeTab === 'upload' ? 'Next: Review Settings' : loading ? 'Generating Review...' : 'Simulate Peer Review'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default PeerReviewSimulator;