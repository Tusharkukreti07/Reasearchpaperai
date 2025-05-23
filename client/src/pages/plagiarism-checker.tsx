import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import PlagiarismChecker from '@/components/plagiarism/PlagiarismChecker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const PlagiarismCheckerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('checker');
  const [savedTexts, setSavedTexts] = useState<Array<{
    id: string;
    text: string;
    date: Date;
    title: string;
  }>>([
    {
      id: '1',
      title: 'Research Introduction',
      text: 'This is a sample text that has been checked and rewritten to avoid plagiarism. The original text contained some suspicious segments that have been modified.',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
    }
  ]);

  const handleSaveRewrittenText = (text: string) => {
    const newText = {
      id: `text-${Date.now()}`,
      title: `Rewritten Text ${savedTexts.length + 1}`,
      text,
      date: new Date()
    };
    
    setSavedTexts([newText, ...savedTexts]);
    
    toast({
      title: 'Text Saved',
      description: 'The rewritten text has been saved to your history.',
    });
  };

  const handleDeleteText = (id: string) => {
    setSavedTexts(savedTexts.filter(text => text.id !== id));
    
    toast({
      title: 'Text Deleted',
      description: 'The text has been removed from your history.',
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
    <Layout title="Plagiarism Checker">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Plagiarism Checker</h1>
            <p className="text-neutral-600">
              Check your text for plagiarism and get AI-powered suggestions to rewrite it.
            </p>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="checker">Plagiarism Checker</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="checker">
            <PlagiarismChecker onSaveRewrittenText={handleSaveRewrittenText} />
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Saved Texts</CardTitle>
              </CardHeader>
              <CardContent>
                {savedTexts.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="mx-auto w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                      <i className="ri-file-list-line text-neutral-500 text-xl"></i>
                    </div>
                    <h3 className="font-medium mb-2">No saved texts</h3>
                    <p className="text-neutral-500 mb-4">
                      When you save rewritten texts, they will appear here.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab('checker')}
                    >
                      Go to Checker
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedTexts.map(item => (
                      <Card key={item.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium">{item.title}</h3>
                              <p className="text-sm text-neutral-500">
                                Saved on {formatDate(item.date)}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  navigator.clipboard.writeText(item.text);
                                  toast({
                                    title: 'Copied',
                                    description: 'Text copied to clipboard',
                                  });
                                }}
                              >
                                <i className="ri-clipboard-line mr-1"></i>
                                Copy
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteText(item.id)}
                              >
                                <i className="ri-delete-bin-line mr-1"></i>
                                Delete
                              </Button>
                            </div>
                          </div>
                          <div className="bg-neutral-50 p-3 rounded-md max-h-[200px] overflow-y-auto">
                            <p className="text-sm whitespace-pre-wrap">{item.text}</p>
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

export default PlagiarismCheckerPage;