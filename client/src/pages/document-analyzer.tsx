import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import DocumentAnalyzer, { DocumentAnalysis } from '@/components/analysis/DocumentAnalyzer';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';

const DocumentAnalyzerPage: React.FC = () => {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState('editor');
  const [savedAnalyses, setSavedAnalyses] = useState<Array<{
    id: string;
    title: string;
    date: Date;
    text: string;
    analysis: DocumentAnalysis;
  }>>([]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleAnalysisComplete = (result: DocumentAnalysis) => {
    setAnalysis(result);
  };

  const handleSaveAnalysis = () => {
    if (!analysis || !text) return;
    
    const newAnalysis = {
      id: `analysis-${Date.now()}`,
      title: `Document Analysis ${savedAnalyses.length + 1}`,
      date: new Date(),
      text,
      analysis
    };
    
    setSavedAnalyses([newAnalysis, ...savedAnalyses]);
    
    toast({
      title: 'Analysis Saved',
      description: 'Your document analysis has been saved.',
    });
  };

  const handleDeleteAnalysis = (id: string) => {
    setSavedAnalyses(savedAnalyses.filter(a => a.id !== id));
    
    toast({
      title: 'Analysis Deleted',
      description: 'The analysis has been removed from your history.',
    });
  };

  const handleLoadAnalysis = (savedAnalysis: {
    id: string;
    title: string;
    date: Date;
    text: string;
    analysis: DocumentAnalysis;
  }) => {
    setText(savedAnalysis.text);
    setAnalysis(savedAnalysis.analysis);
    setActiveTab('editor');
    
    toast({
      title: 'Analysis Loaded',
      description: 'The saved analysis has been loaded.',
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Layout title="Document Analyzer">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Document Analyzer</h1>
            <p className="text-neutral-600">
              Analyze your research document for readability, structure, and clarity.
            </p>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="editor">Document Editor</TabsTrigger>
            <TabsTrigger value="history">Saved Analyses</TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <Textarea
                      value={text}
                      onChange={handleTextChange}
                      placeholder="Enter or paste your document text here for analysis..."
                      className="min-h-[500px] resize-none"
                    />
                  </CardContent>
                </Card>
                
                {analysis && (
                  <div className="flex justify-end">
                    <Button onClick={handleSaveAnalysis}>
                      <i className="ri-save-line mr-2"></i>
                      Save Analysis
                    </Button>
                  </div>
                )}
              </div>
              
              <div>
                <DocumentAnalyzer 
                  text={text} 
                  onAnalysisComplete={handleAnalysisComplete} 
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardContent className="p-4">
                {savedAnalyses.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="mx-auto w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                      <i className="ri-history-line text-neutral-500 text-xl"></i>
                    </div>
                    <h3 className="font-medium mb-2">No saved analyses</h3>
                    <p className="text-neutral-500 mb-4">
                      When you save document analyses, they will appear here.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab('editor')}
                    >
                      Go to Editor
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedAnalyses.map(item => (
                      <Card key={item.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-medium">{item.title}</h3>
                              <p className="text-sm text-neutral-500">
                                Saved on {formatDate(item.date)}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleLoadAnalysis(item)}
                              >
                                <i className="ri-file-text-line mr-1"></i>
                                Load
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteAnalysis(item.id)}
                              >
                                <i className="ri-delete-bin-line mr-1"></i>
                                Delete
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-neutral-50 p-3 rounded-md">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium">Readability</span>
                                <span className="text-sm font-bold">
                                  {item.analysis.readability.score}/100
                                </span>
                              </div>
                              <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary-600 rounded-full" 
                                  style={{ width: `${item.analysis.readability.score}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            <div className="bg-neutral-50 p-3 rounded-md">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium">Structure</span>
                                <span className="text-sm font-bold">
                                  {item.analysis.structure.score}/100
                                </span>
                              </div>
                              <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary-600 rounded-full" 
                                  style={{ width: `${item.analysis.structure.score}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            <div className="bg-neutral-50 p-3 rounded-md">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium">Clarity</span>
                                <span className="text-sm font-bold">
                                  {item.analysis.clarity.score}/100
                                </span>
                              </div>
                              <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary-600 rounded-full" 
                                  style={{ width: `${item.analysis.clarity.score}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <p className="text-sm text-neutral-600 line-clamp-2">
                              {item.text.substring(0, 150)}...
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DocumentAnalyzerPage;