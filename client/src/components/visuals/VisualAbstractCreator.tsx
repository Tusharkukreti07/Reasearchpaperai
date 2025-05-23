import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { 
  Image as ImageIcon, 
  Download, 
  Upload, 
  Copy, 
  Palette, 
  Layout, 
  Type, 
  FileImage,
  RefreshCw,
  Share2,
  Layers,
  Sparkles,
  Save
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

interface TemplateOption {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
}

const VisualAbstractCreator: React.FC = () => {
  const [activeTab, setActiveTab] = useState('content');
  const [title, setTitle] = useState('');
  const [mainFindings, setMainFindings] = useState('');
  const [methods, setMethods] = useState('');
  const [conclusions, setConclusions] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [colorScheme, setColorScheme] = useState('blue');
  const [loading, setLoading] = useState(false);
  const [generatedAbstract, setGeneratedAbstract] = useState<string | null>(null);
  const [customElements, setCustomElements] = useState<{id: string, type: string, content: string}[]>([]);

  // Sample template options
  const templateOptions: TemplateOption[] = [
    {
      id: 'template1',
      name: 'Classic Three-Panel',
      description: 'Methods → Results → Conclusion in a horizontal layout',
      imageUrl: '/templates/classic-three-panel.png',
      category: 'general'
    },
    {
      id: 'template2',
      name: 'Circular Flow',
      description: 'Information arranged in a circular flow diagram',
      imageUrl: '/templates/circular-flow.png',
      category: 'general'
    },
    {
      id: 'template3',
      name: 'Comparison Split',
      description: 'Side-by-side comparison of two conditions or groups',
      imageUrl: '/templates/comparison-split.png',
      category: 'comparison'
    },
    {
      id: 'template4',
      name: 'Process Timeline',
      description: 'Sequential steps or timeline of processes',
      imageUrl: '/templates/process-timeline.png',
      category: 'process'
    },
    {
      id: 'template5',
      name: 'Data Focused',
      description: 'Emphasizes charts, graphs, and data visualization',
      imageUrl: '/templates/data-focused.png',
      category: 'data'
    },
    {
      id: 'template6',
      name: 'Minimalist',
      description: 'Clean design with essential information only',
      imageUrl: '/templates/minimalist.png',
      category: 'general'
    },
  ];

  // Color scheme options
  const colorSchemes = [
    { id: 'blue', name: 'Blue Scientific', colors: ['#1a5276', '#2980b9', '#aed6f1'] },
    { id: 'green', name: 'Green Medical', colors: ['#145a32', '#27ae60', '#abebc6'] },
    { id: 'purple', name: 'Purple Academic', colors: ['#4a235a', '#8e44ad', '#d2b4de'] },
    { id: 'red', name: 'Red Impact', colors: ['#641e16', '#c0392b', '#f5b7b1'] },
    { id: 'orange', name: 'Orange Energy', colors: ['#7e5109', '#d35400', '#f8c471'] },
    { id: 'teal', name: 'Teal Modern', colors: ['#0e6251', '#16a085', '#a2d9ce'] },
    { id: 'gray', name: 'Gray Professional', colors: ['#212f3d', '#566573', '#d5d8dc'] },
    { id: 'custom', name: 'Custom Colors', colors: [] },
  ];

  const handleGenerateAbstract = () => {
    if (!title.trim()) {
      toast({
        title: 'Title required',
        description: 'Please enter a title for your visual abstract.',
        variant: 'destructive',
      });
      return;
    }

    if (!mainFindings.trim()) {
      toast({
        title: 'Main findings required',
        description: 'Please enter the main findings of your research.',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedTemplate) {
      toast({
        title: 'Template required',
        description: 'Please select a template for your visual abstract.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call to generate visual abstract
    setTimeout(() => {
      // In a real app, this would be a URL to the generated image
      setGeneratedAbstract('https://example.com/generated-abstract.png');
      setLoading(false);
      setActiveTab('preview');
      
      toast({
        title: 'Visual abstract created',
        description: 'Your visual abstract has been generated successfully.',
      });
    }, 3000);
  };

  const handleAddElement = (type: string) => {
    const newElement = {
      id: `element-${Date.now()}`,
      type,
      content: ''
    };
    setCustomElements([...customElements, newElement]);
  };

  const handleUpdateElement = (id: string, content: string) => {
    setCustomElements(customElements.map(el => 
      el.id === id ? { ...el, content } : el
    ));
  };

  const handleRemoveElement = (id: string) => {
    setCustomElements(customElements.filter(el => el.id !== id));
  };

  const handleClear = () => {
    setTitle('');
    setMainFindings('');
    setMethods('');
    setConclusions('');
    setSelectedTemplate('');
    setColorScheme('blue');
    setGeneratedAbstract(null);
    setCustomElements([]);
    setActiveTab('content');
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Visual Abstract Creator</CardTitle>
          <CardDescription>
            Create compelling visual abstracts to increase the visibility and impact of your research.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="customize">Customize</TabsTrigger>
              <TabsTrigger value="preview" disabled={!generatedAbstract}>Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Research Title</Label>
                  <Input 
                    id="title"
                    placeholder="Enter the title of your research" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Keep it concise (10-15 words). This will be prominently displayed.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="main-findings">Main Findings</Label>
                  <Textarea 
                    id="main-findings"
                    placeholder="What are the key results or findings of your research?" 
                    className="min-h-[100px]"
                    value={mainFindings}
                    onChange={(e) => setMainFindings(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Focus on 2-3 key findings. Use bullet points for clarity (• point 1 • point 2).
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="methods">Methods (Optional)</Label>
                  <Textarea 
                    id="methods"
                    placeholder="Briefly describe your methodology" 
                    className="min-h-[100px]"
                    value={methods}
                    onChange={(e) => setMethods(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Keep it brief. Focus on novel methods or key experimental design elements.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="conclusions">Conclusions & Implications (Optional)</Label>
                  <Textarea 
                    id="conclusions"
                    placeholder="What are the main conclusions and implications of your research?" 
                    className="min-h-[100px]"
                    value={conclusions}
                    onChange={(e) => setConclusions(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Highlight the significance and potential impact of your findings.
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={() => setActiveTab('design')}>
                    Next: Choose Design
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="design">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Select a Template</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {templateOptions.map((template) => (
                      <div 
                        key={template.id}
                        className={`border rounded-lg p-2 cursor-pointer transition-all ${
                          selectedTemplate === template.id 
                            ? 'border-primary ring-2 ring-primary ring-opacity-50' 
                            : 'border-border hover:border-primary'
                        }`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-2">
                          <Layout className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                          <div className="font-medium">{template.name}</div>
                          <div className="text-xs text-muted-foreground">{template.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Color Scheme</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {colorSchemes.map((scheme) => (
                      <div 
                        key={scheme.id}
                        className={`border rounded-lg p-2 cursor-pointer transition-all ${
                          colorScheme === scheme.id 
                            ? 'border-primary ring-2 ring-primary ring-opacity-50' 
                            : 'border-border hover:border-primary'
                        }`}
                        onClick={() => setColorScheme(scheme.id)}
                      >
                        <div className="flex space-x-1 mb-2">
                          {scheme.colors.map((color, index) => (
                            <div 
                              key={index}
                              className="h-6 flex-1 rounded-sm"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <div className="text-sm font-medium">{scheme.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab('content')}>
                    Back
                  </Button>
                  <Button onClick={() => setActiveTab('customize')}>
                    Next: Customize
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="customize">
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Add Custom Elements</h3>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleAddElement('text')}>
                        <Type className="mr-2 h-4 w-4" />
                        Add Text
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleAddElement('image')}>
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Add Image
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleAddElement('chart')}>
                        <BarChart className="mr-2 h-4 w-4" />
                        Add Chart
                      </Button>
                    </div>
                  </div>
                  
                  {customElements.length === 0 ? (
                    <div className="border border-dashed rounded-lg p-6 text-center">
                      <Layers className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                      <h4 className="font-medium mb-1">No custom elements added</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Add text, images, or charts to enhance your visual abstract
                      </p>
                      <div className="flex justify-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleAddElement('text')}>
                          <Type className="mr-2 h-4 w-4" />
                          Add Text
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleAddElement('image')}>
                          <ImageIcon className="mr-2 h-4 w-4" />
                          Add Image
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {customElements.map((element) => (
                        <div key={element.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium flex items-center">
                              {element.type === 'text' && <Type className="mr-2 h-4 w-4" />}
                              {element.type === 'image' && <ImageIcon className="mr-2 h-4 w-4" />}
                              {element.type === 'chart' && <BarChart className="mr-2 h-4 w-4" />}
                              {element.type.charAt(0).toUpperCase() + element.type.slice(1)} Element
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRemoveElement(element.id)}
                            >
                              Remove
                            </Button>
                          </div>
                          
                          {element.type === 'text' && (
                            <Textarea 
                              placeholder="Enter text content"
                              value={element.content}
                              onChange={(e) => handleUpdateElement(element.id, e.target.value)}
                              className="min-h-[80px]"
                            />
                          )}
                          
                          {element.type === 'image' && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-center border border-dashed rounded-lg p-4">
                                <div className="text-center">
                                  <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                                  <Button variant="outline" size="sm">Upload Image</Button>
                                </div>
                              </div>
                              <Input 
                                placeholder="Image caption (optional)"
                                value={element.content}
                                onChange={(e) => handleUpdateElement(element.id, e.target.value)}
                              />
                            </div>
                          )}
                          
                          {element.type === 'chart' && (
                            <div className="space-y-2">
                              <Select onValueChange={(value) => handleUpdateElement(element.id, value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select chart type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="bar">Bar Chart</SelectItem>
                                  <SelectItem value="line">Line Chart</SelectItem>
                                  <SelectItem value="pie">Pie Chart</SelectItem>
                                  <SelectItem value="scatter">Scatter Plot</SelectItem>
                                </SelectContent>
                              </Select>
                              <div className="flex items-center justify-center border border-dashed rounded-lg p-4 bg-muted">
                                <div className="text-center">
                                  <BarChart className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                                  <p className="text-sm text-muted-foreground">Chart preview will appear here</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Advanced Options</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="include-qr">Include QR Code</Label>
                        <Switch id="include-qr" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Add a QR code linking to your full paper
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="include-logo">Include Institution Logo</Label>
                        <Switch id="include-logo" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Add your institution's logo to the abstract
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Text Size</Label>
                      <Slider defaultValue={[50]} max={100} step={1} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Image Quality</Label>
                      <Select defaultValue="high">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard (72 DPI)</SelectItem>
                          <SelectItem value="high">High (150 DPI)</SelectItem>
                          <SelectItem value="print">Print Quality (300 DPI)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab('design')}>
                    Back
                  </Button>
                  <Button onClick={handleGenerateAbstract} disabled={loading}>
                    {loading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Visual Abstract
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="preview">
              {generatedAbstract && (
                <div className="space-y-6">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted p-2 flex items-center justify-between">
                      <div className="font-medium">Preview</div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Palette className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="aspect-video bg-white flex items-center justify-center p-4">
                      <div className="relative w-full h-full border border-dashed rounded-lg flex items-center justify-center">
                        <FileImage className="h-16 w-16 text-muted-foreground" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-muted-foreground">Visual abstract preview</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              (In a real app, the generated image would appear here)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
                    <Card className="flex-1">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Download Options</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <Button className="w-full justify-start" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            PNG Image
                          </Button>
                          <Button className="w-full justify-start" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            PDF Document
                          </Button>
                          <Button className="w-full justify-start" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            PowerPoint Slide
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="flex-1">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Share</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full justify-start" size="sm">
                            <Share2 className="mr-2 h-4 w-4" />
                            Share via Email
                          </Button>
                          <Button variant="outline" className="w-full justify-start" size="sm">
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Link
                          </Button>
                          <Button variant="outline" className="w-full justify-start" size="sm">
                            <Share2 className="mr-2 h-4 w-4" />
                            Share to Social Media
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab('customize')}>
                      Back to Edit
                    </Button>
                    <Button>
                      <Save className="mr-2 h-4 w-4" />
                      Save to My Projects
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleClear}>Clear All</Button>
          {activeTab === 'customize' && (
            <Button onClick={handleGenerateAbstract} disabled={loading}>
              {loading ? 'Generating...' : 'Generate Visual Abstract'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default VisualAbstractCreator;