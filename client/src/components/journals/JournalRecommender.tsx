import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { 
  Search, 
  Filter,
  BookOpen,
  Globe,
  Star,
  Calendar,
  BarChart4,
  FileText,
  Upload,
  Download,
  CheckCircle2,
  Info
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
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Journal {
  id: string;
  name: string;
  publisher: string;
  impactFactor: number;
  acceptanceRate: string;
  openAccess: boolean;
  reviewTime: string;
  field: string;
  subfield: string;
  website: string;
  matchScore: number;
}

const JournalRecommender: React.FC = () => {
  const [abstract, setAbstract] = useState('');
  const [keywords, setKeywords] = useState('');
  const [field, setField] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Journal[]>([]);
  const [filters, setFilters] = useState({
    openAccessOnly: false,
    minImpactFactor: 0,
    maxReviewTime: 12, // in weeks
  });

  // Sample journal data (in a real app, this would come from an API)
  const sampleJournals: Journal[] = [
    {
      id: '1',
      name: 'Nature',
      publisher: 'Springer Nature',
      impactFactor: 49.962,
      acceptanceRate: '7.6%',
      openAccess: true,
      reviewTime: '4-6 weeks',
      field: 'Multidisciplinary',
      subfield: 'General Science',
      website: 'https://www.nature.com',
      matchScore: 92,
    },
    {
      id: '2',
      name: 'Science',
      publisher: 'American Association for the Advancement of Science',
      impactFactor: 47.728,
      acceptanceRate: '6.4%',
      openAccess: false,
      reviewTime: '4-8 weeks',
      field: 'Multidisciplinary',
      subfield: 'General Science',
      website: 'https://www.science.org',
      matchScore: 88,
    },
    {
      id: '3',
      name: 'Cell',
      publisher: 'Elsevier',
      impactFactor: 41.582,
      acceptanceRate: '8.7%',
      openAccess: false,
      reviewTime: '6-10 weeks',
      field: 'Biology',
      subfield: 'Cell Biology',
      website: 'https://www.cell.com',
      matchScore: 76,
    },
    {
      id: '4',
      name: 'PLOS ONE',
      publisher: 'Public Library of Science',
      impactFactor: 3.24,
      acceptanceRate: '45.1%',
      openAccess: true,
      reviewTime: '3-5 weeks',
      field: 'Multidisciplinary',
      subfield: 'General Science',
      website: 'https://journals.plos.org/plosone/',
      matchScore: 65,
    },
    {
      id: '5',
      name: 'IEEE Transactions on Pattern Analysis and Machine Intelligence',
      publisher: 'IEEE',
      impactFactor: 16.389,
      acceptanceRate: '21.3%',
      openAccess: false,
      reviewTime: '8-12 weeks',
      field: 'Computer Science',
      subfield: 'Artificial Intelligence',
      website: 'https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=34',
      matchScore: 58,
    },
  ];

  const handleRecommend = () => {
    if (!abstract.trim() && !keywords.trim()) {
      toast({
        title: 'Input required',
        description: 'Please enter either an abstract or keywords to get recommendations.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Filter journals based on user preferences
      let filtered = [...sampleJournals];
      
      if (filters.openAccessOnly) {
        filtered = filtered.filter(journal => journal.openAccess);
      }
      
      filtered = filtered.filter(journal => journal.impactFactor >= filters.minImpactFactor);
      
      // Sort by match score
      filtered.sort((a, b) => b.matchScore - a.matchScore);
      
      setRecommendations(filtered);
      setLoading(false);
      
      toast({
        title: 'Recommendations ready',
        description: `Found ${filtered.length} journals that match your research.`,
      });
    }, 2000);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClear = () => {
    setAbstract('');
    setKeywords('');
    setField('');
    setRecommendations([]);
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Journal Recommender</CardTitle>
          <CardDescription>
            Find the perfect journal for your research paper based on your abstract, keywords, and field of study.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="abstract" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="abstract">Abstract</TabsTrigger>
              <TabsTrigger value="keywords">Keywords</TabsTrigger>
              <TabsTrigger value="field">Field of Study</TabsTrigger>
            </TabsList>
            
            <TabsContent value="abstract">
              <div className="space-y-4">
                <Textarea 
                  placeholder="Paste your paper's abstract here..." 
                  className="min-h-[200px]"
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                />
                <div className="text-sm text-muted-foreground">
                  For best results, include your full abstract (200-300 words).
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="keywords">
              <div className="space-y-4">
                <Textarea 
                  placeholder="Enter keywords separated by commas (e.g., machine learning, neural networks, computer vision)" 
                  className="min-h-[100px]"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
                <div className="text-sm text-muted-foreground">
                  Add 5-10 keywords that best describe your research.
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="field">
              <div className="space-y-4">
                <Select onValueChange={setField}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your research field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="computer_science">Computer Science</SelectItem>
                    <SelectItem value="biology">Biology</SelectItem>
                    <SelectItem value="medicine">Medicine</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                    <SelectItem value="psychology">Psychology</SelectItem>
                    <SelectItem value="economics">Economics</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="social_sciences">Social Sciences</SelectItem>
                    <SelectItem value="humanities">Humanities</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-sm text-muted-foreground">
                  Selecting your field helps us narrow down journal recommendations.
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 space-y-4">
            <div className="text-lg font-medium">Filters</div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="open-access" 
                    checked={filters.openAccessOnly}
                    onCheckedChange={(checked) => handleFilterChange('openAccessOnly', checked)}
                  />
                  <Label htmlFor="open-access">Open Access Only</Label>
                </div>
                <div className="text-sm text-muted-foreground">
                  Show only open access journals
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Minimum Impact Factor: {filters.minImpactFactor.toFixed(1)}</Label>
                <Slider 
                  value={[filters.minImpactFactor]} 
                  min={0} 
                  max={50} 
                  step={0.1}
                  onValueChange={(value) => handleFilterChange('minImpactFactor', value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Maximum Review Time: {filters.maxReviewTime} weeks</Label>
                <Slider 
                  value={[filters.maxReviewTime]} 
                  min={2} 
                  max={24} 
                  step={1}
                  onValueChange={(value) => handleFilterChange('maxReviewTime', value[0])}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleClear}>Clear</Button>
          <Button onClick={handleRecommend} disabled={loading}>
            {loading ? 'Finding journals...' : 'Get Recommendations'}
          </Button>
        </CardFooter>
      </Card>
      
      {recommendations.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recommended Journals</h2>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export List
            </Button>
          </div>
          
          <div className="space-y-4">
            {recommendations.map((journal) => (
              <Card key={journal.id} className="overflow-hidden">
                <div className="flex items-center p-1 bg-gradient-to-r from-blue-500 to-purple-500">
                  <div className="bg-white p-1 rounded-full ml-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500">
                      <span className="text-white font-bold">{journal.matchScore}%</span>
                    </div>
                  </div>
                  <div className="ml-2 text-white font-medium">Match Score</div>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{journal.name}</CardTitle>
                      <CardDescription>{journal.publisher}</CardDescription>
                    </div>
                    <Badge variant={journal.openAccess ? "default" : "outline"}>
                      {journal.openAccess ? "Open Access" : "Subscription"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-2 text-yellow-500" />
                        <span className="font-medium">Impact Factor:</span>
                        <span className="ml-2">{journal.impactFactor}</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                        <span className="font-medium">Acceptance Rate:</span>
                        <span className="ml-2">{journal.acceptanceRate}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                        <span className="font-medium">Review Time:</span>
                        <span className="ml-2">{journal.reviewTime}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-2 text-purple-500" />
                        <span className="font-medium">Field:</span>
                        <span className="ml-2">{journal.field}</span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-indigo-500" />
                        <span className="font-medium">Subfield:</span>
                        <span className="ml-2">{journal.subfield}</span>
                      </div>
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2 text-cyan-500" />
                        <span className="font-medium">Website:</span>
                        <a href={journal.website} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500 hover:underline">
                          Visit Journal
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    <Info className="mr-2 h-4 w-4" />
                    Journal Details
                  </Button>
                  <Button size="sm">
                    Submit Paper
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalRecommender;