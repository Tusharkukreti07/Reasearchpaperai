import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { 
  BookOpen, 
  Search, 
  FileText, 
  Layers, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Edit, 
  Save,
  Download,
  ArrowUpDown,
  CheckCircle2,
  Copy
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';

interface Paper {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  abstract: string;
  keywords: string[];
  selected: boolean;
}

interface Theme {
  id: string;
  name: string;
  papers: string[]; // Paper IDs
  color: string;
}

interface GeneratedSection {
  title: string;
  content: string;
}

const mockPapers: Paper[] = [
  {
    id: '1',
    title: 'Deep Learning Approaches for COVID-19 Detection on Chest X-rays',
    authors: 'Johnson, A., Smith, B., & Williams, C.',
    journal: 'Journal of Medical Imaging',
    year: 2022,
    abstract: 'This study explores various deep learning architectures for the detection of COVID-19 from chest X-ray images. We compare the performance of CNN, ResNet, and Vision Transformer models on a dataset of 10,000 X-ray images.',
    keywords: ['Deep Learning', 'COVID-19', 'X-ray', 'CNN', 'Medical Imaging'],
    selected: false
  },
  {
    id: '2',
    title: 'Transfer Learning for Medical Image Classification',
    authors: 'Brown, D., & Miller, E.',
    journal: 'IEEE Transactions on Medical Imaging',
    year: 2021,
    abstract: 'We investigate the effectiveness of transfer learning techniques for medical image classification tasks with limited training data. Our results show significant improvements in accuracy when using pre-trained models fine-tuned on domain-specific data.',
    keywords: ['Transfer Learning', 'Medical Imaging', 'Classification', 'Deep Learning'],
    selected: false
  },
  {
    id: '3',
    title: 'Explainable AI in Healthcare: A Survey',
    authors: 'Garcia, F., Lee, H., & Wang, J.',
    journal: 'ACM Computing Surveys',
    year: 2023,
    abstract: 'This survey provides a comprehensive overview of explainable AI techniques applied to healthcare applications. We categorize methods based on their interpretability approach and evaluate their effectiveness in clinical settings.',
    keywords: ['Explainable AI', 'Healthcare', 'Survey', 'Interpretability'],
    selected: false
  },
  {
    id: '4',
    title: 'Federated Learning for Privacy-Preserving Medical Analysis',
    authors: 'Zhang, L., & Anderson, K.',
    journal: 'Nature Machine Intelligence',
    year: 2022,
    abstract: 'We present a federated learning framework that enables collaborative model training across multiple healthcare institutions while preserving patient privacy. Our approach demonstrates comparable performance to centralized learning while adhering to data protection regulations.',
    keywords: ['Federated Learning', 'Privacy', 'Healthcare', 'Distributed Computing'],
    selected: false
  },
  {
    id: '5',
    title: 'Attention Mechanisms in Medical Image Segmentation',
    authors: 'Kim, S., & Patel, R.',
    journal: 'Medical Image Analysis',
    year: 2023,
    abstract: 'This paper explores various attention mechanisms for improving the accuracy of medical image segmentation tasks. We propose a novel spatial-channel attention module that outperforms existing approaches on benchmark datasets.',
    keywords: ['Attention Mechanism', 'Image Segmentation', 'Medical Imaging', 'Deep Learning'],
    selected: false
  }
];

const mockThemes: Theme[] = [
  {
    id: '1',
    name: 'Deep Learning in Medical Imaging',
    papers: ['1', '2', '5'],
    color: 'bg-blue-500'
  },
  {
    id: '2',
    name: 'Privacy and Ethics in Healthcare AI',
    papers: ['3', '4'],
    color: 'bg-green-500'
  }
];

const mockGeneratedSections: GeneratedSection[] = [
  {
    title: 'Introduction',
    content: 'The application of artificial intelligence in healthcare has seen significant growth in recent years, particularly in the domain of medical imaging. Deep learning approaches have demonstrated remarkable capabilities in tasks such as disease detection, image segmentation, and classification. This literature review examines the current state of research in AI-based medical imaging analysis, with a focus on deep learning architectures, transfer learning techniques, and privacy-preserving methods.'
  },
  {
    title: 'Deep Learning Approaches',
    content: 'Deep learning has revolutionized medical image analysis by enabling automated feature extraction and improved diagnostic accuracy. Johnson et al. (2022) explored various deep learning architectures for COVID-19 detection from chest X-rays, comparing the performance of CNN, ResNet, and Vision Transformer models. Their findings indicate that Vision Transformers achieve the highest accuracy but require more computational resources.\n\nKim and Patel (2023) investigated attention mechanisms for medical image segmentation, proposing a novel spatial-channel attention module that outperforms existing approaches. Their work demonstrates the importance of focusing on relevant image regions for accurate segmentation of anatomical structures.'
  },
  {
    title: 'Transfer Learning and Limited Data',
    content: 'A common challenge in medical imaging is the limited availability of labeled data. Brown and Miller (2021) addressed this issue by investigating transfer learning techniques for medical image classification tasks. Their results show significant improvements in accuracy when using pre-trained models fine-tuned on domain-specific data, even with small datasets. This approach has become increasingly popular in medical imaging research, allowing researchers to leverage knowledge from large natural image datasets.'
  },
  {
    title: 'Privacy and Ethical Considerations',
    content: 'As AI systems become more integrated into healthcare workflows, privacy and ethical considerations have gained prominence. Zhang and Anderson (2022) presented a federated learning framework that enables collaborative model training across multiple healthcare institutions while preserving patient privacy. Their approach demonstrates comparable performance to centralized learning while adhering to data protection regulations.\n\nGarcia et al. (2023) conducted a comprehensive survey of explainable AI techniques in healthcare applications. They categorized methods based on their interpretability approach and evaluated their effectiveness in clinical settings. Their work highlights the importance of transparency in AI systems used for medical decision-making.'
  },
  {
    title: 'Conclusion',
    content: 'The literature reviewed demonstrates significant progress in applying AI to medical imaging challenges. Deep learning approaches, particularly those incorporating attention mechanisms and transfer learning, have shown promising results in various diagnostic tasks. However, as these technologies advance, considerations of privacy, interpretability, and ethical implementation become increasingly important. Future research should focus on developing methods that balance performance with these crucial aspects to ensure responsible deployment of AI in healthcare settings.'
  }
];

const LiteratureReviewAssistant: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [papers, setPapers] = useState<Paper[]>(mockPapers);
  const [themes, setThemes] = useState<Theme[]>(mockThemes);
  const [selectedPapers, setSelectedPapers] = useState<Paper[]>([]);
  const [newThemeName, setNewThemeName] = useState('');
  const [isCreatingTheme, setIsCreatingTheme] = useState(false);
  const [activeTheme, setActiveTheme] = useState<Theme | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedSections, setGeneratedSections] = useState<GeneratedSection[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reviewTopic, setReviewTopic] = useState('');
  const [reviewScope, setReviewScope] = useState('');

  // Filter papers based on search query
  const filteredPapers = papers.filter(paper => 
    paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    paper.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
    paper.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
    paper.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelectPaper = (paperId: string) => {
    setPapers(papers.map(paper => 
      paper.id === paperId ? { ...paper, selected: !paper.selected } : paper
    ));
  };

  const handleAddToTheme = (themeId: string) => {
    const selectedPaperIds = papers.filter(p => p.selected).map(p => p.id);
    if (selectedPaperIds.length === 0) return;
    
    setThemes(themes.map(theme => 
      theme.id === themeId 
        ? { ...theme, papers: [...new Set([...theme.papers, ...selectedPaperIds])] } 
        : theme
    ));
    
    // Deselect papers after adding to theme
    setPapers(papers.map(paper => paper.selected ? { ...paper, selected: false } : paper));
    
    toast({
      title: "Papers added to theme",
      description: `${selectedPaperIds.length} papers added to the theme.`,
    });
  };

  const handleCreateTheme = () => {
    if (!newThemeName) return;
    
    const selectedPaperIds = papers.filter(p => p.selected).map(p => p.id);
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newTheme: Theme = {
      id: (themes.length + 1).toString(),
      name: newThemeName,
      papers: selectedPaperIds,
      color: randomColor
    };
    
    setThemes([...themes, newTheme]);
    setNewThemeName('');
    setIsCreatingTheme(false);
    
    // Deselect papers after creating theme
    setPapers(papers.map(paper => paper.selected ? { ...paper, selected: false } : paper));
    
    toast({
      title: "Theme created",
      description: `New theme "${newThemeName}" created with ${selectedPaperIds.length} papers.`,
    });
  };

  const handleRemoveFromTheme = (themeId: string, paperId: string) => {
    setThemes(themes.map(theme => 
      theme.id === themeId 
        ? { ...theme, papers: theme.papers.filter(id => id !== paperId) } 
        : theme
    ));
    
    toast({
      title: "Paper removed",
      description: "Paper removed from theme.",
    });
  };

  const handleDeleteTheme = (themeId: string) => {
    setThemes(themes.filter(theme => theme.id !== themeId));
    if (activeTheme?.id === themeId) {
      setActiveTheme(null);
    }
    
    toast({
      title: "Theme deleted",
      description: "Theme and its organization have been deleted.",
    });
  };

  const handleGenerateReview = async () => {
    if (!activeTheme) return;
    
    setIsGenerating(true);
    try {
      // In a real implementation, this would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // For demo purposes, we'll use the mock data
      setGeneratedSections(mockGeneratedSections);
      
      toast({
        title: "Review generated",
        description: "Your literature review has been generated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportReview = () => {
    if (generatedSections.length === 0) return;
    
    const content = generatedSections
      .map(section => `# ${section.title}\n\n${section.content}\n\n`)
      .join('');
      
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `literature-review-${activeTheme?.name.toLowerCase().replace(/\s+/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Review exported",
      description: "Your literature review has been exported as a Markdown file.",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Content copied to clipboard",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Literature Review Assistant</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Paper Search and Selection */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Research Papers</CardTitle>
              <CardDescription>
                Search and organize papers for your literature review
              </CardDescription>
              <div className="mt-2">
                <Input
                  placeholder="Search papers by title, author, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-muted-foreground">
                  {papers.filter(p => p.selected).length} selected
                </div>
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" disabled={!papers.some(p => p.selected)}>
                        Add to Theme
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Select Theme</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {themes.map(theme => (
                        <DropdownMenuItem key={theme.id} onClick={() => handleAddToTheme(theme.id)}>
                          <div className={`w-3 h-3 rounded-full ${theme.color} mr-2`}></div>
                          {theme.name}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setIsCreatingTheme(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Theme
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-3">
                  {filteredPapers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No papers found matching your search criteria.</p>
                    </div>
                  ) : (
                    filteredPapers.map(paper => (
                      <div 
                        key={paper.id} 
                        className={`p-3 rounded-md border ${paper.selected ? 'border-primary bg-primary/5' : ''}`}
                      >
                        <div className="flex items-start gap-2">
                          <Checkbox 
                            checked={paper.selected} 
                            onCheckedChange={() => handleSelectPaper(paper.id)}
                            className="mt-1"
                          />
                          <div>
                            <h3 className="font-medium">{paper.title}</h3>
                            <p className="text-sm text-muted-foreground">{paper.authors}</p>
                            <p className="text-xs">{paper.journal}, {paper.year}</p>
                            <div className="mt-2 text-sm">
                              <p className="line-clamp-2">{paper.abstract}</p>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {paper.keywords.map((keyword, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        
        {/* Themes and Organization */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Literature Review Organization</CardTitle>
                  <CardDescription>
                    Organize papers into themes and generate your literature review
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={() => setIsCreatingTheme(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Theme
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="themes" className="h-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="themes">Themes & Organization</TabsTrigger>
                  <TabsTrigger value="review">Generated Review</TabsTrigger>
                </TabsList>
                
                <TabsContent value="themes">
                  {themes.length === 0 ? (
                    <div className="text-center py-12 border rounded-md">
                      <Layers className="h-12 w-12 mx-auto text-muted-foreground" />
                      <h3 className="mt-4 font-medium">No Themes Created</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Create themes to organize your papers for the literature review.
                      </p>
                      <Button className="mt-4" onClick={() => setIsCreatingTheme(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Theme
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {themes.map(theme => (
                        <div key={theme.id} className="border rounded-md overflow-hidden">
                          <div className={`${theme.color} h-2`}></div>
                          <div className="p-4">
                            <div className="flex justify-between items-center">
                              <h3 className="font-medium text-lg">{theme.name}</h3>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setActiveTheme(theme)}
                                >
                                  {activeTheme?.id === theme.id ? 'Selected' : 'Select'}
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleDeleteTheme(theme.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {theme.papers.length} papers in this theme
                            </p>
                            
                            <div className="mt-4 space-y-2">
                              {theme.papers.map(paperId => {
                                const paper = papers.find(p => p.id === paperId);
                                if (!paper) return null;
                                
                                return (
                                  <div key={paperId} className="flex justify-between items-center p-2 rounded-md bg-muted/50">
                                    <div className="text-sm font-medium truncate flex-1">{paper.title}</div>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => handleRemoveFromTheme(theme.id, paperId)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {activeTheme && (
                        <div className="mt-8 pt-6 border-t">
                          <h3 className="font-medium text-lg mb-4">Generate Literature Review</h3>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Review Topic</label>
                              <Input
                                placeholder="e.g., Advances in AI for Medical Imaging"
                                value={reviewTopic}
                                onChange={(e) => setReviewTopic(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Scope and Focus</label>
                              <Textarea
                                placeholder="Describe the scope, focus, and any specific aspects you want to emphasize in the review..."
                                value={reviewScope}
                                onChange={(e) => setReviewScope(e.target.value)}
                                rows={3}
                              />
                            </div>
                            <Button 
                              className="w-full" 
                              onClick={handleGenerateReview}
                              disabled={isGenerating}
                            >
                              {isGenerating ? (
                                <>
                                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                  Generating Review...
                                </>
                              ) : (
                                <>
                                  <FileText className="mr-2 h-4 w-4" />
                                  Generate Literature Review
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="review">
                  {generatedSections.length === 0 ? (
                    <div className="text-center py-12 border rounded-md">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                      <h3 className="mt-4 font-medium">No Review Generated Yet</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Select a theme and generate a literature review to see the results here.
                      </p>
                      {activeTheme ? (
                        <Button className="mt-4" onClick={handleGenerateReview}>
                          <FileText className="h-4 w-4 mr-2" />
                          Generate Review
                        </Button>
                      ) : (
                        <Button className="mt-4" disabled>
                          Select a Theme First
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">
                          Literature Review: {activeTheme?.name}
                        </h2>
                        <Button variant="outline" onClick={handleExportReview}>
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                      
                      <div className="space-y-6">
                        {generatedSections.map((section, index) => (
                          <div key={index} className="border rounded-md p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-bold text-lg">{section.title}</h3>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => copyToClipboard(section.content)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="prose max-w-none">
                              <p className="whitespace-pre-line">{section.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6 pt-4 border-t">
                        <h3 className="font-medium mb-2">Improvement Suggestions</h3>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                            <span>Consider adding more recent papers (2023-2024) to strengthen the review's currency.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                            <span>The "Transfer Learning" section could benefit from more examples of specific architectures.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                            <span>Consider adding a section on limitations and challenges in the field.</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Create Theme Dialog */}
      {isCreatingTheme && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Create New Theme</CardTitle>
              <CardDescription>
                Create a theme to organize related papers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Theme Name</label>
                  <Input
                    value={newThemeName}
                    onChange={(e) => setNewThemeName(e.target.value)}
                    placeholder="e.g., Deep Learning Methods"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  {papers.filter(p => p.selected).length} papers will be added to this theme
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setIsCreatingTheme(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTheme} disabled={!newThemeName}>
                <Plus className="mr-2 h-4 w-4" />
                Create Theme
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LiteratureReviewAssistant;