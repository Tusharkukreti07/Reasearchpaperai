import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';

interface DocumentAnalyzerProps {
  text: string;
  onAnalysisComplete?: (analysis: DocumentAnalysis) => void;
}

export interface DocumentAnalysis {
  readability: {
    score: number;
    level: 'Easy' | 'Moderate' | 'Difficult' | 'Very Difficult';
    suggestions: string[];
  };
  structure: {
    score: number;
    sections: Array<{
      name: string;
      present: boolean;
      suggestions?: string;
    }>;
    suggestions: string[];
  };
  clarity: {
    score: number;
    issues: Array<{
      text: string;
      startIndex: number;
      endIndex: number;
      suggestion: string;
    }>;
    suggestions: string[];
  };
  keywords: string[];
  overallScore: number;
}

const DocumentAnalyzer: React.FC<DocumentAnalyzerProps> = ({ 
  text, 
  onAnalysisComplete 
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Start analysis when text changes
  useEffect(() => {
    if (text && text.length > 100) {
      analyzeDocument();
    } else {
      setAnalysis(null);
    }
  }, [text]);

  const analyzeDocument = async () => {
    if (!text || text.length < 100) {
      toast({
        title: 'Error',
        description: 'Please provide more text for analysis',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    
    try {
      // Simulate analysis progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 500);
      
      // In a real implementation, this would call an API endpoint
      // For this mock, we'll simulate an API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      clearInterval(progressInterval);
      setProgress(100);
      
      // Mock analysis result
      const mockAnalysis: DocumentAnalysis = {
        readability: {
          score: 72,
          level: 'Moderate',
          suggestions: [
            'Consider simplifying sentences in the methodology section',
            'Use more active voice to improve clarity',
            'Break down complex paragraphs into smaller ones'
          ]
        },
        structure: {
          score: 85,
          sections: [
            { name: 'Abstract', present: true },
            { name: 'Introduction', present: true },
            { name: 'Literature Review', present: true },
            { name: 'Methodology', present: true },
            { name: 'Results', present: true },
            { name: 'Discussion', present: true },
            { name: 'Conclusion', present: true },
            { name: 'References', present: true }
          ],
          suggestions: [
            'Consider expanding the literature review section',
            'The methodology section could benefit from more detail'
          ]
        },
        clarity: {
          score: 68,
          issues: [
            {
              text: 'This concept is important for understanding the framework.',
              startIndex: text.indexOf('This concept') || 0,
              endIndex: (text.indexOf('This concept') || 0) + 'This concept is important for understanding the framework.'.length,
              suggestion: 'Specify which concept you are referring to for clarity.'
            },
            {
              text: 'The results show significant improvements.',
              startIndex: text.indexOf('The results show') || 0,
              endIndex: (text.indexOf('The results show') || 0) + 'The results show significant improvements.'.length,
              suggestion: 'Quantify the improvements with specific metrics or percentages.'
            }
          ],
          suggestions: [
            'Be more specific when referring to concepts or results',
            'Add more transition phrases between sections',
            'Define technical terms when first introduced'
          ]
        },
        keywords: [
          'research', 'analysis', 'methodology', 'framework', 'data', 
          'results', 'significant', 'implementation', 'process'
        ],
        overallScore: 75
      };
      
      setAnalysis(mockAnalysis);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(mockAnalysis);
      }
      
      toast({
        title: 'Analysis Complete',
        description: 'Document analysis has been completed successfully.',
      });
    } catch (error) {
      console.error('Error analyzing document:', error);
      toast({
        title: 'Error',
        description: 'Failed to analyze document. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-amber-100';
    return 'bg-red-100';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-amber-600';
    return 'bg-red-600';
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <i className="ri-file-search-line mr-2 text-primary-600"></i>
            Document Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isAnalyzing ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <i className="ri-loader-4-line animate-spin text-primary-600"></i>
                </div>
                <div className="flex-1">
                  <p className="font-medium">Analyzing document...</p>
                  <Progress value={progress} className="h-2 mt-1" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          ) : analysis ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full mb-4">
                <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                <TabsTrigger value="readability" className="flex-1">Readability</TabsTrigger>
                <TabsTrigger value="structure" className="flex-1">Structure</TabsTrigger>
                <TabsTrigger value="clarity" className="flex-1">Clarity</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-lg">Overall Score</h3>
                    <div className={`text-2xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                      {analysis.overallScore}/100
                    </div>
                  </div>
                  
                  <Progress 
                    value={analysis.overallScore} 
                    className="h-3"
                    indicatorClassName={getProgressColor(analysis.overallScore)}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Readability</h4>
                          <span className={`font-bold ${getScoreColor(analysis.readability.score)}`}>
                            {analysis.readability.score}
                          </span>
                        </div>
                        <Progress 
                          value={analysis.readability.score} 
                          className="h-2 mb-2"
                          indicatorClassName={getProgressColor(analysis.readability.score)}
                        />
                        <Badge className={`${getScoreBgColor(analysis.readability.score)} text-black border-0`}>
                          {analysis.readability.level}
                        </Badge>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Structure</h4>
                          <span className={`font-bold ${getScoreColor(analysis.structure.score)}`}>
                            {analysis.structure.score}
                          </span>
                        </div>
                        <Progress 
                          value={analysis.structure.score} 
                          className="h-2 mb-2"
                          indicatorClassName={getProgressColor(analysis.structure.score)}
                        />
                        <div className="text-sm">
                          {analysis.structure.sections.filter(s => s.present).length}/{analysis.structure.sections.length} sections present
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Clarity</h4>
                          <span className={`font-bold ${getScoreColor(analysis.clarity.score)}`}>
                            {analysis.clarity.score}
                          </span>
                        </div>
                        <Progress 
                          value={analysis.clarity.score} 
                          className="h-2 mb-2"
                          indicatorClassName={getProgressColor(analysis.clarity.score)}
                        />
                        <div className="text-sm">
                          {analysis.clarity.issues.length} clarity issues found
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Key Terms</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.keywords.map((keyword, index) => (
                        <Badge key={index} variant="outline" className="bg-neutral-50">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="readability">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-lg">Readability Score</h3>
                      <p className="text-sm text-neutral-500">
                        How easy your document is to read and understand
                      </p>
                    </div>
                    <div className={`text-2xl font-bold ${getScoreColor(analysis.readability.score)}`}>
                      {analysis.readability.score}/100
                    </div>
                  </div>
                  
                  <Progress 
                    value={analysis.readability.score} 
                    className="h-3"
                    indicatorClassName={getProgressColor(analysis.readability.score)}
                  />
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-sm">Level:</span>
                    <Badge className={`${getScoreBgColor(analysis.readability.score)} text-black border-0`}>
                      {analysis.readability.level}
                    </Badge>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Suggestions for Improvement</h3>
                    <ul className="space-y-2">
                      {analysis.readability.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start">
                          <i className="ri-lightbulb-line text-amber-500 mt-0.5 mr-2"></i>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="structure">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-lg">Structure Score</h3>
                      <p className="text-sm text-neutral-500">
                        How well your document follows academic structure
                      </p>
                    </div>
                    <div className={`text-2xl font-bold ${getScoreColor(analysis.structure.score)}`}>
                      {analysis.structure.score}/100
                    </div>
                  </div>
                  
                  <Progress 
                    value={analysis.structure.score} 
                    className="h-3 mb-4"
                    indicatorClassName={getProgressColor(analysis.structure.score)}
                  />
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Section Analysis</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {analysis.structure.sections.map((section, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                          <span>{section.name}</span>
                          {section.present ? (
                            <Badge className="bg-green-100 text-green-800 border-0">
                              Present
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800 border-0">
                              Missing
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Suggestions for Improvement</h3>
                    <ul className="space-y-2">
                      {analysis.structure.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start">
                          <i className="ri-lightbulb-line text-amber-500 mt-0.5 mr-2"></i>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="clarity">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-lg">Clarity Score</h3>
                      <p className="text-sm text-neutral-500">
                        How clear and precise your writing is
                      </p>
                    </div>
                    <div className={`text-2xl font-bold ${getScoreColor(analysis.clarity.score)}`}>
                      {analysis.clarity.score}/100
                    </div>
                  </div>
                  
                  <Progress 
                    value={analysis.clarity.score} 
                    className="h-3 mb-4"
                    indicatorClassName={getProgressColor(analysis.clarity.score)}
                  />
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Clarity Issues ({analysis.clarity.issues.length})</h3>
                    <div className="space-y-3">
                      {analysis.clarity.issues.map((issue, index) => (
                        <Card key={index}>
                          <CardContent className="p-3">
                            <div className="bg-neutral-50 p-2 rounded mb-2 text-sm">
                              "{issue.text}"
                            </div>
                            <p className="text-sm text-neutral-600 mb-2">
                              <span className="font-medium">Suggestion:</span> {issue.suggestion}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">General Suggestions</h3>
                    <ul className="space-y-2">
                      {analysis.clarity.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start">
                          <i className="ri-lightbulb-line text-amber-500 mt-0.5 mr-2"></i>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                <i className="ri-file-search-line text-neutral-500 text-xl"></i>
              </div>
              <h3 className="font-medium mb-2">No Analysis Available</h3>
              <p className="text-neutral-500 mb-4">
                Enter or paste your text to analyze its readability, structure, and clarity.
              </p>
              <Button 
                variant="outline" 
                onClick={analyzeDocument}
                disabled={!text || text.length < 100}
              >
                Analyze Document
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentAnalyzer;