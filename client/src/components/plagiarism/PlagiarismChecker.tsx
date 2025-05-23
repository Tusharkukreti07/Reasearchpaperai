import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface PlagiarismCheckerProps {
  initialText?: string;
  onSaveRewrittenText?: (text: string) => void;
}

interface SuspiciousSegment {
  text: string;
  startIndex: number;
  endIndex: number;
  confidence: number;
  reason: string;
}

interface AddedCitation {
  insertionPoint: number;
  citationText: string;
  reason: string;
}

interface PlagiarismResult {
  originalText: string;
  rewrittenText: string;
  plagiarismDetected: boolean;
  plagiarismScore: number;
  suspiciousSegments: SuspiciousSegment[];
  addedCitations: AddedCitation[];
}

const PlagiarismChecker: React.FC<PlagiarismCheckerProps> = ({ 
  initialText = '', 
  onSaveRewrittenText 
}) => {
  const [text, setText] = useState(initialText);
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<PlagiarismResult | null>(null);
  const [activeTab, setActiveTab] = useState('original');

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // Reset results when text changes
    if (result) {
      setResult(null);
    }
  };

  const checkPlagiarism = async () => {
    if (!text.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter some text to check for plagiarism',
        variant: 'destructive',
      });
      return;
    }

    setIsChecking(true);
    
    try {
      // In a real implementation, this would call an API endpoint
      // For this mock, we'll simulate an API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock result
      const mockResult: PlagiarismResult = {
        originalText: text,
        rewrittenText: text.replace(
          'This is a direct quote from a famous paper without citation.',
          'Research has suggested similar concepts in the literature (Smith et al., 2020).'
        ),
        plagiarismDetected: text.includes('direct quote'),
        plagiarismScore: text.includes('direct quote') ? 0.65 : 0.1,
        suspiciousSegments: text.includes('direct quote') ? [
          {
            text: 'This is a direct quote from a famous paper without citation.',
            startIndex: text.indexOf('This is a direct quote'),
            endIndex: text.indexOf('This is a direct quote') + 'This is a direct quote from a famous paper without citation.'.length,
            confidence: 0.9,
            reason: 'This appears to be a direct quote without proper citation'
          }
        ] : [],
        addedCitations: text.includes('direct quote') ? [
          {
            insertionPoint: text.indexOf('This is a direct quote') + 'This is a direct quote from a famous paper without citation.'.length,
            citationText: ' (Smith et al., 2020)',
            reason: 'Added citation for the quoted material'
          }
        ] : []
      };
      
      setResult(mockResult);
      
      if (mockResult.plagiarismDetected) {
        toast({
          title: 'Plagiarism Detected',
          description: `Plagiarism score: ${(mockResult.plagiarismScore * 100).toFixed(0)}%. Check the results tab for details.`,
          variant: 'destructive',
        });
        setActiveTab('results');
      } else {
        toast({
          title: 'No Plagiarism Detected',
          description: 'Your text appears to be original.',
        });
      }
    } catch (error) {
      console.error('Error checking plagiarism:', error);
      toast({
        title: 'Error',
        description: 'Failed to check plagiarism. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleSaveRewritten = () => {
    if (result && onSaveRewrittenText) {
      onSaveRewrittenText(result.rewrittenText);
      toast({
        title: 'Success',
        description: 'Rewritten text saved successfully',
      });
    }
  };

  const renderTextWithHighlights = (text: string, segments: SuspiciousSegment[]) => {
    if (!segments || segments.length === 0) {
      return <p className="whitespace-pre-wrap">{text}</p>;
    }

    // Sort segments by start index
    const sortedSegments = [...segments].sort((a, b) => a.startIndex - b.startIndex);
    
    const parts = [];
    let lastIndex = 0;
    
    sortedSegments.forEach((segment, index) => {
      // Add text before the segment
      if (segment.startIndex > lastIndex) {
        parts.push(
          <span key={`text-${index}`}>
            {text.substring(lastIndex, segment.startIndex)}
          </span>
        );
      }
      
      // Add the highlighted segment
      parts.push(
        <span 
          key={`highlight-${index}`}
          className="bg-yellow-200 px-1 rounded"
          title={segment.reason}
        >
          {text.substring(segment.startIndex, segment.endIndex)}
        </span>
      );
      
      lastIndex = segment.endIndex;
    });
    
    // Add any remaining text
    if (lastIndex < text.length) {
      parts.push(
        <span key="text-end">
          {text.substring(lastIndex)}
        </span>
      );
    }
    
    return <p className="whitespace-pre-wrap">{parts}</p>;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <i className="ri-shield-check-line mr-2 text-primary-600"></i>
            Plagiarism Checker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-4">
              <TabsTrigger value="original" className="flex-1">Original Text</TabsTrigger>
              {result && (
                <>
                  <TabsTrigger value="results" className="flex-1">Results</TabsTrigger>
                  <TabsTrigger value="rewritten" className="flex-1">Rewritten Text</TabsTrigger>
                </>
              )}
            </TabsList>
            
            <TabsContent value="original">
              <div className="space-y-4">
                <Textarea
                  value={text}
                  onChange={handleTextChange}
                  placeholder="Enter or paste your text here to check for plagiarism..."
                  className="min-h-[300px]"
                />
                
                <div className="flex justify-end">
                  <Button 
                    onClick={checkPlagiarism} 
                    disabled={isChecking || !text.trim()}
                  >
                    {isChecking ? (
                      <>
                        <i className="ri-loader-4-line animate-spin mr-2"></i>
                        Checking...
                      </>
                    ) : (
                      <>
                        <i className="ri-search-line mr-2"></i>
                        Check Plagiarism
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            {result && (
              <>
                <TabsContent value="results">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Plagiarism Score</h3>
                        <span 
                          className={`font-semibold ${
                            result.plagiarismScore > 0.5 
                              ? 'text-red-600' 
                              : result.plagiarismScore > 0.2 
                                ? 'text-amber-600' 
                                : 'text-green-600'
                          }`}
                        >
                          {(result.plagiarismScore * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Progress 
                        value={result.plagiarismScore * 100} 
                        className={`h-2 ${
                          result.plagiarismScore > 0.5 
                            ? 'bg-red-100' 
                            : result.plagiarismScore > 0.2 
                              ? 'bg-amber-100' 
                              : 'bg-green-100'
                        }`}
                        indicatorClassName={
                          result.plagiarismScore > 0.5 
                            ? 'bg-red-600' 
                            : result.plagiarismScore > 0.2 
                              ? 'bg-amber-600' 
                              : 'bg-green-600'
                        }
                      />
                    </div>
                    
                    {result.plagiarismDetected ? (
                      <>
                        <Alert variant="destructive">
                          <AlertTitle>Plagiarism Detected</AlertTitle>
                          <AlertDescription>
                            We found {result.suspiciousSegments.length} suspicious segment(s) in your text.
                            Review the highlighted sections below and consider rewriting them.
                          </AlertDescription>
                        </Alert>
                        
                        <div className="space-y-2">
                          <h3 className="font-medium">Text with Suspicious Segments Highlighted</h3>
                          <div className="bg-white border border-neutral-200 rounded-md p-4 max-h-[300px] overflow-y-auto">
                            {renderTextWithHighlights(result.originalText, result.suspiciousSegments)}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="font-medium">Suspicious Segments</h3>
                          <div className="space-y-3">
                            {result.suspiciousSegments.map((segment, index) => (
                              <Card key={index}>
                                <CardContent className="p-3">
                                  <div className="flex justify-between items-start mb-2">
                                    <span className="font-medium text-sm">Segment {index + 1}</span>
                                    <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                                      {(segment.confidence * 100).toFixed(0)}% confidence
                                    </span>
                                  </div>
                                  <div className="bg-yellow-50 p-2 rounded mb-2 text-sm">
                                    "{segment.text}"
                                  </div>
                                  <p className="text-sm text-neutral-600">
                                    <span className="font-medium">Reason:</span> {segment.reason}
                                  </p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                        
                        {result.addedCitations.length > 0 && (
                          <div className="space-y-2">
                            <h3 className="font-medium">Missing Citations</h3>
                            <div className="space-y-3">
                              {result.addedCitations.map((citation, index) => (
                                <Card key={index}>
                                  <CardContent className="p-3">
                                    <p className="text-sm mb-2">
                                      <span className="font-medium">Added citation:</span> {citation.citationText}
                                    </p>
                                    <p className="text-sm text-neutral-600">
                                      <span className="font-medium">Reason:</span> {citation.reason}
                                    </p>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <Alert>
                        <AlertTitle>No Plagiarism Detected</AlertTitle>
                        <AlertDescription>
                          Your text appears to be original. No suspicious segments were found.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="rewritten">
                  <div className="space-y-4">
                    <Alert>
                      <AlertTitle>AI-Rewritten Text</AlertTitle>
                      <AlertDescription>
                        This is an AI-generated rewrite of your text that addresses potential plagiarism issues.
                        Review it carefully before using.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="bg-white border border-neutral-200 rounded-md p-4 min-h-[300px] max-h-[400px] overflow-y-auto">
                      <p className="whitespace-pre-wrap">{result.rewrittenText}</p>
                    </div>
                    
                    {onSaveRewrittenText && (
                      <div className="flex justify-end">
                        <Button onClick={handleSaveRewritten}>
                          <i className="ri-save-line mr-2"></i>
                          Use Rewritten Text
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </>
            )}
            
            {isChecking && (
              <div className="mt-4 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <i className="ri-loader-4-line animate-spin text-primary-600"></i>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Analyzing text for plagiarism...</p>
                    <Progress value={45} className="h-2 mt-1" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlagiarismChecker;