import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Clipboard, Copy, Download, RefreshCw } from 'lucide-react';

interface CitationResult {
  apa: string;
  mla: string;
  chicago: string;
  harvard: string;
  ieee: string;
}

const CitationGenerator: React.FC = () => {
  const [url, setUrl] = useState('');
  const [doi, setDoi] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [citationResult, setCitationResult] = useState<CitationResult | null>(null);
  const [manualFields, setManualFields] = useState({
    title: '',
    authors: '',
    journal: '',
    year: '',
    volume: '',
    issue: '',
    pages: '',
    publisher: '',
    url: '',
  });

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setIsLoading(true);
    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setCitationResult({
        apa: `Author, A. A., & Author, B. B. (${new Date().getFullYear()}). Title of article. Title of Journal, volume(issue), pp-pp. https://doi.org/xxxx`,
        mla: `Author, First Name, and First Name Author. "Title of Article." Title of Journal, vol. X, no. X, ${new Date().getFullYear()}, pp. XX-XX.`,
        chicago: `Author, First Name. ${new Date().getFullYear()}. "Title of Article." Title of Journal volume, no. issue (Month): page range. https://doi.org/xxxx.`,
        harvard: `Author, A. and Author, B. (${new Date().getFullYear()}). 'Title of article', Title of Journal, Volume(Issue), pp. page range.`,
        ieee: `[1] A. Author and B. Author, "Title of article," Title of Journal, vol. X, no. X, pp. XX-XX, ${new Date().getFullYear()}.`,
      });
      
      toast({
        title: "Citation generated",
        description: "Your citation has been successfully generated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate citation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDoiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doi) return;
    
    setIsLoading(true);
    try {
      // In a real implementation, this would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setCitationResult({
        apa: `Author, A. A., & Author, B. B. (${new Date().getFullYear()}). Title of article. Title of Journal, volume(issue), pp-pp. https://doi.org/${doi}`,
        mla: `Author, First Name, and First Name Author. "Title of Article." Title of Journal, vol. X, no. X, ${new Date().getFullYear()}, pp. XX-XX.`,
        chicago: `Author, First Name. ${new Date().getFullYear()}. "Title of Article." Title of Journal volume, no. issue (Month): page range. https://doi.org/${doi}.`,
        harvard: `Author, A. and Author, B. (${new Date().getFullYear()}). 'Title of article', Title of Journal, Volume(Issue), pp. page range.`,
        ieee: `[1] A. Author and B. Author, "Title of article," Title of Journal, vol. X, no. X, pp. XX-XX, ${new Date().getFullYear()}.`,
      });
      
      toast({
        title: "Citation generated",
        description: "Your citation has been successfully generated from DOI.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate citation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualFields.title || !manualFields.authors) return;
    
    setIsLoading(true);
    try {
      // In a real implementation, this would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const year = manualFields.year || new Date().getFullYear().toString();
      
      setCitationResult({
        apa: `${manualFields.authors}. (${year}). ${manualFields.title}. ${manualFields.journal}, ${manualFields.volume}(${manualFields.issue}), ${manualFields.pages}. ${manualFields.url}`,
        mla: `${manualFields.authors}. "${manualFields.title}." ${manualFields.journal}, vol. ${manualFields.volume}, no. ${manualFields.issue}, ${year}, pp. ${manualFields.pages}.`,
        chicago: `${manualFields.authors}. ${year}. "${manualFields.title}." ${manualFields.journal} ${manualFields.volume}, no. ${manualFields.issue}: ${manualFields.pages}.`,
        harvard: `${manualFields.authors} (${year}). '${manualFields.title}', ${manualFields.journal}, ${manualFields.volume}(${manualFields.issue}), pp. ${manualFields.pages}.`,
        ieee: `[1] ${manualFields.authors}, "${manualFields.title}," ${manualFields.journal}, vol. ${manualFields.volume}, no. ${manualFields.issue}, pp. ${manualFields.pages}, ${year}.`,
      });
      
      toast({
        title: "Citation generated",
        description: "Your citation has been successfully generated from manual entry.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate citation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setManualFields(prev => ({ ...prev, [name]: value }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Citation copied to clipboard",
    });
  };

  const downloadCitations = () => {
    if (!citationResult) return;
    
    const content = Object.entries(citationResult)
      .map(([format, citation]) => `${format.toUpperCase()}:\n${citation}\n\n`)
      .join('');
      
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'citations.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: "Citations downloaded as text file",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Citation Generator</h1>
      
      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="url">Website URL</TabsTrigger>
          <TabsTrigger value="doi">DOI</TabsTrigger>
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
        </TabsList>
        
        <TabsContent value="url">
          <Card>
            <CardHeader>
              <CardTitle>Generate from URL</CardTitle>
              <CardDescription>
                Enter the URL of a webpage, article, or paper to generate citations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUrlSubmit} className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="https://example.com/article"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : "Generate"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="doi">
          <Card>
            <CardHeader>
              <CardTitle>Generate from DOI</CardTitle>
              <CardDescription>
                Enter a Digital Object Identifier (DOI) to generate citations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDoiSubmit} className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="10.1000/xyz123"
                    value={doi}
                    onChange={(e) => setDoi(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : "Generate"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle>Manual Entry</CardTitle>
              <CardDescription>
                Enter publication details manually to generate citations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      name="title"
                      value={manualFields.title}
                      onChange={handleInputChange}
                      placeholder="Title of the paper or article"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Authors</label>
                    <Input
                      name="authors"
                      value={manualFields.authors}
                      onChange={handleInputChange}
                      placeholder="e.g., Smith, J., & Johnson, A."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Journal/Publication</label>
                    <Input
                      name="journal"
                      value={manualFields.journal}
                      onChange={handleInputChange}
                      placeholder="Journal or publication name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Year</label>
                    <Input
                      name="year"
                      value={manualFields.year}
                      onChange={handleInputChange}
                      placeholder="Publication year"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Volume</label>
                    <Input
                      name="volume"
                      value={manualFields.volume}
                      onChange={handleInputChange}
                      placeholder="Volume number"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Issue</label>
                    <Input
                      name="issue"
                      value={manualFields.issue}
                      onChange={handleInputChange}
                      placeholder="Issue number"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pages</label>
                    <Input
                      name="pages"
                      value={manualFields.pages}
                      onChange={handleInputChange}
                      placeholder="e.g., 123-145"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Publisher</label>
                    <Input
                      name="publisher"
                      value={manualFields.publisher}
                      onChange={handleInputChange}
                      placeholder="Publisher name"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">URL or DOI</label>
                    <Input
                      name="url"
                      value={manualFields.url}
                      onChange={handleInputChange}
                      placeholder="URL or DOI of the publication"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : "Generate Citations"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {citationResult && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Citation Results</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={downloadCitations}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="apa" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="apa">APA</TabsTrigger>
                  <TabsTrigger value="mla">MLA</TabsTrigger>
                  <TabsTrigger value="chicago">Chicago</TabsTrigger>
                  <TabsTrigger value="harvard">Harvard</TabsTrigger>
                  <TabsTrigger value="ieee">IEEE</TabsTrigger>
                </TabsList>
                
                {Object.entries(citationResult).map(([format, citation]) => (
                  <TabsContent key={format} value={format}>
                    <div className="relative mt-2 rounded-md border p-4 bg-muted/50">
                      <p className="whitespace-pre-wrap">{citation}</p>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(citation)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CitationGenerator;