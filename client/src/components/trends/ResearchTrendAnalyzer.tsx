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
  Plus, 
  Trash2, 
  Edit, 
  Save,
  Download,
  Upload,
  RefreshCw,
  FileText,
  Tag,
  Filter,
  FolderPlus,
  Folder,
  BookOpen,
  Copy,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  X,
  BarChart2,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Calendar,
  Globe,
  Users,
  BookMarked,
  Lightbulb,
  Zap,
  Sparkles,
  Loader2,
  ChevronDown,
  ChevronUp,
  Info,
  HelpCircle,
  Share2,
  Bookmark,
  BookmarkPlus,
  Printer,
  FileDown,
  Maximize2,
  Minimize2,
  Layers,
  Sliders
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ResearchTrend {
  id: string;
  name: string;
  category: string;
  growthRate: number;
  yearlyData: {
    year: number;
    papers: number;
    citations: number;
    funding: number;
  }[];
  topAuthors: {
    name: string;
    papers: number;
    citations: number;
    hIndex: number;
    institution: string;
  }[];
  topInstitutions: {
    name: string;
    papers: number;
    citations: number;
  }[];
  relatedTopics: {
    name: string;
    correlation: number;
  }[];
  description: string;
  emergingSubfields: {
    name: string;
    growthRate: number;
  }[];
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  geographicDistribution: {
    region: string;
    papers: number;
    percentage: number;
  }[];
  fundingTrends: {
    source: string;
    amount: number;
    percentage: number;
  }[];
  patentActivity: {
    year: number;
    count: number;
  }[];
  predictedGrowth: {
    year: number;
    papers: number;
    confidence: number;
  }[];
  lastUpdated: Date;
}

interface ResearchField {
  id: string;
  name: string;
  subfields: {
    id: string;
    name: string;
  }[];
}

interface SavedAnalysis {
  id: string;
  name: string;
  description: string;
  trends: string[];
  dateCreated: Date;
  lastModified: Date;
  notes: string;
}

const mockResearchFields: ResearchField[] = [
  {
    id: '1',
    name: 'Artificial Intelligence',
    subfields: [
      { id: '1-1', name: 'Machine Learning' },
      { id: '1-2', name: 'Natural Language Processing' },
      { id: '1-3', name: 'Computer Vision' },
      { id: '1-4', name: 'Reinforcement Learning' },
      { id: '1-5', name: 'Neural Networks' },
      { id: '1-6', name: 'Generative AI' }
    ]
  },
  {
    id: '2',
    name: 'Biotechnology',
    subfields: [
      { id: '2-1', name: 'CRISPR' },
      { id: '2-2', name: 'Synthetic Biology' },
      { id: '2-3', name: 'Genomics' },
      { id: '2-4', name: 'Proteomics' },
      { id: '2-5', name: 'Bioinformatics' }
    ]
  },
  {
    id: '3',
    name: 'Climate Science',
    subfields: [
      { id: '3-1', name: 'Climate Modeling' },
      { id: '3-2', name: 'Carbon Capture' },
      { id: '3-3', name: 'Renewable Energy' },
      { id: '3-4', name: 'Climate Adaptation' },
      { id: '3-5', name: 'Atmospheric Science' }
    ]
  },
  {
    id: '4',
    name: 'Quantum Computing',
    subfields: [
      { id: '4-1', name: 'Quantum Algorithms' },
      { id: '4-2', name: 'Quantum Error Correction' },
      { id: '4-3', name: 'Quantum Hardware' },
      { id: '4-4', name: 'Quantum Cryptography' },
      { id: '4-5', name: 'Quantum Simulation' }
    ]
  },
  {
    id: '5',
    name: 'Neuroscience',
    subfields: [
      { id: '5-1', name: 'Cognitive Neuroscience' },
      { id: '5-2', name: 'Computational Neuroscience' },
      { id: '5-3', name: 'Neuroimaging' },
      { id: '5-4', name: 'Neurogenetics' },
      { id: '5-5', name: 'Brain-Computer Interfaces' }
    ]
  }
];

const mockResearchTrends: ResearchTrend[] = [
  {
    id: '1-5',
    name: 'Neural Networks',
    category: 'Artificial Intelligence',
    growthRate: 42.8,
    yearlyData: [
      { year: 2018, papers: 12500, citations: 187500, funding: 850 },
      { year: 2019, papers: 15800, citations: 245000, funding: 980 },
      { year: 2020, papers: 19200, citations: 312000, funding: 1150 },
      { year: 2021, papers: 24500, citations: 398000, funding: 1320 },
      { year: 2022, papers: 31200, citations: 487000, funding: 1580 },
      { year: 2023, papers: 38500, citations: 592000, funding: 1850 }
    ],
    topAuthors: [
      { name: 'Yoshua Bengio', papers: 187, citations: 125000, hIndex: 152, institution: 'University of Montreal' },
      { name: 'Geoffrey Hinton', papers: 165, citations: 142000, hIndex: 155, institution: 'University of Toronto' },
      { name: 'Yann LeCun', papers: 158, citations: 118000, hIndex: 149, institution: 'New York University' },
      { name: 'Andrew Ng', papers: 142, citations: 98000, hIndex: 132, institution: 'Stanford University' },
      { name: 'Jürgen Schmidhuber', papers: 138, citations: 87000, hIndex: 128, institution: 'IDSIA' }
    ],
    topInstitutions: [
      { name: 'Stanford University', papers: 1250, citations: 187500 },
      { name: 'MIT', papers: 1180, citations: 172000 },
      { name: 'Carnegie Mellon University', papers: 980, citations: 142000 },
      { name: 'University of California, Berkeley', papers: 920, citations: 135000 },
      { name: 'Google Research', papers: 850, citations: 128000 }
    ],
    relatedTopics: [
      { name: 'Deep Learning', correlation: 0.92 },
      { name: 'Machine Learning', correlation: 0.88 },
      { name: 'Artificial Intelligence', correlation: 0.85 },
      { name: 'Computer Vision', correlation: 0.78 },
      { name: 'Natural Language Processing', correlation: 0.76 },
      { name: 'Reinforcement Learning', correlation: 0.72 }
    ],
    description: 'Neural networks are computing systems inspired by the biological neural networks that constitute animal brains. The field has seen explosive growth with the rise of deep learning, particularly in applications such as image recognition, natural language processing, and generative AI.',
    emergingSubfields: [
      { name: 'Transformer Networks', growthRate: 87.5 },
      { name: 'Graph Neural Networks', growthRate: 65.2 },
      { name: 'Self-Supervised Learning', growthRate: 58.7 },
      { name: 'Diffusion Models', growthRate: 52.3 },
      { name: 'Neuro-Symbolic AI', growthRate: 45.1 }
    ],
    sentiment: {
      positive: 72,
      neutral: 23,
      negative: 5
    },
    geographicDistribution: [
      { region: 'North America', papers: 15400, percentage: 40 },
      { region: 'Europe', papers: 9625, percentage: 25 },
      { region: 'East Asia', papers: 7700, percentage: 20 },
      { region: 'South Asia', papers: 2310, percentage: 6 },
      { region: 'Australia/Oceania', papers: 1540, percentage: 4 },
      { region: 'Middle East', papers: 1155, percentage: 3 },
      { region: 'South America', papers: 770, percentage: 2 }
    ],
    fundingTrends: [
      { source: 'Industry', amount: 925, percentage: 50 },
      { source: 'Government', amount: 555, percentage: 30 },
      { source: 'Academic', amount: 185, percentage: 10 },
      { source: 'Non-profit', amount: 185, percentage: 10 }
    ],
    patentActivity: [
      { year: 2018, count: 1850 },
      { year: 2019, count: 2450 },
      { year: 2020, count: 3250 },
      { year: 2021, count: 4150 },
      { year: 2022, count: 5250 },
      { year: 2023, count: 6450 }
    ],
    predictedGrowth: [
      { year: 2024, papers: 47500, confidence: 0.92 },
      { year: 2025, papers: 58000, confidence: 0.85 },
      { year: 2026, papers: 69500, confidence: 0.78 },
      { year: 2027, papers: 82000, confidence: 0.72 },
      { year: 2028, papers: 95000, confidence: 0.65 }
    ],
    lastUpdated: new Date('2024-01-15')
  },
  {
    id: '1-6',
    name: 'Generative AI',
    category: 'Artificial Intelligence',
    growthRate: 128.5,
    yearlyData: [
      { year: 2018, papers: 850, citations: 12500, funding: 120 },
      { year: 2019, papers: 1250, citations: 22500, funding: 180 },
      { year: 2020, papers: 2450, citations: 42500, funding: 320 },
      { year: 2021, papers: 4850, citations: 87500, funding: 580 },
      { year: 2022, papers: 9750, citations: 175000, funding: 980 },
      { year: 2023, papers: 18500, citations: 325000, funding: 1650 }
    ],
    topAuthors: [
      { name: 'Ian Goodfellow', papers: 45, citations: 85000, hIndex: 92, institution: 'DeepMind' },
      { name: 'Alec Radford', papers: 28, citations: 72000, hIndex: 65, institution: 'OpenAI' },
      { name: 'Ilya Sutskever', papers: 32, citations: 68000, hIndex: 78, institution: 'OpenAI' },
      { name: 'Aditya Ramesh', papers: 18, citations: 45000, hIndex: 42, institution: 'OpenAI' },
      { name: 'Robin Rombach', papers: 15, citations: 38000, hIndex: 38, institution: 'Stability AI' }
    ],
    topInstitutions: [
      { name: 'OpenAI', papers: 125, citations: 185000 },
      { name: 'Google DeepMind', papers: 118, citations: 172000 },
      { name: 'Stanford University', papers: 95, citations: 125000 },
      { name: 'MIT', papers: 88, citations: 115000 },
      { name: 'Microsoft Research', papers: 82, citations: 105000 }
    ],
    relatedTopics: [
      { name: 'Diffusion Models', correlation: 0.94 },
      { name: 'Large Language Models', correlation: 0.92 },
      { name: 'Neural Networks', correlation: 0.88 },
      { name: 'Deep Learning', correlation: 0.86 },
      { name: 'Computer Vision', correlation: 0.82 },
      { name: 'Natural Language Processing', correlation: 0.80 }
    ],
    description: 'Generative AI refers to artificial intelligence systems capable of generating new content, including text, images, audio, and video. The field has seen unprecedented growth with breakthroughs in diffusion models, large language models, and multimodal systems, revolutionizing creative processes across industries.',
    emergingSubfields: [
      { name: 'Text-to-Image Models', growthRate: 156.2 },
      { name: 'Large Language Models', growthRate: 142.8 },
      { name: 'Text-to-Video Generation', growthRate: 128.5 },
      { name: 'Multimodal Generation', growthRate: 115.3 },
      { name: 'AI Music Generation', growthRate: 98.7 }
    ],
    sentiment: {
      positive: 68,
      neutral: 22,
      negative: 10
    },
    geographicDistribution: [
      { region: 'North America', papers: 9250, percentage: 50 },
      { region: 'Europe', papers: 4625, percentage: 25 },
      { region: 'East Asia', papers: 2775, percentage: 15 },
      { region: 'South Asia', papers: 925, percentage: 5 },
      { region: 'Australia/Oceania', papers: 370, percentage: 2 },
      { region: 'Middle East', papers: 370, percentage: 2 },
      { region: 'South America', papers: 185, percentage: 1 }
    ],
    fundingTrends: [
      { source: 'Industry', amount: 1155, percentage: 70 },
      { source: 'Government', amount: 330, percentage: 20 },
      { source: 'Academic', amount: 82.5, percentage: 5 },
      { source: 'Non-profit', amount: 82.5, percentage: 5 }
    ],
    patentActivity: [
      { year: 2018, count: 120 },
      { year: 2019, count: 250 },
      { year: 2020, count: 580 },
      { year: 2021, count: 1250 },
      { year: 2022, count: 2850 },
      { year: 2023, count: 5750 }
    ],
    predictedGrowth: [
      { year: 2024, papers: 32500, confidence: 0.88 },
      { year: 2025, papers: 52000, confidence: 0.82 },
      { year: 2026, papers: 78000, confidence: 0.75 },
      { year: 2027, papers: 112000, confidence: 0.68 },
      { year: 2028, papers: 150000, confidence: 0.62 }
    ],
    lastUpdated: new Date('2024-01-15')
  },
  {
    id: '2-1',
    name: 'CRISPR',
    category: 'Biotechnology',
    growthRate: 35.2,
    yearlyData: [
      { year: 2018, papers: 4250, citations: 85000, funding: 650 },
      { year: 2019, papers: 5150, citations: 112000, funding: 780 },
      { year: 2020, papers: 6250, citations: 145000, funding: 920 },
      { year: 2021, papers: 7850, citations: 182000, funding: 1080 },
      { year: 2022, papers: 9250, citations: 225000, funding: 1250 },
      { year: 2023, papers: 11500, citations: 275000, funding: 1450 }
    ],
    topAuthors: [
      { name: 'Jennifer Doudna', papers: 125, citations: 95000, hIndex: 128, institution: 'University of California, Berkeley' },
      { name: 'Feng Zhang', papers: 118, citations: 88000, hIndex: 122, institution: 'MIT' },
      { name: 'Emmanuelle Charpentier', papers: 95, citations: 82000, hIndex: 115, institution: 'Max Planck Institute' },
      { name: 'George Church', papers: 88, citations: 75000, hIndex: 112, institution: 'Harvard University' },
      { name: 'David Liu', papers: 82, citations: 68000, hIndex: 105, institution: 'Harvard University' }
    ],
    topInstitutions: [
      { name: 'Harvard University', papers: 850, citations: 125000 },
      { name: 'MIT', papers: 780, citations: 115000 },
      { name: 'University of California, Berkeley', papers: 720, citations: 105000 },
      { name: 'Stanford University', papers: 650, citations: 95000 },
      { name: 'Broad Institute', papers: 580, citations: 85000 }
    ],
    relatedTopics: [
      { name: 'Gene Editing', correlation: 0.95 },
      { name: 'Genomics', correlation: 0.88 },
      { name: 'Synthetic Biology', correlation: 0.82 },
      { name: 'Biotechnology', correlation: 0.78 },
      { name: 'Genetic Engineering', correlation: 0.76 },
      { name: 'Base Editing', correlation: 0.72 }
    ],
    description: 'CRISPR (Clustered Regularly Interspaced Short Palindromic Repeats) is a revolutionary gene-editing technology that allows for precise modifications to DNA sequences. The technology has transformative applications in medicine, agriculture, and biotechnology, with potential to cure genetic diseases, create more resilient crops, and develop novel therapeutics.',
    emergingSubfields: [
      { name: 'Prime Editing', growthRate: 68.5 },
      { name: 'CRISPR Diagnostics', growthRate: 52.3 },
      { name: 'CRISPR Therapeutics', growthRate: 48.7 },
      { name: 'CRISPR in Agriculture', growthRate: 42.1 },
      { name: 'CRISPR Delivery Systems', growthRate: 38.5 }
    ],
    sentiment: {
      positive: 65,
      neutral: 25,
      negative: 10
    },
    geographicDistribution: [
      { region: 'North America', papers: 4600, percentage: 40 },
      { region: 'Europe', papers: 3450, percentage: 30 },
      { region: 'East Asia', papers: 2300, percentage: 20 },
      { region: 'South Asia', papers: 575, percentage: 5 },
      { region: 'Australia/Oceania', papers: 230, percentage: 2 },
      { region: 'Middle East', papers: 230, percentage: 2 },
      { region: 'South America', papers: 115, percentage: 1 }
    ],
    fundingTrends: [
      { source: 'Government', amount: 725, percentage: 50 },
      { source: 'Industry', amount: 435, percentage: 30 },
      { source: 'Non-profit', amount: 217.5, percentage: 15 },
      { source: 'Academic', amount: 72.5, percentage: 5 }
    ],
    patentActivity: [
      { year: 2018, count: 850 },
      { year: 2019, count: 1050 },
      { year: 2020, count: 1350 },
      { year: 2021, count: 1750 },
      { year: 2022, count: 2250 },
      { year: 2023, count: 2850 }
    ],
    predictedGrowth: [
      { year: 2024, papers: 14500, confidence: 0.92 },
      { year: 2025, papers: 18000, confidence: 0.88 },
      { year: 2026, papers: 22000, confidence: 0.82 },
      { year: 2027, papers: 26500, confidence: 0.75 },
      { year: 2028, papers: 31500, confidence: 0.68 }
    ],
    lastUpdated: new Date('2024-01-10')
  },
  {
    id: '4-3',
    name: 'Quantum Hardware',
    category: 'Quantum Computing',
    growthRate: 45.8,
    yearlyData: [
      { year: 2018, papers: 1250, citations: 18500, funding: 350 },
      { year: 2019, papers: 1650, citations: 25000, funding: 450 },
      { year: 2020, papers: 2250, citations: 35000, funding: 580 },
      { year: 2021, papers: 3150, citations: 48000, funding: 750 },
      { year: 2022, papers: 4250, citations: 65000, funding: 980 },
      { year: 2023, papers: 5850, citations: 88000, funding: 1250 }
    ],
    topAuthors: [
      { name: 'John Martinis', papers: 85, citations: 45000, hIndex: 95, institution: 'University of California, Santa Barbara' },
      { name: 'Andreas Wallraff', papers: 78, citations: 38000, hIndex: 88, institution: 'ETH Zurich' },
      { name: 'Robert Schoelkopf', papers: 72, citations: 35000, hIndex: 85, institution: 'Yale University' },
      { name: 'Chaoyang Lu', papers: 65, citations: 28000, hIndex: 75, institution: 'University of Science and Technology of China' },
      { name: 'Jian-Wei Pan', papers: 62, citations: 25000, hIndex: 72, institution: 'University of Science and Technology of China' }
    ],
    topInstitutions: [
      { name: 'IBM Research', papers: 450, citations: 65000 },
      { name: 'Google Quantum AI', papers: 380, citations: 58000 },
      { name: 'University of Science and Technology of China', papers: 320, citations: 45000 },
      { name: 'MIT', papers: 280, citations: 42000 },
      { name: 'Delft University of Technology', papers: 250, citations: 38000 }
    ],
    relatedTopics: [
      { name: 'Superconducting Qubits', correlation: 0.92 },
      { name: 'Quantum Computing', correlation: 0.88 },
      { name: 'Quantum Error Correction', correlation: 0.85 },
      { name: 'Trapped Ions', correlation: 0.82 },
      { name: 'Quantum Algorithms', correlation: 0.75 },
      { name: 'Quantum Supremacy', correlation: 0.72 }
    ],
    description: 'Quantum hardware encompasses the physical components and systems required to build quantum computers. This includes various qubit technologies such as superconducting circuits, trapped ions, photonics, and topological qubits, as well as the control systems, readout mechanisms, and error correction infrastructure necessary for quantum computation.',
    emergingSubfields: [
      { name: 'Superconducting Qubits', growthRate: 58.5 },
      { name: 'Trapped Ion Quantum Computers', growthRate: 52.3 },
      { name: 'Photonic Quantum Computing', growthRate: 48.7 },
      { name: 'Topological Qubits', growthRate: 42.1 },
      { name: 'Neutral Atom Quantum Computing', growthRate: 38.5 }
    ],
    sentiment: {
      positive: 72,
      neutral: 25,
      negative: 3
    },
    geographicDistribution: [
      { region: 'North America', papers: 2340, percentage: 40 },
      { region: 'Europe', papers: 1755, percentage: 30 },
      { region: 'East Asia', papers: 1170, percentage: 20 },
      { region: 'Australia/Oceania', papers: 292.5, percentage: 5 },
      { region: 'South Asia', papers: 117, percentage: 2 },
      { region: 'Middle East', papers: 117, percentage: 2 },
      { region: 'South America', papers: 58.5, percentage: 1 }
    ],
    fundingTrends: [
      { source: 'Government', amount: 625, percentage: 50 },
      { source: 'Industry', amount: 500, percentage: 40 },
      { source: 'Academic', amount: 75, percentage: 6 },
      { source: 'Non-profit', amount: 50, percentage: 4 }
    ],
    patentActivity: [
      { year: 2018, count: 250 },
      { year: 2019, count: 350 },
      { year: 2020, count: 480 },
      { year: 2021, count: 650 },
      { year: 2022, count: 880 },
      { year: 2023, count: 1250 }
    ],
    predictedGrowth: [
      { year: 2024, papers: 8250, confidence: 0.92 },
      { year: 2025, papers: 11500, confidence: 0.85 },
      { year: 2026, papers: 15750, confidence: 0.78 },
      { year: 2027, papers: 21000, confidence: 0.72 },
      { year: 2028, papers: 27500, confidence: 0.65 }
    ],
    lastUpdated: new Date('2024-01-12')
  },
  {
    id: '5-5',
    name: 'Brain-Computer Interfaces',
    category: 'Neuroscience',
    growthRate: 38.5,
    yearlyData: [
      { year: 2018, papers: 1850, citations: 28000, funding: 280 },
      { year: 2019, papers: 2350, citations: 36000, funding: 350 },
      { year: 2020, papers: 2950, citations: 45000, funding: 420 },
      { year: 2021, papers: 3750, citations: 58000, funding: 520 },
      { year: 2022, papers: 4850, citations: 72000, funding: 650 },
      { year: 2023, papers: 6250, citations: 92000, funding: 820 }
    ],
    topAuthors: [
      { name: 'Miguel Nicolelis', papers: 95, citations: 48000, hIndex: 92, institution: 'Duke University' },
      { name: 'John Donoghue', papers: 88, citations: 42000, hIndex: 85, institution: 'Brown University' },
      { name: 'Edward Chang', papers: 82, citations: 38000, hIndex: 78, institution: 'University of California, San Francisco' },
      { name: 'Bin He', papers: 75, citations: 32000, hIndex: 72, institution: 'Carnegie Mellon University' },
      { name: 'José del R. Millán', papers: 68, citations: 28000, hIndex: 65, institution: 'University of Texas at Austin' }
    ],
    topInstitutions: [
      { name: 'Stanford University', papers: 380, citations: 58000 },
      { name: 'University of California, San Francisco', papers: 350, citations: 52000 },
      { name: 'Duke University', papers: 320, citations: 48000 },
      { name: 'Brown University', papers: 280, citations: 42000 },
      { name: 'Carnegie Mellon University', papers: 250, citations: 38000 }
    ],
    relatedTopics: [
      { name: 'Neural Implants', correlation: 0.92 },
      { name: 'Neurotechnology', correlation: 0.88 },
      { name: 'Neuroprosthetics', correlation: 0.85 },
      { name: 'Neural Engineering', correlation: 0.82 },
      { name: 'Neurofeedback', correlation: 0.75 },
      { name: 'Neuromorphic Computing', correlation: 0.68 }
    ],
    description: 'Brain-Computer Interfaces (BCIs) are systems that establish a direct communication pathway between the brain and an external device. BCIs can be invasive (implanted in the brain) or non-invasive (using external sensors), and have applications in assistive technology for people with disabilities, neuroscience research, and emerging consumer applications.',
    emergingSubfields: [
      { name: 'Invasive Neural Interfaces', growthRate: 52.3 },
      { name: 'Non-invasive BCI', growthRate: 48.7 },
      { name: 'BCI for Rehabilitation', growthRate: 42.1 },
      { name: 'Consumer Neurotechnology', growthRate: 38.5 },
      { name: 'Bidirectional Neural Interfaces', growthRate: 35.2 }
    ],
    sentiment: {
      positive: 62,
      neutral: 28,
      negative: 10
    },
    geographicDistribution: [
      { region: 'North America', papers: 2500, percentage: 40 },
      { region: 'Europe', papers: 1875, percentage: 30 },
      { region: 'East Asia', papers: 1250, percentage: 20 },
      { region: 'South Asia', papers: 312.5, percentage: 5 },
      { region: 'Australia/Oceania', papers: 125, percentage: 2 },
      { region: 'Middle East', papers: 125, percentage: 2 },
      { region: 'South America', papers: 62.5, percentage: 1 }
    ],
    fundingTrends: [
      { source: 'Government', amount: 410, percentage: 50 },
      { source: 'Industry', amount: 246, percentage: 30 },
      { source: 'Non-profit', amount: 123, percentage: 15 },
      { source: 'Academic', amount: 41, percentage: 5 }
    ],
    patentActivity: [
      { year: 2018, count: 350 },
      { year: 2019, count: 450 },
      { year: 2020, count: 580 },
      { year: 2021, count: 750 },
      { year: 2022, count: 980 },
      { year: 2023, count: 1250 }
    ],
    predictedGrowth: [
      { year: 2024, papers: 8500, confidence: 0.92 },
      { year: 2025, papers: 11250, confidence: 0.85 },
      { year: 2026, papers: 14750, confidence: 0.78 },
      { year: 2027, papers: 19000, confidence: 0.72 },
      { year: 2028, papers: 24500, confidence: 0.65 }
    ],
    lastUpdated: new Date('2024-01-08')
  }
];

const mockSavedAnalyses: SavedAnalysis[] = [
  {
    id: '1',
    name: 'AI Trends Comparison',
    description: 'Analysis of growth trends in neural networks vs. generative AI',
    trends: ['1-5', '1-6'],
    dateCreated: new Date('2023-12-10'),
    lastModified: new Date('2023-12-15'),
    notes: 'Generative AI is growing at a much faster rate than traditional neural networks, though from a smaller base. The field is dominated by industry research labs rather than academic institutions.'
  },
  {
    id: '2',
    name: 'Emerging Biotechnology',
    description: 'Analysis of CRISPR and related biotechnology trends',
    trends: ['2-1'],
    dateCreated: new Date('2023-11-20'),
    lastModified: new Date('2023-11-20'),
    notes: 'CRISPR research continues to grow steadily with strong government funding. Prime editing is the fastest-growing subfield.'
  }
];

const ResearchTrendAnalyzer: React.FC = () => {
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [selectedSubfields, setSelectedSubfields] = useState<string[]>([]);
  const [selectedTrends, setSelectedTrends] = useState<ResearchTrend[]>([]);
  const [activeTrend, setActiveTrend] = useState<ResearchTrend | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState<[number, number]>([2018, 2023]);
  const [metricType, setMetricType] = useState<'papers' | 'citations' | 'funding'>('papers');
  const [isComparing, setIsComparing] = useState(false);
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>(mockSavedAnalyses);
  const [activeSavedAnalysis, setActiveSavedAnalysis] = useState<SavedAnalysis | null>(null);
  const [newAnalysisName, setNewAnalysisName] = useState('');
  const [newAnalysisDescription, setNewAnalysisDescription] = useState('');
  const [isSavingAnalysis, setIsSavingAnalysis] = useState(false);
  const [analysisNotes, setAnalysisNotes] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'authors' | 'institutions' | 'geography' | 'funding' | 'predictions'>('overview');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [growthRateFilter, setGrowthRateFilter] = useState<[number, number]>([0, 150]);
  const [regionFilter, setRegionFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'growth' | 'papers' | 'citations' | 'funding'>('growth');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportType, setReportType] = useState<'summary' | 'detailed' | 'comparative'>('summary');
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'pdf'>('csv');

  const handleSelectField = (fieldId: string) => {
    setSelectedField(fieldId);
    setSelectedSubfields([]);
    setSelectedTrends([]);
    setActiveTrend(null);
  };

  const handleToggleSubfield = (subfieldId: string) => {
    setSelectedSubfields(prev => 
      prev.includes(subfieldId) 
        ? prev.filter(id => id !== subfieldId) 
        : [...prev, subfieldId]
    );
  };

  const handleAnalyzeTrends = () => {
    if (selectedSubfields.length === 0) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const trends = mockResearchTrends.filter(trend => 
        selectedSubfields.includes(trend.id)
      );
      
      setSelectedTrends(trends);
      setActiveTrend(trends.length > 0 ? trends[0] : null);
      setIsLoading(false);
    }, 1500);
  };

  const handleSelectTrend = (trend: ResearchTrend) => {
    setActiveTrend(trend);
    setIsComparing(false);
  };

  const handleToggleCompare = () => {
    setIsComparing(!isComparing);
  };

  const handleSaveAnalysis = () => {
    if (!newAnalysisName || selectedTrends.length === 0) return;
    
    const newAnalysis: SavedAnalysis = {
      id: (savedAnalyses.length + 1).toString(),
      name: newAnalysisName,
      description: newAnalysisDescription,
      trends: selectedTrends.map(t => t.id),
      dateCreated: new Date(),
      lastModified: new Date(),
      notes: analysisNotes
    };
    
    setSavedAnalyses([...savedAnalyses, newAnalysis]);
    setActiveSavedAnalysis(newAnalysis);
    setNewAnalysisName('');
    setNewAnalysisDescription('');
    setIsSavingAnalysis(false);
    
    toast({
      title: "Analysis saved",
      description: `"${newAnalysisName}" has been saved to your analyses.`,
    });
  };

  const handleLoadAnalysis = (analysis: SavedAnalysis) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const trends = mockResearchTrends.filter(trend => 
        analysis.trends.includes(trend.id)
      );
      
      setSelectedTrends(trends);
      setActiveTrend(trends.length > 0 ? trends[0] : null);
      setActiveSavedAnalysis(analysis);
      setAnalysisNotes(analysis.notes);
      setIsLoading(false);
    }, 1000);
  };

  const handleUpdateNotes = () => {
    if (!activeSavedAnalysis) return;
    
    const updatedAnalysis = {
      ...activeSavedAnalysis,
      notes: analysisNotes,
      lastModified: new Date()
    };
    
    setSavedAnalyses(savedAnalyses.map(a => 
      a.id === activeSavedAnalysis.id ? updatedAnalysis : a
    ));
    
    setActiveSavedAnalysis(updatedAnalysis);
    setIsEditingNotes(false);
    
    toast({
      title: "Notes updated",
      description: `Notes for "${activeSavedAnalysis.name}" have been updated.`,
    });
  };

  const handleDeleteAnalysis = (analysisId: string) => {
    setSavedAnalyses(savedAnalyses.filter(a => a.id !== analysisId));
    
    if (activeSavedAnalysis && activeSavedAnalysis.id === analysisId) {
      setActiveSavedAnalysis(null);
    }
    
    toast({
      title: "Analysis deleted",
      description: `The analysis has been deleted.`,
    });
  };

  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGeneratingReport(false);
      
      toast({
        title: "Report generated",
        description: `Your ${reportType} report has been generated.`,
      });
    }, 2000);
  };

  const handleExportData = () => {
    setIsExporting(true);
    
    // Simulate export
    setTimeout(() => {
      setIsExporting(false);
      
      toast({
        title: "Data exported",
        description: `Your data has been exported as ${exportFormat.toUpperCase()}.`,
      });
    }, 1500);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    } else {
      return num.toString();
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getGrowthIndicator = (rate: number) => {
    if (rate > 50) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (rate > 20) {
      return <ArrowUpRight className="h-4 w-4 text-emerald-500" />;
    } else if (rate > 0) {
      return <ArrowRight className="h-4 w-4 text-blue-500" />;
    } else if (rate > -20) {
      return <ArrowDownRight className="h-4 w-4 text-amber-500" />;
    } else {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
  };

  const getGrowthClass = (rate: number): string => {
    if (rate > 50) {
      return 'text-green-500';
    } else if (rate > 20) {
      return 'text-emerald-500';
    } else if (rate > 0) {
      return 'text-blue-500';
    } else if (rate > -20) {
      return 'text-amber-500';
    } else {
      return 'text-red-500';
    }
  };

  const filteredFields = mockResearchFields.filter(field => 
    searchQuery === '' || 
    field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    field.subfields.some(subfield => 
      subfield.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filteredTrends = selectedTrends.filter(trend => {
    const matchesGrowthRate = trend.growthRate >= growthRateFilter[0] && trend.growthRate <= growthRateFilter[1];
    const matchesRegion = !regionFilter || trend.geographicDistribution.some(geo => geo.region === regionFilter);
    return matchesGrowthRate && matchesRegion;
  });

  const sortedTrends = [...filteredTrends].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'growth':
        comparison = a.growthRate - b.growthRate;
        break;
      case 'papers':
        comparison = a.yearlyData[a.yearlyData.length - 1].papers - b.yearlyData[b.yearlyData.length - 1].papers;
        break;
      case 'citations':
        comparison = a.yearlyData[a.yearlyData.length - 1].citations - b.yearlyData[b.yearlyData.length - 1].citations;
        break;
      case 'funding':
        comparison = a.yearlyData[a.yearlyData.length - 1].funding - b.yearlyData[b.yearlyData.length - 1].funding;
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Research Trend Analyzer</h1>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <FileDown className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Export Format</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                setExportFormat('csv');
                setIsExporting(true);
                handleExportData();
              }}>
                CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setExportFormat('json');
                setIsExporting(true);
                handleExportData();
              }}>
                JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setExportFormat('pdf');
                setIsExporting(true);
                handleExportData();
              }}>
                PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Report Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                setReportType('summary');
                setIsGeneratingReport(true);
                handleGenerateReport();
              }}>
                Summary Report
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setReportType('detailed');
                setIsGeneratingReport(true);
                handleGenerateReport();
              }}>
                Detailed Analysis
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setReportType('comparative');
                setIsGeneratingReport(true);
                handleGenerateReport();
              }}>
                Comparative Analysis
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar: Fields and Saved Analyses */}
        <div className="lg:col-span-1">
          <Tabs defaultValue="fields">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="fields">Research Fields</TabsTrigger>
              <TabsTrigger value="saved">Saved Analyses</TabsTrigger>
            </TabsList>
            
            <TabsContent value="fields" className="mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Select Research Field</CardTitle>
                  <CardDescription>
                    Choose a field to explore research trends
                  </CardDescription>
                  <div className="mt-2">
                    <Input
                      placeholder="Search fields..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {filteredFields.map(field => (
                        <Collapsible 
                          key={field.id}
                          open={selectedField === field.id}
                          onOpenChange={() => handleSelectField(field.id)}
                        >
                          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md p-2 hover:bg-muted">
                            <span className="font-medium">{field.name}</span>
                            <ChevronDown className="h-4 w-4" />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="pl-4 pt-2">
                            <div className="space-y-2">
                              {field.subfields.map(subfield => (
                                <div key={subfield.id} className="flex items-center space-x-2">
                                  <Checkbox 
                                    id={subfield.id} 
                                    checked={selectedSubfields.includes(subfield.id)}
                                    onCheckedChange={() => handleToggleSubfield(subfield.id)}
                                  />
                                  <label
                                    htmlFor={subfield.id}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    {subfield.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={handleAnalyzeTrends}
                    disabled={selectedSubfields.length === 0 || isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <BarChart2 className="h-4 w-4 mr-2" />
                    )}
                    Analyze Trends
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="saved" className="mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Saved Analyses</CardTitle>
                  <CardDescription>
                    Load or manage your saved trend analyses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {savedAnalyses.length === 0 ? (
                    <div className="text-center py-8">
                      <BookMarked className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="mt-4 text-sm text-muted-foreground">
                        No saved analyses yet. Analyze trends and save them for future reference.
                      </p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-3">
                        {savedAnalyses.map(analysis => (
                          <Card key={analysis.id} className={`cursor-pointer hover:border-primary transition-colors ${activeSavedAnalysis?.id === analysis.id ? 'border-primary' : ''}`}>
                            <CardHeader className="p-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-base">{analysis.name}</CardTitle>
                                  <CardDescription className="text-xs">
                                    {formatDate(analysis.dateCreated)}
                                  </CardDescription>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleLoadAnalysis(analysis)}>
                                      <FileText className="h-4 w-4 mr-2" />
                                      Load Analysis
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => {
                                      setReportType('detailed');
                                      setIsGeneratingReport(true);
                                      handleGenerateReport();
                                    }}>
                                      <FileDown className="h-4 w-4 mr-2" />
                                      Generate Report
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      className="text-red-600"
                                      onClick={() => handleDeleteAnalysis(analysis.id)}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </CardHeader>
                            <CardContent className="p-3 pt-0">
                              <p className="text-sm">{analysis.description}</p>
                              <div className="mt-2 flex flex-wrap gap-1">
                                <Badge variant="outline" className="text-xs">
                                  {analysis.trends.length} trend{analysis.trends.length !== 1 ? 's' : ''}
                                </Badge>
                              </div>
                            </CardContent>
                            <CardFooter className="p-3 pt-0">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleLoadAnalysis(analysis)}
                              >
                                <FileText className="h-3.5 w-3.5 mr-1.5" />
                                Load
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setIsSavingAnalysis(true)}
                    disabled={selectedTrends.length === 0}
                  >
                    <BookmarkPlus className="h-4 w-4 mr-2" />
                    Save Current Analysis
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-[600px]">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-center text-lg text-muted-foreground">
                Analyzing research trends...
              </p>
            </div>
          ) : selectedTrends.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[600px] border rounded-lg">
              <BarChart2 className="h-16 w-16 text-muted-foreground" />
              <h2 className="mt-4 text-xl font-medium">No Trends Selected</h2>
              <p className="mt-2 text-center text-muted-foreground max-w-md">
                Select a research field and subfields from the sidebar, then click "Analyze Trends" to explore research trends.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Trends List and Filters */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Research Trends</CardTitle>
                      <CardDescription>
                        {selectedTrends.length} trend{selectedTrends.length !== 1 ? 's' : ''} analyzed
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant={showAdvancedFilters ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                      >
                        <Sliders className="h-4 w-4 mr-2" />
                        Filters
                      </Button>
                      <Button 
                        variant={isComparing ? "default" : "outline"} 
                        size="sm"
                        onClick={handleToggleCompare}
                        disabled={selectedTrends.length < 2}
                      >
                        <BarChart2 className="h-4 w-4 mr-2" />
                        Compare
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                {showAdvancedFilters && (
                  <CardContent className="pb-0 border-b">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Growth Rate Range</Label>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{growthRateFilter[0]}%</span>
                          <span className="text-sm">{growthRateFilter[1]}%</span>
                        </div>
                        <Slider
                          value={growthRateFilter}
                          min={0}
                          max={150}
                          step={5}
                          onValueChange={(value) => setGrowthRateFilter(value as [number, number])}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Region Focus</Label>
                        <Select value={regionFilter || ''} onValueChange={(value) => setRegionFilter(value || null)}>
                          <SelectTrigger>
                            <SelectValue placeholder="All Regions" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All Regions</SelectItem>
                            <SelectItem value="North America">North America</SelectItem>
                            <SelectItem value="Europe">Europe</SelectItem>
                            <SelectItem value="East Asia">East Asia</SelectItem>
                            <SelectItem value="South Asia">South Asia</SelectItem>
                            <SelectItem value="Australia/Oceania">Australia/Oceania</SelectItem>
                            <SelectItem value="Middle East">Middle East</SelectItem>
                            <SelectItem value="South America">South America</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Sort By</Label>
                        <div className="flex gap-2">
                          <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                            <SelectTrigger className="flex-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="growth">Growth Rate</SelectItem>
                              <SelectItem value="papers">Publication Count</SelectItem>
                              <SelectItem value="citations">Citation Count</SelectItem>
                              <SelectItem value="funding">Funding Amount</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                          >
                            {sortOrder === 'asc' ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
                
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {sortedTrends.length === 0 ? (
                      <div className="text-center py-8">
                        <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground" />
                        <p className="mt-4 text-sm text-muted-foreground">
                          No trends match your filter criteria. Try adjusting your filters.
                        </p>
                      </div>
                    ) : (
                      sortedTrends.map(trend => (
                        <div 
                          key={trend.id} 
                          className={`p-3 rounded-md border cursor-pointer ${activeTrend?.id === trend.id && !isComparing ? 'border-primary bg-primary/5' : ''}`}
                          onClick={() => handleSelectTrend(trend)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{trend.name}</h3>
                                <Badge variant="outline">{trend.category}</Badge>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center">
                                  {getGrowthIndicator(trend.growthRate)}
                                  <span className={`ml-1 text-sm font-medium ${getGrowthClass(trend.growthRate)}`}>
                                    {trend.growthRate}% growth
                                  </span>
                                </div>
                                <Separator orientation="vertical" className="h-4" />
                                <span className="text-sm text-muted-foreground">
                                  {formatNumber(trend.yearlyData[trend.yearlyData.length - 1].papers)} papers
                                </span>
                                <Separator orientation="vertical" className="h-4" />
                                <span className="text-sm text-muted-foreground">
                                  {formatNumber(trend.yearlyData[trend.yearlyData.length - 1].citations)} citations
                                </span>
                              </div>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {trend.emergingSubfields.slice(0, 3).map((subfield, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {subfield.name}
                                  </Badge>
                                ))}
                                {trend.emergingSubfields.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{trend.emergingSubfields.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <Checkbox 
                              checked={isComparing && selectedTrends.some(t => t.id === trend.id)}
                              onCheckedChange={() => {
                                if (isComparing) {
                                  handleSelectTrend(trend);
                                }
                              }}
                              className={isComparing ? 'opacity-100' : 'opacity-0'}
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Trend Details */}
              {activeTrend && !isComparing && (
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle>{activeTrend.name}</CardTitle>
                          <Badge>{activeTrend.category}</Badge>
                        </div>
                        <CardDescription>
                          Last updated: {formatDate(activeTrend.lastUpdated)}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline" size="icon">
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Share this trend analysis
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline" size="icon">
                                <Printer className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Print trend analysis
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline" size="icon">
                                <Bookmark className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Save to favorites
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-0">
                    <Tabs defaultValue="overview" onValueChange={(value) => setActiveTab(value as any)}>
                      <TabsList className="grid grid-cols-6 mb-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="authors">Authors</TabsTrigger>
                        <TabsTrigger value="institutions">Institutions</TabsTrigger>
                        <TabsTrigger value="geography">Geography</TabsTrigger>
                        <TabsTrigger value="funding">Funding</TabsTrigger>
                        <TabsTrigger value="predictions">Predictions</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card>
                            <CardHeader className="p-4 pb-2">
                              <CardTitle className="text-base">Growth Rate</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <div className="flex items-center">
                                {getGrowthIndicator(activeTrend.growthRate)}
                                <span className={`ml-2 text-2xl font-bold ${getGrowthClass(activeTrend.growthRate)}`}>
                                  {activeTrend.growthRate}%
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                Annual growth rate (2022-2023)
                              </p>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader className="p-4 pb-2">
                              <CardTitle className="text-base">Publications</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <div className="text-2xl font-bold">
                                {formatNumber(activeTrend.yearlyData[activeTrend.yearlyData.length - 1].papers)}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                Total papers published in 2023
                              </p>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader className="p-4 pb-2">
                              <CardTitle className="text-base">Citations</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <div className="text-2xl font-bold">
                                {formatNumber(activeTrend.yearlyData[activeTrend.yearlyData.length - 1].citations)}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                Total citations in 2023
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-2">Trend Description</h3>
                          <p className="text-muted-foreground">{activeTrend.description}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-2">Publication Trend (2018-2023)</h3>
                          <div className="h-64 border rounded-md p-4 flex items-center justify-center">
                            <div className="text-center text-muted-foreground">
                              [Publication trend chart would be displayed here]
                            </div>
                          </div>
                          <div className="flex justify-center mt-4">
                            <div className="flex items-center gap-6">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span className="text-sm">Papers</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="text-sm">Citations</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                <span className="text-sm">Funding ($M)</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-2">Emerging Subfields</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {activeTrend.emergingSubfields.map((subfield, index) => (
                              <Card key={index}>
                                <CardHeader className="p-4 pb-2">
                                  <CardTitle className="text-base">{subfield.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                  <div className="flex items-center">
                                    {getGrowthIndicator(subfield.growthRate)}
                                    <span className={`ml-2 text-lg font-bold ${getGrowthClass(subfield.growthRate)}`}>
                                      {subfield.growthRate}%
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    Annual growth rate
                                  </p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-2">Related Topics</h3>
                          <div className="flex flex-wrap gap-2">
                            {activeTrend.relatedTopics.map((topic, index) => (
                              <Badge 
                                key={index} 
                                variant="outline"
                                className="text-sm py-1.5 px-3"
                              >
                                {topic.name}
                                <span className="ml-2 text-xs text-muted-foreground">
                                  {(topic.correlation * 100).toFixed(0)}%
                                </span>
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-2">Sentiment Analysis</h3>
                          <div className="grid grid-cols-3 gap-4">
                            <Card className="bg-green-50 dark:bg-green-950">
                              <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-base text-green-700 dark:text-green-300">Positive</CardTitle>
                              </CardHeader>
                              <CardContent className="p-4 pt-0">
                                <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                                  {activeTrend.sentiment.positive}%
                                </div>
                              </CardContent>
                            </Card>
                            
                            <Card className="bg-blue-50 dark:bg-blue-950">
                              <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-base text-blue-700 dark:text-blue-300">Neutral</CardTitle>
                              </CardHeader>
                              <CardContent className="p-4 pt-0">
                                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                  {activeTrend.sentiment.neutral}%
                                </div>
                              </CardContent>
                            </Card>
                            
                            <Card className="bg-red-50 dark:bg-red-950">
                              <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-base text-red-700 dark:text-red-300">Negative</CardTitle>
                              </CardHeader>
                              <CardContent className="p-4 pt-0">
                                <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                                  {activeTrend.sentiment.negative}%
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="authors">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-medium mb-4">Top Contributing Authors</h3>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Author</TableHead>
                                  <TableHead>Institution</TableHead>
                                  <TableHead className="text-right">Papers</TableHead>
                                  <TableHead className="text-right">Citations</TableHead>
                                  <TableHead className="text-right">h-index</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {activeTrend.topAuthors.map((author, index) => (
                                  <TableRow key={index}>
                                    <TableCell className="font-medium">{author.name}</TableCell>
                                    <TableCell>{author.institution}</TableCell>
                                    <TableCell className="text-right">{author.papers}</TableCell>
                                    <TableCell className="text-right">{formatNumber(author.citations)}</TableCell>
                                    <TableCell className="text-right">{author.hIndex}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-2">Author Collaboration Network</h3>
                            <div className="h-64 border rounded-md p-4 flex items-center justify-center">
                              <div className="text-center text-muted-foreground">
                                [Author collaboration network visualization would be displayed here]
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-2">Author Publication Trends</h3>
                            <div className="h-64 border rounded-md p-4 flex items-center justify-center">
                              <div className="text-center text-muted-foreground">
                                [Author publication trends chart would be displayed here]
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="institutions">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-medium mb-4">Top Contributing Institutions</h3>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Institution</TableHead>
                                  <TableHead className="text-right">Papers</TableHead>
                                  <TableHead className="text-right">Citations</TableHead>
                                  <TableHead className="text-right">Citations per Paper</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {activeTrend.topInstitutions.map((institution, index) => (
                                  <TableRow key={index}>
                                    <TableCell className="font-medium">{institution.name}</TableCell>
                                    <TableCell className="text-right">{institution.papers}</TableCell>
                                    <TableCell className="text-right">{formatNumber(institution.citations)}</TableCell>
                                    <TableCell className="text-right">{(institution.citations / institution.papers).toFixed(1)}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-2">Institution Collaboration Network</h3>
                            <div className="h-64 border rounded-md p-4 flex items-center justify-center">
                              <div className="text-center text-muted-foreground">
                                [Institution collaboration network visualization would be displayed here]
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-2">Academic vs. Industry Research</h3>
                            <div className="h-64 border rounded-md p-4 flex items-center justify-center">
                              <div className="text-center text-muted-foreground">
                                [Academic vs. Industry research comparison chart would be displayed here]
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="geography">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-medium mb-2">Geographic Distribution of Research</h3>
                            <div className="h-64 border rounded-md p-4 flex items-center justify-center">
                              <div className="text-center text-muted-foreground">
                                [World map visualization of research distribution would be displayed here]
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-4">Research Output by Region</h3>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Region</TableHead>
                                  <TableHead className="text-right">Papers</TableHead>
                                  <TableHead className="text-right">Percentage</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {activeTrend.geographicDistribution.map((region, index) => (
                                  <TableRow key={index}>
                                    <TableCell className="font-medium">{region.region}</TableCell>
                                    <TableCell className="text-right">{formatNumber(region.papers)}</TableCell>
                                    <TableCell className="text-right">{region.percentage}%</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-2">Regional Growth Trends</h3>
                            <div className="h-64 border rounded-md p-4 flex items-center justify-center">
                              <div className="text-center text-muted-foreground">
                                [Regional growth trends chart would be displayed here]
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-2">International Collaboration Patterns</h3>
                            <div className="h-64 border rounded-md p-4 flex items-center justify-center">
                              <div className="text-center text-muted-foreground">
                                [International collaboration network visualization would be displayed here]
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="funding">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-medium mb-2">Funding Trends (2018-2023)</h3>
                            <div className="h-64 border rounded-md p-4 flex items-center justify-center">
                              <div className="text-center text-muted-foreground">
                                [Funding trends chart would be displayed here]
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-4">Funding Sources</h3>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Source</TableHead>
                                  <TableHead className="text-right">Amount ($M)</TableHead>
                                  <TableHead className="text-right">Percentage</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {activeTrend.fundingTrends.map((source, index) => (
                                  <TableRow key={index}>
                                    <TableCell className="font-medium">{source.source}</TableCell>
                                    <TableCell className="text-right">{source.amount}</TableCell>
                                    <TableCell className="text-right">{source.percentage}%</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-2">Patent Activity</h3>
                            <div className="h-64 border rounded-md p-4 flex items-center justify-center">
                              <div className="text-center text-muted-foreground">
                                [Patent activity chart would be displayed here]
                              </div>
                            </div>
                            <div className="mt-4">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Year</TableHead>
                                    <TableHead className="text-right">Patent Count</TableHead>
                                    <TableHead className="text-right">YoY Growth</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {activeTrend.patentActivity.map((year, index) => (
                                    <TableRow key={index}>
                                      <TableCell className="font-medium">{year.year}</TableCell>
                                      <TableCell className="text-right">{year.count}</TableCell>
                                      <TableCell className="text-right">
                                        {index > 0 ? (
                                          <span className={getGrowthClass(((year.count - activeTrend.patentActivity[index - 1].count) / activeTrend.patentActivity[index - 1].count) * 100)}>
                                            {(((year.count - activeTrend.patentActivity[index - 1].count) / activeTrend.patentActivity[index - 1].count) * 100).toFixed(1)}%
                                          </span>
                                        ) : '-'}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="predictions">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-medium mb-2">Predicted Growth (2024-2028)</h3>
                            <div className="h-64 border rounded-md p-4 flex items-center justify-center">
                              <div className="text-center text-muted-foreground">
                                [Predicted growth chart would be displayed here]
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-4">Publication Forecasts</h3>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Year</TableHead>
                                  <TableHead className="text-right">Predicted Papers</TableHead>
                                  <TableHead className="text-right">YoY Growth</TableHead>
                                  <TableHead className="text-right">Confidence</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {activeTrend.predictedGrowth.map((year, index) => (
                                  <TableRow key={index}>
                                    <TableCell className="font-medium">{year.year}</TableCell>
                                    <TableCell className="text-right">{formatNumber(year.papers)}</TableCell>
                                    <TableCell className="text-right">
                                      {index > 0 ? (
                                        <span className={getGrowthClass(((year.papers - activeTrend.predictedGrowth[index - 1].papers) / activeTrend.predictedGrowth[index - 1].papers) * 100)}>
                                          {(((year.papers - activeTrend.predictedGrowth[index - 1].papers) / activeTrend.predictedGrowth[index - 1].papers) * 100).toFixed(1)}%
                                        </span>
                                      ) : (
                                        <span className={getGrowthClass(((year.papers - activeTrend.yearlyData[activeTrend.yearlyData.length - 1].papers) / activeTrend.yearlyData[activeTrend.yearlyData.length - 1].papers) * 100)}>
                                          {(((year.papers - activeTrend.yearlyData[activeTrend.yearlyData.length - 1].papers) / activeTrend.yearlyData[activeTrend.yearlyData.length - 1].papers) * 100).toFixed(1)}%
                                        </span>
                                      )}
                                    </TableCell>
                                    <TableCell className="text-right">{(year.confidence * 100).toFixed(0)}%</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-2">Emerging Research Directions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Card>
                                <CardHeader className="p-4 pb-2">
                                  <CardTitle className="text-base">Technical Challenges</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                  <ul className="space-y-2 text-sm">
                                    <li className="flex items-start gap-2">
                                      <Sparkles className="h-4 w-4 text-blue-500 mt-0.5" />
                                      <span>Improving computational efficiency</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <Sparkles className="h-4 w-4 text-blue-500 mt-0.5" />
                                      <span>Enhancing model interpretability</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <Sparkles className="h-4 w-4 text-blue-500 mt-0.5" />
                                      <span>Addressing data quality issues</span>
                                    </li>
                                  </ul>
                                </CardContent>
                              </Card>
                              
                              <Card>
                                <CardHeader className="p-4 pb-2">
                                  <CardTitle className="text-base">Application Areas</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                  <ul className="space-y-2 text-sm">
                                    <li className="flex items-start gap-2">
                                      <Sparkles className="h-4 w-4 text-green-500 mt-0.5" />
                                      <span>Integration with other emerging technologies</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <Sparkles className="h-4 w-4 text-green-500 mt-0.5" />
                                      <span>Expansion to new industry domains</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <Sparkles className="h-4 w-4 text-green-500 mt-0.5" />
                                      <span>Development of specialized tools</span>
                                    </li>
                                  </ul>
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-2">Market Impact Forecast</h3>
                            <div className="h-64 border rounded-md p-4 flex items-center justify-center">
                              <div className="text-center text-muted-foreground">
                                [Market impact forecast visualization would be displayed here]
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}
              
              {/* Comparative Analysis */}
              {isComparing && selectedTrends.length >= 2 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Comparative Analysis</CardTitle>
                    <CardDescription>
                      Comparing {selectedTrends.length} research trends
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Growth Rate Comparison</h3>
                        <div className="space-y-3">
                          {selectedTrends.map(trend => (
                            <div key={trend.id} className="flex items-center gap-4">
                              <div className="w-32 font-medium truncate">{trend.name}</div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <Progress 
                                    value={trend.growthRate} 
                                    max={150} 
                                    className={getGrowthClass(trend.growthRate)}
                                  />
                                  <span className={`w-16 text-right font-medium ${getGrowthClass(trend.growthRate)}`}>
                                    {trend.growthRate}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Publication Trends Comparison</h3>
                        <div className="h-64 border rounded-md p-4 flex items-center justify-center">
                          <div className="text-center text-muted-foreground">
                            [Comparative publication trends chart would be displayed here]
                          </div>
                        </div>
                        <div className="flex justify-center mt-4">
                          <div className="flex flex-wrap items-center gap-4">
                            {selectedTrends.map((trend, index) => (
                              <div key={trend.id} className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full bg-${['blue', 'green', 'amber', 'purple', 'pink'][index % 5]}-500`}></div>
                                <span className="text-sm">{trend.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4">Key Metrics Comparison</h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Trend</TableHead>
                              <TableHead className="text-right">Papers (2023)</TableHead>
                              <TableHead className="text-right">Citations (2023)</TableHead>
                              <TableHead className="text-right">Funding ($M)</TableHead>
                              <TableHead className="text-right">Growth Rate</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedTrends.map(trend => (
                              <TableRow key={trend.id}>
                                <TableCell className="font-medium">{trend.name}</TableCell>
                                <TableCell className="text-right">{formatNumber(trend.yearlyData[trend.yearlyData.length - 1].papers)}</TableCell>
                                <TableCell className="text-right">{formatNumber(trend.yearlyData[trend.yearlyData.length - 1].citations)}</TableCell>
                                <TableCell className="text-right">{trend.yearlyData[trend.yearlyData.length - 1].funding}</TableCell>
                                <TableCell className={`text-right font-medium ${getGrowthClass(trend.growthRate)}`}>
                                  {trend.growthRate}%
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Geographic Distribution Comparison</h3>
                        <div className="h-64 border rounded-md p-4 flex items-center justify-center">
                          <div className="text-center text-muted-foreground">
                            [Comparative geographic distribution visualization would be displayed here]
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Funding Sources Comparison</h3>
                        <div className="h-64 border rounded-md p-4 flex items-center justify-center">
                          <div className="text-center text-muted-foreground">
                            [Comparative funding sources visualization would be displayed here]
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Future Growth Projections</h3>
                        <div className="h-64 border rounded-md p-4 flex items-center justify-center">
                          <div className="text-center text-muted-foreground">
                            [Comparative growth projections chart would be displayed here]
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Analysis Notes */}
              {activeSavedAnalysis && (
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>Analysis Notes</CardTitle>
                      {!isEditingNotes ? (
                        <Button variant="outline" size="sm" onClick={() => setIsEditingNotes(true)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Notes
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => setIsEditingNotes(false)}>
                            Cancel
                          </Button>
                          <Button size="sm" onClick={handleUpdateNotes}>
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isEditingNotes ? (
                      <Textarea
                        value={analysisNotes}
                        onChange={(e) => setAnalysisNotes(e.target.value)}
                        placeholder="Add your analysis notes here..."
                        rows={6}
                      />
                    ) : (
                      <div className="text-muted-foreground whitespace-pre-line">
                        {analysisNotes || 'No notes added yet. Click "Edit Notes" to add your analysis.'}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Save Analysis Dialog */}
      {isSavingAnalysis && (
        <Dialog open={isSavingAnalysis} onOpenChange={setIsSavingAnalysis}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Analysis</DialogTitle>
              <DialogDescription>
                Save your current analysis for future reference
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="analysisName">Analysis Name</Label>
                <Input
                  id="analysisName"
                  value={newAnalysisName}
                  onChange={(e) => setNewAnalysisName(e.target.value)}
                  placeholder="e.g., AI Trends Comparison"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="analysisDescription">Description (optional)</Label>
                <Textarea
                  id="analysisDescription"
                  value={newAnalysisDescription}
                  onChange={(e) => setNewAnalysisDescription(e.target.value)}
                  placeholder="Brief description of this analysis..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="analysisNotes">Analysis Notes (optional)</Label>
                <Textarea
                  id="analysisNotes"
                  value={analysisNotes}
                  onChange={(e) => setAnalysisNotes(e.target.value)}
                  placeholder="Add your analysis notes here..."
                  rows={5}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSavingAnalysis(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveAnalysis} disabled={!newAnalysisName}>
                <BookmarkPlus className="h-4 w-4 mr-2" />
                Save Analysis
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Report Generation Dialog */}
      {isGeneratingReport && (
        <Dialog open={isGeneratingReport} onOpenChange={setIsGeneratingReport}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generating Report</DialogTitle>
              <DialogDescription>
                Creating a {reportType} report of your analysis
              </DialogDescription>
            </DialogHeader>
            <div className="py-8 flex flex-col items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-center text-muted-foreground">
                Please wait while we generate your report...
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Export Data Dialog */}
      {isExporting && (
        <Dialog open={isExporting} onOpenChange={setIsExporting}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Exporting Data</DialogTitle>
              <DialogDescription>
                Exporting your analysis data as {exportFormat.toUpperCase()}
              </DialogDescription>
            </DialogHeader>
            <div className="py-8 flex flex-col items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-center text-muted-foreground">
                Please wait while we prepare your data...
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ResearchTrendAnalyzer;