import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { usePapers } from '@/hooks/usePapers';
import { usePaperAnnotations } from '@/hooks/usePapers';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookmarkIcon, SearchIcon, PaperIcon } from '@/lib/icons';
import { formatDate } from '@/lib/utils';

interface Annotation {
  id: number;
  paperId: number;
  userId: number;
  pageNumber?: number;
  content: string;
  highlightedText?: string;
  position?: any;
  createdAt: string;
}

const Annotations: React.FC = () => {
  const { data: papers, isLoading: isPapersLoading } = usePapers();
  const [selectedPaperId, setSelectedPaperId] = useState<number | null>(null);
  const { annotations, isLoading: isAnnotationsLoading, createAnnotation } = usePaperAnnotations(selectedPaperId);
  const [searchQuery, setSearchQuery] = useState('');
  const [newAnnotation, setNewAnnotation] = useState({
    content: '',
    pageNumber: '',
    highlightedText: ''
  });
  
  const handleCreateAnnotation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPaperId || !newAnnotation.content) return;
    
    try {
      await createAnnotation.mutate({
        paperId: selectedPaperId,
        userId: 1, // Using demo user ID
        pageNumber: parseInt(newAnnotation.pageNumber) || 1,
        content: newAnnotation.content,
        highlightedText: newAnnotation.highlightedText || undefined,
      });
      
      // Reset form
      setNewAnnotation({
        content: '',
        pageNumber: '',
        highlightedText: ''
      });
    } catch (error) {
      console.error('Error creating annotation:', error);
    }
  };
  
  // Filter annotations based on search query
  const filteredAnnotations = annotations && searchQuery
    ? annotations.filter(annotation => 
        annotation.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (annotation.highlightedText && annotation.highlightedText.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : annotations;
  
  return (
    <Layout title="Annotations">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookmarkIcon className="w-5 h-5 mr-2" />
                My Annotations
              </CardTitle>
              <CardDescription>
                View and create notes for your research papers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Label htmlFor="paper-select">Select Paper</Label>
                <Select
                  value={selectedPaperId?.toString() || ""}
                  onValueChange={(value) => setSelectedPaperId(value ? parseInt(value) : null)}
                >
                  <SelectTrigger id="paper-select" className="mt-1">
                    <SelectValue placeholder="Choose a paper" />
                  </SelectTrigger>
                  <SelectContent>
                    {isPapersLoading ? (
                      <SelectItem value="" disabled>Loading papers...</SelectItem>
                    ) : papers && papers.length > 0 ? (
                      papers.map(paper => (
                        <SelectItem key={paper.id} value={paper.id.toString()}>
                          {paper.title}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>No papers available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedPaperId && (
                <form onSubmit={handleCreateAnnotation} className="space-y-4">
                  <div>
                    <Label htmlFor="annotation-text">New Annotation</Label>
                    <Textarea
                      id="annotation-text"
                      placeholder="Add your notes here..."
                      className="mt-1"
                      value={newAnnotation.content}
                      onChange={(e) => setNewAnnotation(prev => ({ ...prev, content: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="page-number">Page Number</Label>
                      <Input
                        id="page-number"
                        type="number"
                        placeholder="e.g., 1"
                        min="1"
                        className="mt-1"
                        value={newAnnotation.pageNumber}
                        onChange={(e) => setNewAnnotation(prev => ({ ...prev, pageNumber: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="highlighted-text">Highlighted Text</Label>
                      <Input
                        id="highlighted-text"
                        placeholder="Optional"
                        className="mt-1"
                        value={newAnnotation.highlightedText}
                        onChange={(e) => setNewAnnotation(prev => ({ ...prev, highlightedText: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={createAnnotation.isPending}
                  >
                    {createAnnotation.isPending ? 'Saving...' : 'Save Annotation'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {selectedPaperId 
                ? `Annotations for ${papers?.find(p => p.id === selectedPaperId)?.title || 'Selected Paper'}`
                : 'All Annotations'
              }
            </h2>
            
            <div className="relative w-64">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                className="pl-9 pr-4"
                placeholder="Search annotations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {isAnnotationsLoading ? (
            <p className="text-neutral-500">Loading annotations...</p>
          ) : !annotations || annotations.length === 0 ? (
            <Card className="h-[70vh] flex items-center justify-center">
              <div className="text-center p-6">
                <BookmarkIcon className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Annotations Yet</h3>
                <p className="text-neutral-500 mb-4">
                  {selectedPaperId 
                    ? 'Add your first annotation for this paper using the form.'
                    : 'Select a paper from the dropdown to start creating annotations.'
                  }
                </p>
                {!selectedPaperId && papers && papers.length > 0 && (
                  <Button 
                    variant="outline"
                    onClick={() => setSelectedPaperId(papers[0].id)}
                  >
                    <PaperIcon className="w-4 h-4 mr-2" />
                    Select a Paper
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <Tabs defaultValue="cards">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="cards">Card View</TabsTrigger>
                  <TabsTrigger value="list">List View</TabsTrigger>
                </TabsList>
                
                <p className="text-sm text-neutral-500">
                  {filteredAnnotations?.length} annotation{filteredAnnotations?.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              <TabsContent value="cards">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredAnnotations?.map((annotation: Annotation) => (
                    <Card key={annotation.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium">
                              {annotation.pageNumber 
                                ? `Page ${annotation.pageNumber}` 
                                : 'No page specified'
                              }
                            </p>
                            <p className="text-xs text-neutral-500">
                              {formatDate(annotation.createdAt)}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <i className="ri-more-line"></i>
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {annotation.highlightedText && (
                          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 mb-3 text-sm italic">
                            "{annotation.highlightedText}"
                          </div>
                        )}
                        <p className="text-sm">{annotation.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="list">
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y divide-neutral-200">
                      {filteredAnnotations?.map((annotation: Annotation) => (
                        <div key={annotation.id} className="p-4 hover:bg-neutral-50">
                          <div className="flex justify-between mb-2">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-primary-50 text-primary-700 rounded-full flex items-center justify-center mr-3">
                                <BookmarkIcon className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">
                                  {annotation.pageNumber 
                                    ? `Page ${annotation.pageNumber}` 
                                    : 'No page specified'
                                  }
                                </p>
                                <p className="text-xs text-neutral-500">
                                  {formatDate(annotation.createdAt)}
                                </p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="h-8">
                              <i className="ri-more-line"></i>
                            </Button>
                          </div>
                          
                          {annotation.highlightedText && (
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 mb-2 text-sm italic ml-11">
                              "{annotation.highlightedText}"
                            </div>
                          )}
                          <p className="text-sm ml-11">{annotation.content}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Annotations;
