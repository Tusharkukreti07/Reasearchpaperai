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
  Sparkles,
  Lightbulb,
  Wand2,
  Highlighter,
  Scissors,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Link,
  Image,
  Table,
  Heading1,
  Heading2,
  Heading3,
  PanelLeftClose,
  PanelRightClose,
  BarChart2,
  Maximize2,
  Minimize2,
  HelpCircle,
  Settings,
  Zap,
  Clock,
  History,
  Bookmark,
  BookmarkPlus,
  Check,
  Loader2
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

interface WritingProject {
  id: string;
  title: string;
  type: 'paper' | 'thesis' | 'dissertation' | 'report' | 'proposal' | 'other';
  sections: WritingSection[];
  lastEdited: Date;
  wordCount: number;
  targetWordCount: number;
  status: 'draft' | 'revision' | 'final';
  dueDate?: Date;
  collaborators: string[];
  tags: string[];
}

interface WritingSection {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  targetWordCount?: number;
  status: 'not-started' | 'in-progress' | 'review' | 'completed';
  comments: Comment[];
  lastEdited: Date;
}

interface Comment {
  id: string;
  user: string;
  text: string;
  timestamp: Date;
  resolved: boolean;
}

interface Suggestion {
  id: string;
  type: 'grammar' | 'style' | 'clarity' | 'conciseness' | 'vocabulary' | 'structure';
  text: string;
  replacement: string;
  explanation: string;
  severity: 'low' | 'medium' | 'high';
  position: {
    start: number;
    end: number;
  };
}

interface WritingMetrics {
  readability: {
    fleschKincaid: number;
    automatedReadability: number;
    colemanLiau: number;
    smog: number;
    gunningFog: number;
    overall: number;
  };
  style: {
    passiveVoice: number;
    sentenceVariety: number;
    wordVariety: number;
    adverbUsage: number;
    overall: number;
  };
  structure: {
    paragraphLength: number;
    sentenceLength: number;
    transitionWords: number;
    overall: number;
  };
  clarity: {
    jargon: number;
    complexity: number;
    redundancy: number;
    overall: number;
  };
  overall: number;
}

const mockProjects: WritingProject[] = [
  {
    id: '1',
    title: 'Machine Learning Applications in Healthcare',
    type: 'paper',
    sections: [
      {
        id: 's1',
        title: 'Abstract',
        content: 'This paper explores the applications of machine learning in healthcare, focusing on diagnostic tools, treatment optimization, and patient monitoring systems. We review recent advances in deep learning models for medical imaging and discuss their integration into clinical workflows. Additionally, we address challenges related to data privacy, model interpretability, and regulatory compliance.',
        wordCount: 52,
        targetWordCount: 250,
        status: 'in-progress',
        comments: [],
        lastEdited: new Date('2023-05-10T14:30:00')
      },
      {
        id: 's2',
        title: 'Introduction',
        content: 'Healthcare systems worldwide face increasing pressure to improve patient outcomes while reducing costs. Machine learning (ML) technologies offer promising solutions to these challenges by enabling more accurate diagnoses, personalized treatment plans, and efficient resource allocation. Recent advances in computational power and algorithm design have accelerated the development of ML applications in clinical settings.\n\nDespite these opportunities, the adoption of ML in healthcare faces significant barriers, including concerns about data quality, model interpretability, and integration with existing clinical workflows. This paper examines the current state of ML applications in healthcare, evaluates their impact on clinical practice, and identifies key challenges and future directions.',
        wordCount: 98,
        targetWordCount: 500,
        status: 'in-progress',
        comments: [
          {
            id: 'c1',
            user: 'Dr. Smith',
            text: 'Consider adding more specific examples of ML applications in the introduction.',
            timestamp: new Date('2023-05-11T09:15:00'),
            resolved: false
          }
        ],
        lastEdited: new Date('2023-05-11T10:45:00')
      },
      {
        id: 's3',
        title: 'Literature Review',
        content: '',
        wordCount: 0,
        targetWordCount: 1500,
        status: 'not-started',
        comments: [],
        lastEdited: new Date('2023-05-10T14:30:00')
      },
      {
        id: 's4',
        title: 'Methodology',
        content: '',
        wordCount: 0,
        targetWordCount: 1000,
        status: 'not-started',
        comments: [],
        lastEdited: new Date('2023-05-10T14:30:00')
      },
      {
        id: 's5',
        title: 'Results',
        content: '',
        wordCount: 0,
        targetWordCount: 1200,
        status: 'not-started',
        comments: [],
        lastEdited: new Date('2023-05-10T14:30:00')
      },
      {
        id: 's6',
        title: 'Discussion',
        content: '',
        wordCount: 0,
        targetWordCount: 1500,
        status: 'not-started',
        comments: [],
        lastEdited: new Date('2023-05-10T14:30:00')
      },
      {
        id: 's7',
        title: 'Conclusion',
        content: '',
        wordCount: 0,
        targetWordCount: 500,
        status: 'not-started',
        comments: [],
        lastEdited: new Date('2023-05-10T14:30:00')
      }
    ],
    lastEdited: new Date('2023-05-11T10:45:00'),
    wordCount: 150,
    targetWordCount: 6000,
    status: 'draft',
    dueDate: new Date('2023-06-15'),
    collaborators: ['Dr. Smith', 'Dr. Johnson'],
    tags: ['Machine Learning', 'Healthcare', 'AI']
  },
  {
    id: '2',
    title: 'Climate Change Impact on Biodiversity',
    type: 'thesis',
    sections: [
      {
        id: 's1',
        title: 'Abstract',
        content: 'This thesis examines the impact of climate change on global biodiversity, with a focus on vulnerable ecosystems. Through a combination of field studies and computational modeling, we assess species adaptation, migration patterns, and extinction risks under various climate scenarios.',
        wordCount: 38,
        targetWordCount: 300,
        status: 'completed',
        comments: [],
        lastEdited: new Date('2023-04-20T11:20:00')
      },
      {
        id: 's2',
        title: 'Introduction',
        content: 'Climate change represents one of the most significant threats to global biodiversity in the 21st century. Rising temperatures, changing precipitation patterns, and increasing frequency of extreme weather events are altering habitats and disrupting ecological relationships worldwide. These changes occur at rates that exceed many species\' ability to adapt, leading to concerns about widespread biodiversity loss and ecosystem collapse.',
        wordCount: 56,
        targetWordCount: 800,
        status: 'in-progress',
        comments: [],
        lastEdited: new Date('2023-04-22T15:10:00')
      }
    ],
    lastEdited: new Date('2023-04-22T15:10:00'),
    wordCount: 94,
    targetWordCount: 15000,
    status: 'draft',
    dueDate: new Date('2023-08-30'),
    collaborators: [],
    tags: ['Climate Change', 'Biodiversity', 'Ecology']
  }
];

const mockSuggestions: Suggestion[] = [
  {
    id: '1',
    type: 'grammar',
    text: 'Healthcare systems worldwide face increasing pressure',
    replacement: 'Healthcare systems worldwide are facing increasing pressure',
    explanation: 'Consider using the present progressive tense to emphasize the ongoing nature of this challenge.',
    severity: 'low',
    position: {
      start: 0,
      end: 52
    }
  },
  {
    id: '2',
    type: 'style',
    text: 'Recent advances in computational power and algorithm design have accelerated',
    replacement: 'Advances in computational power and algorithm design have recently accelerated',
    explanation: 'Repositioning "recently" can improve sentence flow and emphasis.',
    severity: 'low',
    position: {
      start: 214,
      end: 290
    }
  },
  {
    id: '3',
    type: 'clarity',
    text: 'Despite these opportunities, the adoption of ML in healthcare faces significant barriers',
    replacement: 'Despite these opportunities, healthcare organizations face significant barriers when adopting ML',
    explanation: 'Restructuring for clarity and to emphasize the actors (healthcare organizations) rather than the abstract concept.',
    severity: 'medium',
    position: {
      start: 291,
      end: 372
    }
  },
  {
    id: '4',
    type: 'conciseness',
    text: 'This paper examines the current state of ML applications in healthcare, evaluates their impact on clinical practice, and identifies key challenges and future directions.',
    replacement: 'This paper examines ML applications in healthcare, their clinical impact, and future directions.',
    explanation: 'The original sentence contains redundant information and can be more concise.',
    severity: 'medium',
    position: {
      start: 372,
      end: 521
    }
  }
];

const mockMetrics: WritingMetrics = {
  readability: {
    fleschKincaid: 12.8,
    automatedReadability: 13.2,
    colemanLiau: 14.1,
    smog: 13.5,
    gunningFog: 15.2,
    overall: 13.7
  },
  style: {
    passiveVoice: 15, // percentage of sentences with passive voice
    sentenceVariety: 72, // score out of 100
    wordVariety: 68, // score out of 100
    adverbUsage: 3.2, // percentage of words that are adverbs
    overall: 75
  },
  structure: {
    paragraphLength: 82, // score out of 100, higher is better balanced
    sentenceLength: 78, // score out of 100, higher is better variety
    transitionWords: 65, // score out of 100, higher is better usage
    overall: 75
  },
  clarity: {
    jargon: 12, // percentage of specialized terms
    complexity: 68, // score out of 100, lower is more complex
    redundancy: 8, // percentage of redundant phrases
    overall: 70
  },
  overall: 73
};

const AcademicWritingAssistant: React.FC = () => {
  const [projects, setProjects] = useState<WritingProject[]>(mockProjects);
  const [selectedProject, setSelectedProject] = useState<WritingProject | null>(null);
  const [selectedSection, setSelectedSection] = useState<WritingSection | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>(mockSuggestions);
  const [metrics, setMetrics] = useState<WritingMetrics>(mockMetrics);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [improvementType, setImprovementType] = useState<'clarity' | 'conciseness' | 'academic' | 'engagement'>('clarity');
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'outline' | 'suggestions' | 'metrics'>('outline');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [wordCountGoal, setWordCountGoal] = useState(0);
  const [isSettingWordCount, setIsSettingWordCount] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [aiWritingPrompt, setAiWritingPrompt] = useState('');
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isShowingHistory, setIsShowingHistory] = useState(false);
  const [contentHistory, setContentHistory] = useState<{timestamp: Date, content: string}[]>([]);
  const [focusMode, setFocusMode] = useState(false);
  const [wordCountTimer, setWordCountTimer] = useState<{active: boolean, target: number, timeLeft: number}>({
    active: false,
    target: 500,
    timeLeft: 25 * 60 // 25 minutes in seconds
  });

  const handleSelectProject = (project: WritingProject) => {
    setSelectedProject(project);
    setSelectedSection(null);
    setEditingContent('');
    setSuggestions([]);
  };

  const handleSelectSection = (section: WritingSection) => {
    setSelectedSection(section);
    setEditingContent(section.content);
    
    // Save current content to history if changing sections
    if (selectedSection && selectedSection.id !== section.id && selectedSection.content) {
      setContentHistory(prev => [
        { timestamp: new Date(), content: selectedSection.content },
        ...prev.slice(0, 9) // Keep only the last 10 entries
      ]);
    }
    
    // Simulate loading suggestions for this section
    setIsAnalyzing(true);
    setTimeout(() => {
      setSuggestions(mockSuggestions);
      setMetrics(mockMetrics);
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditingContent(e.target.value);
    
    // Update word count in real-time
    if (selectedSection && selectedProject) {
      const wordCount = countWords(e.target.value);
      
      // Update section
      const updatedSection = {
        ...selectedSection,
        content: e.target.value,
        wordCount,
        lastEdited: new Date()
      };
      
      // Update project with the updated section
      const updatedSections = selectedProject.sections.map(s => 
        s.id === selectedSection.id ? updatedSection : s
      );
      
      const totalWordCount = updatedSections.reduce((sum, section) => sum + section.wordCount, 0);
      
      const updatedProject = {
        ...selectedProject,
        sections: updatedSections,
        wordCount: totalWordCount,
        lastEdited: new Date()
      };
      
      // Update state
      setSelectedSection(updatedSection);
      setSelectedProject(updatedProject);
      
      // Update projects list
      setProjects(projects.map(p => 
        p.id === selectedProject.id ? updatedProject : p
      ));
    }
  };

  const handleSaveContent = () => {
    if (!selectedSection || !selectedProject) return;
    
    // Save current content to history
    setContentHistory(prev => [
      { timestamp: new Date(), content: selectedSection.content },
      ...prev.slice(0, 9) // Keep only the last 10 entries
    ]);
    
    // Update section
    const updatedSection = {
      ...selectedSection,
      content: editingContent,
      wordCount: countWords(editingContent),
      lastEdited: new Date()
    };
    
    // Update project with the updated section
    const updatedSections = selectedProject.sections.map(s => 
      s.id === selectedSection.id ? updatedSection : s
    );
    
    const totalWordCount = updatedSections.reduce((sum, section) => sum + section.wordCount, 0);
    
    const updatedProject = {
      ...selectedProject,
      sections: updatedSections,
      wordCount: totalWordCount,
      lastEdited: new Date()
    };
    
    // Update state
    setSelectedSection(updatedSection);
    setSelectedProject(updatedProject);
    
    // Update projects list
    setProjects(projects.map(p => 
      p.id === selectedProject.id ? updatedProject : p
    ));
    
    toast({
      title: "Content saved",
      description: `${updatedSection.title} has been updated.`,
    });
  };

  const handleCreateProject = () => {
    if (!newProjectTitle) return;
    
    const newProject: WritingProject = {
      id: (projects.length + 1).toString(),
      title: newProjectTitle,
      type: 'paper',
      sections: [
        {
          id: `s${Date.now()}`,
          title: 'Abstract',
          content: '',
          wordCount: 0,
          targetWordCount: 250,
          status: 'not-started',
          comments: [],
          lastEdited: new Date()
        },
        {
          id: `s${Date.now() + 1}`,
          title: 'Introduction',
          content: '',
          wordCount: 0,
          targetWordCount: 500,
          status: 'not-started',
          comments: [],
          lastEdited: new Date()
        }
      ],
      lastEdited: new Date(),
      wordCount: 0,
      targetWordCount: 3000,
      status: 'draft',
      collaborators: [],
      tags: []
    };
    
    setProjects([...projects, newProject]);
    setSelectedProject(newProject);
    setSelectedSection(null);
    setNewProjectTitle('');
    setIsCreatingProject(false);
    
    toast({
      title: "Project created",
      description: `"${newProjectTitle}" has been created.`,
    });
  };

  const handleAddSection = () => {
    if (!newSectionTitle || !selectedProject) return;
    
    const newSection: WritingSection = {
      id: `s${Date.now()}`,
      title: newSectionTitle,
      content: '',
      wordCount: 0,
      targetWordCount: 500,
      status: 'not-started',
      comments: [],
      lastEdited: new Date()
    };
    
    const updatedSections = [...selectedProject.sections, newSection];
    
    const updatedProject = {
      ...selectedProject,
      sections: updatedSections,
      lastEdited: new Date()
    };
    
    setSelectedProject(updatedProject);
    setProjects(projects.map(p => 
      p.id === selectedProject.id ? updatedProject : p
    ));
    
    setNewSectionTitle('');
    setIsAddingSection(false);
    
    toast({
      title: "Section added",
      description: `"${newSectionTitle}" has been added to your project.`,
    });
  };

  const handleSetWordCountGoal = () => {
    if (!selectedSection || !selectedProject || wordCountGoal <= 0) return;
    
    const updatedSection = {
      ...selectedSection,
      targetWordCount: wordCountGoal
    };
    
    const updatedSections = selectedProject.sections.map(s => 
      s.id === selectedSection.id ? updatedSection : s
    );
    
    const totalTargetWordCount = updatedSections.reduce(
      (sum, section) => sum + (section.targetWordCount || 0), 
      0
    );
    
    const updatedProject = {
      ...selectedProject,
      sections: updatedSections,
      targetWordCount: totalTargetWordCount
    };
    
    setSelectedSection(updatedSection);
    setSelectedProject(updatedProject);
    setProjects(projects.map(p => 
      p.id === selectedProject.id ? updatedProject : p
    ));
    
    setIsSettingWordCount(false);
    
    toast({
      title: "Word count goal set",
      description: `Target word count for "${selectedSection.title}" set to ${wordCountGoal}.`,
    });
  };

  const handleAddComment = () => {
    if (!newComment || !selectedSection || !selectedProject) return;
    
    const newCommentObj: Comment = {
      id: `c${Date.now()}`,
      user: 'You',
      text: newComment,
      timestamp: new Date(),
      resolved: false
    };
    
    const updatedSection = {
      ...selectedSection,
      comments: [...selectedSection.comments, newCommentObj]
    };
    
    const updatedSections = selectedProject.sections.map(s => 
      s.id === selectedSection.id ? updatedSection : s
    );
    
    const updatedProject = {
      ...selectedProject,
      sections: updatedSections,
      lastEdited: new Date()
    };
    
    setSelectedSection(updatedSection);
    setSelectedProject(updatedProject);
    setProjects(projects.map(p => 
      p.id === selectedProject.id ? updatedProject : p
    ));
    
    setNewComment('');
    setIsAddingComment(false);
    
    toast({
      title: "Comment added",
      description: `Your comment has been added to "${selectedSection.title}".`,
    });
  };

  const handleResolveComment = (commentId: string) => {
    if (!selectedSection || !selectedProject) return;
    
    const updatedComments = selectedSection.comments.map(c => 
      c.id === commentId ? { ...c, resolved: !c.resolved } : c
    );
    
    const updatedSection = {
      ...selectedSection,
      comments: updatedComments
    };
    
    const updatedSections = selectedProject.sections.map(s => 
      s.id === selectedSection.id ? updatedSection : s
    );
    
    const updatedProject = {
      ...selectedProject,
      sections: updatedSections
    };
    
    setSelectedSection(updatedSection);
    setSelectedProject(updatedProject);
    setProjects(projects.map(p => 
      p.id === selectedProject.id ? updatedProject : p
    ));
    
    toast({
      title: "Comment updated",
      description: `Comment has been ${updatedComments.find(c => c.id === commentId)?.resolved ? 'resolved' : 'reopened'}.`,
    });
  };

  const handleDeleteComment = (commentId: string) => {
    if (!selectedSection || !selectedProject) return;
    
    const updatedComments = selectedSection.comments.filter(c => c.id !== commentId);
    
    const updatedSection = {
      ...selectedSection,
      comments: updatedComments
    };
    
    const updatedSections = selectedProject.sections.map(s => 
      s.id === selectedSection.id ? updatedSection : s
    );
    
    const updatedProject = {
      ...selectedProject,
      sections: updatedSections
    };
    
    setSelectedSection(updatedSection);
    setSelectedProject(updatedProject);
    setProjects(projects.map(p => 
      p.id === selectedProject.id ? updatedProject : p
    ));
    
    toast({
      title: "Comment deleted",
      description: `Comment has been removed.`,
    });
  };

  const handleGenerateContent = () => {
    if (!aiWritingPrompt || !selectedSection) return;
    
    setIsGeneratingContent(true);
    
    // Simulate AI content generation
    setTimeout(() => {
      const generatedText = `Based on your prompt "${aiWritingPrompt}", here's a draft for the ${selectedSection.title} section:
      
${selectedSection.title === 'Abstract' ? 
`This paper explores the applications of machine learning in healthcare, with a focus on diagnostic tools, predictive analytics, and personalized treatment planning. We review recent advances in deep learning models for medical imaging analysis and electronic health record processing. Our findings indicate that machine learning algorithms can significantly improve diagnostic accuracy, reduce healthcare costs, and enhance patient outcomes when properly integrated into clinical workflows. However, challenges related to data privacy, model interpretability, and regulatory compliance must be addressed before widespread adoption can occur. We propose a framework for responsible implementation of AI in healthcare settings that balances innovation with ethical considerations and patient safety.` 
: 
selectedSection.title === 'Introduction' ?
`Healthcare systems worldwide are facing unprecedented challenges, including aging populations, rising costs, and workforce shortages. These pressures demand innovative solutions that can improve efficiency while maintaining or enhancing quality of care. Machine learning (ML) technologies have emerged as promising tools to address these challenges by enabling more accurate diagnoses, personalized treatment plans, and efficient resource allocation.

Recent advances in computational power, algorithm design, and data availability have accelerated the development and deployment of ML applications in clinical settings. Deep learning models can now analyze medical images with accuracy comparable to or exceeding that of human specialists in certain domains. Natural language processing algorithms can extract valuable insights from unstructured clinical notes and scientific literature. Predictive models can identify patients at risk of deterioration or readmission, allowing for timely interventions.

Despite these promising developments, the adoption of ML in healthcare faces significant barriers. Healthcare organizations must navigate complex regulatory requirements, address concerns about data privacy and security, and ensure that ML systems integrate seamlessly with existing clinical workflows. Perhaps most importantly, clinicians and patients must trust these systems, which requires transparency, interpretability, and rigorous validation.

This paper examines the current state of ML applications in healthcare, evaluates their impact on clinical practice, and identifies key challenges and opportunities for future development. We begin with a comprehensive review of recent literature on ML in healthcare, followed by case studies of successful implementations. We then analyze barriers to adoption and propose strategies to overcome them. Finally, we outline a research agenda for advancing the field of healthcare AI in ways that prioritize patient outcomes, equity, and ethical considerations.`
:
`[Generated content for ${selectedSection.title} would appear here based on your prompt: "${aiWritingPrompt}"]`}`;
      
      setGeneratedContent(generatedText);
      setIsGeneratingContent(false);
    }, 3000);
  };

  const handleApplyGeneratedContent = () => {
    if (!generatedContent || !selectedSection || !selectedProject) return;
    
    // Save current content to history
    if (selectedSection.content) {
      setContentHistory(prev => [
        { timestamp: new Date(), content: selectedSection.content },
        ...prev.slice(0, 9)
      ]);
    }
    
    const updatedSection = {
      ...selectedSection,
      content: generatedContent,
      wordCount: countWords(generatedContent),
      lastEdited: new Date(),
      status: 'in-progress'
    };
    
    const updatedSections = selectedProject.sections.map(s => 
      s.id === selectedSection.id ? updatedSection : s
    );
    
    const totalWordCount = updatedSections.reduce((sum, section) => sum + section.wordCount, 0);
    
    const updatedProject = {
      ...selectedProject,
      sections: updatedSections,
      wordCount: totalWordCount,
      lastEdited: new Date()
    };
    
    setSelectedSection(updatedSection);
    setSelectedProject(updatedProject);
    setProjects(projects.map(p => 
      p.id === selectedProject.id ? updatedProject : p
    ));
    
    setEditingContent(generatedContent);
    setGeneratedContent('');
    setAiWritingPrompt('');
    
    toast({
      title: "Content applied",
      description: `AI-generated content has been applied to "${selectedSection.title}".`,
    });
  };

  const handleRestoreVersion = (content: string) => {
    if (!selectedSection || !selectedProject) return;
    
    // Save current content to history before restoring
    setContentHistory(prev => [
      { timestamp: new Date(), content: selectedSection.content },
      ...prev.slice(0, 9)
    ]);
    
    const updatedSection = {
      ...selectedSection,
      content,
      wordCount: countWords(content),
      lastEdited: new Date()
    };
    
    const updatedSections = selectedProject.sections.map(s => 
      s.id === selectedSection.id ? updatedSection : s
    );
    
    const totalWordCount = updatedSections.reduce((sum, section) => sum + section.wordCount, 0);
    
    const updatedProject = {
      ...selectedProject,
      sections: updatedSections,
      wordCount: totalWordCount,
      lastEdited: new Date()
    };
    
    setSelectedSection(updatedSection);
    setSelectedProject(updatedProject);
    setProjects(projects.map(p => 
      p.id === selectedProject.id ? updatedProject : p
    ));
    
    setEditingContent(content);
    setIsShowingHistory(false);
    
    toast({
      title: "Version restored",
      description: `A previous version has been restored.`,
    });
  };

  const handleImproveText = () => {
    if (!selectedSection || !editingContent) return;
    
    setIsImproving(true);
    
    // Simulate AI improvement
    setTimeout(() => {
      let improvedText = editingContent;
      
      switch (improvementType) {
        case 'clarity':
          improvedText = `Healthcare systems worldwide are facing increasing pressure to improve patient outcomes while reducing costs. Machine learning (ML) technologies provide promising solutions by enabling more accurate diagnoses, personalized treatment plans, and efficient resource allocation. Recent advances in computing power and algorithm design have accelerated the development of ML applications in clinical settings.

Healthcare organizations face significant barriers when adopting ML, including concerns about data quality, model interpretability, and integration with existing clinical workflows. This paper examines ML applications in healthcare, their clinical impact, and future directions.`;
          break;
        case 'conciseness':
          improvedText = `Healthcare systems face mounting pressure to improve outcomes while cutting costs. Machine learning (ML) offers solutions through more accurate diagnoses, personalized treatments, and efficient resource allocation. Computing advances have accelerated ML development in clinical settings.

Barriers to ML adoption include data quality concerns, interpretability issues, and workflow integration challenges. This paper examines healthcare ML applications, their impact, and future directions.`;
          break;
        case 'academic':
          improvedText = `Healthcare systems globally are experiencing significant pressure to enhance clinical outcomes while simultaneously reducing operational expenditures. Machine learning (ML) methodologies present viable solutions to these challenges by facilitating enhanced diagnostic accuracy, treatment personalization, and resource optimization. Recent advancements in computational capabilities and algorithmic sophistication have expedited the implementation of ML applications within clinical environments.

Despite potential benefits, the integration of ML technologies in healthcare contexts encounters substantial impediments, including concerns regarding data integrity, model interpretability, and compatibility with established clinical protocols. This manuscript examines the current landscape of ML applications in healthcare settings, evaluates their clinical efficacy, and identifies emerging trends and future research directions.`;
          break;
        case 'engagement':
          improvedText = `Imagine a healthcare system that diagnoses diseases with unprecedented accuracy, personalizes treatments to each patient's unique biology, and allocates resources so efficiently that costs plummet while outcomes soar. This isn't science fiction—it's the promise of machine learning (ML) in healthcare. As computing power and algorithms have evolved dramatically, ML applications are transforming clinical practice in ways previously unimaginable.

Yet this revolution faces formidable challenges. How can we trust algorithms with life-or-death decisions? What happens when ML systems encounter messy, incomplete medical data? And how do we integrate these digital tools into the deeply human practice of medicine? This paper takes you on a journey through the exciting landscape of healthcare ML, revealing both its remarkable potential and the critical hurdles we must overcome.`;
          break;
      }
      
      setEditingContent(improvedText);
      setIsImproving(false);
      
      toast({
        title: "Text improved",
        description: `Content has been improved for ${improvementType}.`,
      });
    }, 2000);
  };

  const handleApplySuggestion = (suggestion: Suggestion) => {
    if (!editingContent) return;
    
    const before = editingContent.substring(0, suggestion.position.start);
    const after = editingContent.substring(suggestion.position.end);
    const newContent = before + suggestion.replacement + after;
    
    setEditingContent(newContent);
    
    // Remove the applied suggestion
    setSuggestions(suggestions.filter(s => s.id !== suggestion.id));
    
    toast({
      title: "Suggestion applied",
      description: `The ${suggestion.type} suggestion has been applied.`,
    });
  };

  const handleToggleFocusMode = () => {
    setFocusMode(!focusMode);
    
    if (!focusMode) {
      setShowSidebar(false);
    } else {
      setShowSidebar(true);
    }
  };

  const handleStartWordCountTimer = () => {
    setWordCountTimer({
      ...wordCountTimer,
      active: true
    });
    
    // In a real implementation, you would set up an interval to count down
    // For this demo, we'll just simulate it
    toast({
      title: "Timer started",
      description: `Write ${wordCountTimer.target} words in 25 minutes. Go!`,
    });
  };

  const countWords = (text: string): number => {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProgressColor = (percentage: number): string => {
    if (percentage < 25) return 'bg-red-500';
    if (percentage < 50) return 'bg-orange-500';
    if (percentage < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getSectionProgress = (section: WritingSection): number => {
    if (!section.targetWordCount || section.targetWordCount === 0) return 0;
    return Math.min(100, Math.round((section.wordCount / section.targetWordCount) * 100));
  };

  const getProjectProgress = (project: WritingProject): number => {
    if (project.targetWordCount === 0) return 0;
    return Math.min(100, Math.round((project.wordCount / project.targetWordCount) * 100));
  };

  const getSectionStatusColor = (status: WritingSection['status']): string => {
    switch (status) {
      case 'not-started': return 'bg-gray-500';
      case 'in-progress': return 'bg-blue-500';
      case 'review': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
    }
  };

  const filteredProjects = projects.filter(project => 
    searchQuery === '' || 
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={`container mx-auto p-4 ${isFullscreen ? 'h-screen fixed inset-0 z-50 bg-background' : ''}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Academic Writing Assistant</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsCreatingProject(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
          {selectedProject && (
            <Button variant="default" onClick={() => setIsAddingSection(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          )}
        </div>
      </div>
      
      {!selectedProject ? (
        <div>
          <div className="mb-4">
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-xl font-medium">No Projects Found</h3>
                <p className="text-muted-foreground mt-2">
                  Create a new project to get started with your academic writing.
                </p>
                <Button className="mt-4" onClick={() => setIsCreatingProject(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Project
                </Button>
              </div>
            ) : (
              filteredProjects.map(project => (
                <Card 
                  key={project.id} 
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => handleSelectProject(project)}
                >
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription>
                      {project.type.charAt(0).toUpperCase() + project.type.slice(1)} • Last edited {formatDate(project.lastEdited)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{project.wordCount} / {project.targetWordCount} words</span>
                        </div>
                        <Progress 
                          value={getProjectProgress(project)} 
                          className={getProgressColor(getProjectProgress(project))}
                        />
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Sections</h4>
                        <ul className="space-y-1">
                          {project.sections.slice(0, 3).map(section => (
                            <li key={section.id} className="flex items-center justify-between text-sm">
                              <div className="flex items-center">
                                <div className={`w-2 h-2 rounded-full ${getSectionStatusColor(section.status)} mr-2`}></div>
                                <span>{section.title}</span>
                              </div>
                              <span className="text-muted-foreground">{section.wordCount} words</span>
                            </li>
                          ))}
                          {project.sections.length > 3 && (
                            <li className="text-sm text-muted-foreground">
                              +{project.sections.length - 3} more sections
                            </li>
                          )}
                        </ul>
                      </div>
                      
                      {project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {project.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <div className="w-full flex justify-between items-center text-sm text-muted-foreground">
                      <div>Status: <span className="font-medium">{project.status.charAt(0).toUpperCase() + project.status.slice(1)}</span></div>
                      {project.dueDate && (
                        <div>Due: <span className="font-medium">{formatDate(project.dueDate)}</span></div>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="flex h-[calc(100vh-12rem)]">
          {/* Sidebar */}
          {showSidebar && (
            <div className="w-64 border-r pr-4 mr-4">
              <div className="mb-4">
                <Button variant="ghost" className="w-full justify-start" onClick={() => {
                  setSelectedProject(null);
                  setSelectedSection(null);
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2"><path d="m15 18-6-6 6-6"/></svg>
                  Back to Projects
                </Button>
              </div>
              
              <Tabs defaultValue="outline" onValueChange={(value) => setActiveSidebarTab(value as any)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="outline">Outline</TabsTrigger>
                  <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                  <TabsTrigger value="metrics">Metrics</TabsTrigger>
                </TabsList>
                
                <TabsContent value="outline" className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">{selectedProject.title}</h3>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Overall Progress</span>
                        <span>{selectedProject.wordCount} / {selectedProject.targetWordCount}</span>
                      </div>
                      <Progress 
                        value={getProjectProgress(selectedProject)} 
                        className={getProgressColor(getProjectProgress(selectedProject))}
                      />
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Sections</h3>
                      <ScrollArea className="h-[calc(100vh-25rem)]">
                        <ul className="space-y-2">
                          {selectedProject.sections.map(section => (
                            <li key={section.id}>
                              <Button
                                variant={selectedSection?.id === section.id ? "default" : "ghost"}
                                className="w-full justify-start"
                                onClick={() => handleSelectSection(section)}
                              >
                                <div className={`w-2 h-2 rounded-full ${getSectionStatusColor(section.status)} mr-2`}></div>
                                <div className="text-left">
                                  <div>{section.title}</div>
                                  <div className="text-xs text-muted-foreground flex justify-between w-full">
                                    <span>{section.wordCount} words</span>
                                    {section.targetWordCount && (
                                      <span>{Math.round((section.wordCount / section.targetWordCount) * 100)}%</span>
                                    )}
                                  </div>
                                </div>
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </ScrollArea>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="suggestions" className="mt-4">
                  {isAnalyzing ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="mt-4 text-center text-sm text-muted-foreground">
                        Analyzing your writing...
                      </p>
                    </div>
                  ) : selectedSection && selectedSection.content ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Writing Suggestions</h3>
                        <Badge variant="outline">{suggestions.length}</Badge>
                      </div>
                      
                      {suggestions.length === 0 ? (
                        <div className="text-center py-8">
                          <CheckCircle2 className="h-12 w-12 mx-auto text-green-500" />
                          <p className="mt-4 text-sm text-muted-foreground">
                            No suggestions found for this section.
                          </p>
                        </div>
                      ) : (
                        <ScrollArea className="h-[calc(100vh-25rem)]">
                          <div className="space-y-3">
                            {suggestions.map(suggestion => (
                              <Card key={suggestion.id} className="relative">
                                <CardHeader className="py-3">
                                  <div className="flex justify-between items-start">
                                    <Badge variant={
                                      suggestion.severity === 'high' ? 'destructive' :
                                      suggestion.severity === 'medium' ? 'default' : 'outline'
                                    }>
                                      {suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)}
                                    </Badge>
                                  </div>
                                </CardHeader>
                                <CardContent className="py-0">
                                  <div className="space-y-2">
                                    <div>
                                      <p className="text-sm line-through text-muted-foreground">
                                        {suggestion.text}
                                      </p>
                                      <p className="text-sm font-medium">
                                        {suggestion.replacement}
                                      </p>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      {suggestion.explanation}
                                    </p>
                                  </div>
                                </CardContent>
                                <CardFooter className="py-3">
                                  <Button 
                                    size="sm" 
                                    className="w-full"
                                    onClick={() => handleApplySuggestion(suggestion)}
                                  >
                                    Apply Suggestion
                                  </Button>
                                </CardFooter>
                              </Card>
                            ))}
                          </div>
                        </ScrollArea>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="mt-4 text-sm text-muted-foreground">
                        Select a section and add content to get writing suggestions.
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="metrics" className="mt-4">
                  {isAnalyzing ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="mt-4 text-center text-sm text-muted-foreground">
                        Analyzing your writing...
                      </p>
                    </div>
                  ) : selectedSection && selectedSection.content ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">Overall Quality</h3>
                        <div className="flex items-center gap-2">
                          <Progress value={metrics.overall} className={
                            metrics.overall >= 80 ? 'bg-green-500' :
                            metrics.overall >= 60 ? 'bg-yellow-500' :
                            'bg-red-500'
                          } />
                          <span className="font-medium">{metrics.overall}/100</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <h4 className="text-sm font-medium">Readability</h4>
                            <span className="text-sm">{metrics.readability.overall}/100</span>
                          </div>
                          <Progress value={metrics.readability.overall} className={
                            metrics.readability.overall >= 80 ? 'bg-green-500' :
                            metrics.readability.overall >= 60 ? 'bg-yellow-500' :
                            'bg-red-500'
                          } />
                          <div className="mt-1 text-xs text-muted-foreground">
                            Reading level: {
                              metrics.readability.overall >= 80 ? 'Advanced' :
                              metrics.readability.overall >= 60 ? 'Graduate' :
                              metrics.readability.overall >= 40 ? 'Undergraduate' :
                              'High School'
                            }
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <h4 className="text-sm font-medium">Style</h4>
                            <span className="text-sm">{metrics.style.overall}/100</span>
                          </div>
                          <Progress value={metrics.style.overall} className={
                            metrics.style.overall >= 80 ? 'bg-green-500' :
                            metrics.style.overall >= 60 ? 'bg-yellow-500' :
                            'bg-red-500'
                          } />
                          <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <div>Passive voice: {metrics.style.passiveVoice}%</div>
                            <div>Sentence variety: {metrics.style.sentenceVariety}/100</div>
                            <div>Word variety: {metrics.style.wordVariety}/100</div>
                            <div>Adverb usage: {metrics.style.adverbUsage}%</div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <h4 className="text-sm font-medium">Structure</h4>
                            <span className="text-sm">{metrics.structure.overall}/100</span>
                          </div>
                          <Progress value={metrics.structure.overall} className={
                            metrics.structure.overall >= 80 ? 'bg-green-500' :
                            metrics.structure.overall >= 60 ? 'bg-yellow-500' :
                            'bg-red-500'
                          } />
                          <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <div>Paragraph length: {metrics.structure.paragraphLength}/100</div>
                            <div>Sentence length: {metrics.structure.sentenceLength}/100</div>
                            <div>Transition words: {metrics.structure.transitionWords}/100</div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <h4 className="text-sm font-medium">Clarity</h4>
                            <span className="text-sm">{metrics.clarity.overall}/100</span>
                          </div>
                          <Progress value={metrics.clarity.overall} className={
                            metrics.clarity.overall >= 80 ? 'bg-green-500' :
                            metrics.clarity.overall >= 60 ? 'bg-yellow-500' :
                            'bg-red-500'
                          } />
                          <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <div>Jargon: {metrics.clarity.jargon}%</div>
                            <div>Complexity: {metrics.clarity.complexity}/100</div>
                            <div>Redundancy: {metrics.clarity.redundancy}%</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <h3 className="font-medium mb-2">Recommendations</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <Sparkles className="h-4 w-4 text-yellow-500 mt-0.5" />
                            <span>Consider simplifying some sentences to improve readability.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Sparkles className="h-4 w-4 text-yellow-500 mt-0.5" />
                            <span>Add more transition words to improve flow between paragraphs.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Sparkles className="h-4 w-4 text-yellow-500 mt-0.5" />
                            <span>Reduce passive voice usage for more direct and engaging writing.</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BarChart2 className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="mt-4 text-sm text-muted-foreground">
                        Select a section and add content to see writing metrics.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          {/* Main Content */}
          <div className={`flex-1 ${focusMode ? 'bg-black text-white' : ''}`}>
            {selectedSection ? (
              <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-bold">{selectedSection.title}</h2>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>{selectedSection.wordCount} words</span>
                      {selectedSection.targetWordCount && (
                        <>
                          <span className="mx-2">•</span>
                          <span>Target: {selectedSection.targetWordCount} words</span>
                          <span className="mx-2">•</span>
                          <span>{Math.round((selectedSection.wordCount / selectedSection.targetWordCount) * 100)}% complete</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setShowSidebar(!showSidebar)}
                          >
                            {showSidebar ? <PanelLeftClose className="h-4 w-4" /> : <PanelRightClose className="h-4 w-4" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {showSidebar ? 'Hide sidebar' : 'Show sidebar'}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={handleToggleFocusMode}
                          >
                            {focusMode ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {focusMode ? 'Exit focus mode' : 'Enter focus mode'}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setIsFullscreen(!isFullscreen)}
                          >
                            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setIsSettingWordCount(true)}>
                          <Tag className="h-4 w-4 mr-2" />
                          Set Word Count Goal
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setIsShowingHistory(true)}>
                          <History className="h-4 w-4 mr-2" />
                          View History
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setIsAddingComment(true)}>
                          <BookmarkPlus className="h-4 w-4 mr-2" />
                          Add Comment
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSaveContent}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8"
                      onClick={handleSaveContent}
                    >
                      <Save className="h-3.5 w-3.5 mr-1" />
                      Save
                    </Button>
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8">
                          <Wand2 className="h-3.5 w-3.5 mr-1" />
                          Improve
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-4">
                          <h4 className="font-medium">Improve Writing</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="clarity">Clarity</Label>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                disabled={isImproving}
                                onClick={() => {
                                  setImprovementType('clarity');
                                  handleImproveText();
                                }}
                              >
                                {isImproving && improvementType === 'clarity' ? (
                                  <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                                ) : (
                                  <Wand2 className="h-3.5 w-3.5 mr-1" />
                                )}
                                Apply
                              </Button>
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="conciseness">Conciseness</Label>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                disabled={isImproving}
                                onClick={() => {
                                  setImprovementType('conciseness');
                                  handleImproveText();
                                }}
                              >
                                {isImproving && improvementType === 'conciseness' ? (
                                  <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                                ) : (
                                  <Wand2 className="h-3.5 w-3.5 mr-1" />
                                )}
                                Apply
                              </Button>
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="academic">Academic Style</Label>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                disabled={isImproving}
                                onClick={() => {
                                  setImprovementType('academic');
                                  handleImproveText();
                                }}
                              >
                                {isImproving && improvementType === 'academic' ? (
                                  <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                                ) : (
                                  <Wand2 className="h-3.5 w-3.5 mr-1" />
                                )}
                                Apply
                              </Button>
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="engagement">Engagement</Label>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                disabled={isImproving}
                                onClick={() => {
                                  setImprovementType('engagement');
                                  handleImproveText();
                                }}
                              >
                                {isImproving && improvementType === 'engagement' ? (
                                  <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                                ) : (
                                  <Wand2 className="h-3.5 w-3.5 mr-1" />
                                )}
                                Apply
                              </Button>
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    
                    <Separator orientation="vertical" className="h-8" />
                    
                    <Button variant="ghost" size="sm" className="h-8">
                      <Bold className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8">
                      <Italic className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8">
                      <Underline className="h-3.5 w-3.5" />
                    </Button>
                    
                    <Separator orientation="vertical" className="h-8" />
                    
                    <Button variant="ghost" size="sm" className="h-8">
                      <AlignLeft className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8">
                      <AlignCenter className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8">
                      <AlignRight className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8">
                      <AlignJustify className="h-3.5 w-3.5" />
                    </Button>
                    
                    <Separator orientation="vertical" className="h-8" />
                    
                    <Button variant="ghost" size="sm" className="h-8">
                      <List className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8">
                      <ListOrdered className="h-3.5 w-3.5" />
                    </Button>
                    
                    <Separator orientation="vertical" className="h-8" />
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8">
                          <Zap className="h-3.5 w-3.5 mr-1" />
                          AI Write
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>AI Writing Assistant</DialogTitle>
                          <DialogDescription>
                            Generate content for your {selectedSection.title} section using AI
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="prompt">Writing Prompt</Label>
                            <Textarea
                              id="prompt"
                              placeholder={`e.g., Write a ${selectedSection.title.toLowerCase()} about machine learning applications in healthcare, focusing on diagnostic tools and treatment optimization.`}
                              value={aiWritingPrompt}
                              onChange={(e) => setAiWritingPrompt(e.target.value)}
                              rows={3}
                            />
                          </div>
                          
                          {isGeneratingContent ? (
                            <div className="flex flex-col items-center justify-center py-8">
                              <Loader2 className="h-8 w-8 animate-spin text-primary" />
                              <p className="mt-4 text-center text-sm text-muted-foreground">
                                Generating content based on your prompt...
                              </p>
                            </div>
                          ) : generatedContent ? (
                            <div className="space-y-2">
                              <Label>Generated Content</Label>
                              <div className="border rounded-md p-4 max-h-64 overflow-y-auto">
                                <p className="whitespace-pre-line">{generatedContent}</p>
                              </div>
                            </div>
                          ) : null}
                        </div>
                        <DialogFooter>
                          {generatedContent ? (
                            <>
                              <Button variant="outline" onClick={() => setGeneratedContent('')}>
                                Regenerate
                              </Button>
                              <Button onClick={handleApplyGeneratedContent}>
                                Apply Content
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button variant="outline" onClick={() => {
                                setAiWritingPrompt('');
                                setGeneratedContent('');
                              }}>
                                Cancel
                              </Button>
                              <Button 
                                onClick={handleGenerateContent} 
                                disabled={!aiWritingPrompt || isGeneratingContent}
                              >
                                {isGeneratingContent ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <Zap className="h-4 w-4 mr-2" />
                                )}
                                Generate
                              </Button>
                            </>
                          )}
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          Timer
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-4">
                          <h4 className="font-medium">Writing Timer</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label>Target Word Count</Label>
                              <span className="font-medium">{wordCountTimer.target} words</span>
                            </div>
                            <Slider
                              value={[wordCountTimer.target]}
                              min={100}
                              max={1000}
                              step={50}
                              onValueChange={(value) => setWordCountTimer({
                                ...wordCountTimer,
                                target: value[0]
                              })}
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label>Time Remaining</Label>
                              <span className="font-medium">
                                {Math.floor(wordCountTimer.timeLeft / 60)}:{(wordCountTimer.timeLeft % 60).toString().padStart(2, '0')}
                              </span>
                            </div>
                            <Progress value={wordCountTimer.active ? (wordCountTimer.timeLeft / (25 * 60)) * 100 : 100} />
                          </div>
                          <Button 
                            className="w-full" 
                            onClick={handleStartWordCountTimer}
                            disabled={wordCountTimer.active}
                          >
                            {wordCountTimer.active ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Clock className="h-4 w-4 mr-2" />
                            )}
                            {wordCountTimer.active ? 'Timer Running' : 'Start Timer'}
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col">
                  <Textarea
                    value={editingContent}
                    onChange={handleContentChange}
                    placeholder={`Start writing your ${selectedSection.title.toLowerCase()} here...`}
                    className={`flex-1 resize-none text-base leading-relaxed ${focusMode ? 'bg-black text-white border-gray-800' : ''}`}
                  />
                  
                  {selectedSection.comments.length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-medium mb-2">Comments</h3>
                      <div className="space-y-2">
                        {selectedSection.comments.map(comment => (
                          <div 
                            key={comment.id} 
                            className={`p-3 border rounded-md ${comment.resolved ? 'bg-muted/50' : ''}`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback>{comment.user.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-sm">{comment.user}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {formatDate(comment.timestamp)} at {formatTime(comment.timestamp)}
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => handleResolveComment(comment.id)}
                                >
                                  {comment.resolved ? (
                                    <Undo2 className="h-3.5 w-3.5" />
                                  ) : (
                                    <Check className="h-3.5 w-3.5" />
                                  )}
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="h-6 w-6 text-destructive"
                                  onClick={() => handleDeleteComment(comment.id)}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                            <p className={`mt-1 text-sm ${comment.resolved ? 'text-muted-foreground' : ''}`}>
                              {comment.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-xl font-medium">No Section Selected</h3>
                  <p className="text-muted-foreground mt-2 max-w-md">
                    Select a section from the outline to start writing.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Create Project Dialog */}
      {isCreatingProject && (
        <Dialog open={isCreatingProject} onOpenChange={setIsCreatingProject}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Create a new writing project to get started
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  placeholder="e.g., Machine Learning Applications in Healthcare"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Project Type</Label>
                <Select defaultValue="paper">
                  <SelectTrigger>
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paper">Research Paper</SelectItem>
                    <SelectItem value="thesis">Thesis</SelectItem>
                    <SelectItem value="dissertation">Dissertation</SelectItem>
                    <SelectItem value="report">Report</SelectItem>
                    <SelectItem value="proposal">Research Proposal</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreatingProject(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateProject} disabled={!newProjectTitle}>
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Add Section Dialog */}
      {isAddingSection && (
        <Dialog open={isAddingSection} onOpenChange={setIsAddingSection}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Section</DialogTitle>
              <DialogDescription>
                Add a new section to your project
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="sectionTitle">Section Title</Label>
                <Input
                  id="sectionTitle"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  placeholder="e.g., Literature Review"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetWordCount">Target Word Count (optional)</Label>
                <Input
                  id="targetWordCount"
                  type="number"
                  placeholder="e.g., 500"
                  defaultValue="500"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingSection(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSection} disabled={!newSectionTitle}>
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Set Word Count Goal Dialog */}
      {isSettingWordCount && selectedSection && (
        <Dialog open={isSettingWordCount} onOpenChange={setIsSettingWordCount}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Word Count Goal</DialogTitle>
              <DialogDescription>
                Set a target word count for "{selectedSection.title}"
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="wordCountGoal">Target Word Count</Label>
                <Input
                  id="wordCountGoal"
                  type="number"
                  value={wordCountGoal || selectedSection.targetWordCount || 0}
                  onChange={(e) => setWordCountGoal(parseInt(e.target.value) || 0)}
                  min="1"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                Current word count: {selectedSection.wordCount} words
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSettingWordCount(false)}>
                Cancel
              </Button>
              <Button onClick={handleSetWordCountGoal} disabled={wordCountGoal <= 0}>
                <Tag className="h-4 w-4 mr-2" />
                Set Goal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Add Comment Dialog */}
      {isAddingComment && selectedSection && (
        <Dialog open={isAddingComment} onOpenChange={setIsAddingComment}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Comment</DialogTitle>
              <DialogDescription>
                Add a comment to "{selectedSection.title}"
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="comment">Comment</Label>
                <Textarea
                  id="comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add your comment here..."
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingComment(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddComment} disabled={!newComment}>
                <BookmarkPlus className="h-4 w-4 mr-2" />
                Add Comment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Version History Dialog */}
      {isShowingHistory && selectedSection && (
        <Dialog open={isShowingHistory} onOpenChange={setIsShowingHistory}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Version History</DialogTitle>
              <DialogDescription>
                View and restore previous versions of "{selectedSection.title}"
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {contentHistory.length === 0 ? (
                <div className="text-center py-8">
                  <History className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    No previous versions found for this section.
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {contentHistory.map((version, index) => (
                      <Card key={index}>
                        <CardHeader className="py-3">
                          <div className="flex justify-between items-center">
                            <div className="text-sm">
                              <div className="font-medium">Version {contentHistory.length - index}</div>
                              <div className="text-muted-foreground">
                                {formatDate(version.timestamp)} at {formatTime(version.timestamp)}
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleRestoreVersion(version.content)}
                            >
                              <History className="h-4 w-4 mr-2" />
                              Restore
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="py-0">
                          <div className="border rounded-md p-3 max-h-32 overflow-y-auto">
                            <p className="text-sm whitespace-pre-line">
                              {version.content.substring(0, 200)}
                              {version.content.length > 200 && '...'}
                            </p>
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">
                            {countWords(version.content)} words
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => setIsShowingHistory(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AcademicWritingAssistant;