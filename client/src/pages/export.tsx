import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { usePapers, usePaperSummary, useGenerateLiteratureReview } from '@/hooks/usePapers';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ExportIcon, PaperIcon } from '@/lib/icons';
import { useToast } from '@/hooks/use-toast';

type ExportFormat = 'markdown' | 'pdf' | 'docx';
type ContentType = 'summary' | 'full' | 'literature-review';

const Export: React.FC = () => {
  const { data: papers, isLoading } = usePapers();
  const [selectedPaperIds, setSelectedPaperIds] = useState<number[]>([]);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('markdown');
  const [contentType, setContentType] = useState<ContentType>('summary');
  const [fileName, setFileName] = useState('research-export');
  const literatureReviewMutation = useGenerateLiteratureReview();
  const { toast } = useToast();
  
  const handlePaperToggle = (paperId: number) => {
    setSelectedPaperIds(prev => 
      prev.includes(paperId)
        ? prev.filter(id => id !== paperId)
        : [...prev, paperId]
    );
  };
  
  const handleExport = async () => {
    if (selectedPaperIds.length === 0) {
      toast({
        title: "No papers selected",
        description: "Please select at least one paper to export",
        variant: "destructive"
      });
      return;
    }
    
    // In a real implementation, this would call the backend to generate the export
    // For now, show a toast message
    toast({
      title: "Export initiated",
      description: `Exporting ${selectedPaperIds.length} papers as ${exportFormat.toUpperCase()}`,
    });
    
    // If exporting a literature review, call the API
    if (contentType === 'literature-review') {
      try {
        const result = await literatureReviewMutation.mutateAsync(selectedPaperIds);
        
        // In a real implementation, this would trigger a download
        console.log("Literature review generated:", result);
        
        toast({
          title: "Literature Review Generated",
          description: "Your literature review is ready for download",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to generate literature review",
          variant: "destructive"
        });
      }
    }
  };
  
  return (
    <Layout title="Export Options">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ExportIcon className="w-5 h-5 mr-2" />
                Export Research
              </CardTitle>
              <CardDescription>
                Generate formatted exports of your research papers and summaries
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="block mb-2">Select Format</Label>
                <RadioGroup
                  value={exportFormat}
                  onValueChange={(value) => setExportFormat(value as ExportFormat)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="markdown" id="format-md" />
                    <Label htmlFor="format-md">Markdown</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pdf" id="format-pdf" />
                    <Label htmlFor="format-pdf">PDF</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="docx" id="format-docx" />
                    <Label htmlFor="format-docx">Word</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label className="block mb-2">Content Type</Label>
                <RadioGroup
                  value={contentType}
                  onValueChange={(value) => setContentType(value as ContentType)}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="summary" id="content-summary" />
                    <Label htmlFor="content-summary">Paper Summaries</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="full" id="content-full" />
                    <Label htmlFor="content-full">Full Papers</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="literature-review" id="content-lit-review" />
                    <Label htmlFor="content-lit-review">Literature Review</Label>
                  </div>
                </RadioGroup>
                
                {contentType === 'literature-review' && selectedPaperIds.length < 2 && (
                  <p className="text-xs text-amber-600 mt-2">
                    Select at least 2 papers for a literature review
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="filename">File Name</Label>
                <Input
                  id="filename"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="research-export"
                  className="mt-1"
                />
              </div>
              
              <Button 
                onClick={handleExport} 
                disabled={selectedPaperIds.length === 0 || (contentType === 'literature-review' && selectedPaperIds.length < 2)}
                className="w-full"
              >
                {literatureReviewMutation.isPending
                  ? 'Generating...'
                  : `Export ${selectedPaperIds.length} Papers`
                }
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Select Papers to Export</CardTitle>
              <CardDescription>
                Choose which papers to include in your export
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[60vh] overflow-y-auto">
              {isLoading ? (
                <p className="text-neutral-500">Loading papers...</p>
              ) : papers && papers.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex justify-between mb-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedPaperIds(papers.map(p => p.id))}
                    >
                      Select All
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedPaperIds([])}
                    >
                      Clear Selection
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  {papers.map(paper => (
                    <div key={paper.id} className="py-3 flex items-start">
                      <Checkbox 
                        id={`paper-${paper.id}`}
                        checked={selectedPaperIds.includes(paper.id)}
                        onCheckedChange={() => handlePaperToggle(paper.id)}
                        className="mt-1 mr-3"
                      />
                      <div>
                        <Label 
                          htmlFor={`paper-${paper.id}`}
                          className="font-medium cursor-pointer"
                        >
                          {paper.title}
                        </Label>
                        <div className="text-sm text-neutral-500 mt-1">
                          {paper.authors || 'Unknown authors'}
                        </div>
                        
                        {paper.abstract && (
                          <p className="text-sm mt-2 line-clamp-2 text-neutral-600">
                            {paper.abstract}
                          </p>
                        )}
                        
                        {paper.tags && paper.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {paper.tags.map((tag, index) => (
                              <span 
                                key={index}
                                className="text-xs bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <PaperIcon className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                  <p className="text-neutral-500 mb-2">No papers available</p>
                  <p className="text-sm text-neutral-400 mb-4">
                    Upload papers to export them
                  </p>
                  <Button>Upload Papers</Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4 bg-neutral-50">
              <div className="w-full flex justify-between items-center">
                <p className="text-sm text-neutral-600">
                  {selectedPaperIds.length} of {papers?.length || 0} papers selected
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedPaperIds([])}
                  disabled={selectedPaperIds.length === 0}
                >
                  Clear Selection
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Export;
