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
  X
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

interface Reference {
  id: string;
  title: string;
  authors: string[];
  year: number;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  url?: string;
  abstract?: string;
  keywords: string[];
  notes?: string;
  tags: string[];
  folder: string;
  dateAdded: Date;
  lastModified: Date;
  citationCount?: number;
  fullTextAvailable: boolean;
}

interface Folder {
  id: string;
  name: string;
  color: string;
  count: number;
}

const mockReferences: Reference[] = [
  {
    id: '1',
    title: 'Attention Is All You Need',
    authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit', 'Llion Jones', 'Aidan N. Gomez', 'Łukasz Kaiser', 'Illia Polosukhin'],
    year: 2017,
    journal: 'Advances in Neural Information Processing Systems',
    volume: '30',
    pages: '5998-6008',
    doi: '10.48550/arXiv.1706.03762',
    url: 'https://arxiv.org/abs/1706.03762',
    abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely...',
    keywords: ['Transformer', 'Attention Mechanism', 'NLP', 'Neural Networks'],
    notes: 'Groundbreaking paper that introduced the Transformer architecture, which has become the foundation for many modern NLP models.',
    tags: ['NLP', 'Deep Learning', 'Important'],
    folder: 'Machine Learning',
    dateAdded: new Date('2023-01-15'),
    lastModified: new Date('2023-03-20'),
    citationCount: 52419,
    fullTextAvailable: true
  },
  {
    id: '2',
    title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
    authors: ['Jacob Devlin', 'Ming-Wei Chang', 'Kenton Lee', 'Kristina Toutanova'],
    year: 2019,
    journal: 'Proceedings of NAACL-HLT',
    pages: '4171-4186',
    doi: '10.48550/arXiv.1810.04805',
    url: 'https://arxiv.org/abs/1810.04805',
    abstract: 'We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers...',
    keywords: ['BERT', 'Transformers', 'NLP', 'Pre-training'],
    notes: 'Introduced BERT, which significantly advanced the state of the art in NLP tasks.',
    tags: ['NLP', 'Deep Learning', 'To Read'],
    folder: 'Machine Learning',
    dateAdded: new Date('2023-02-10'),
    lastModified: new Date('2023-02-10'),
    citationCount: 36782,
    fullTextAvailable: true
  },
  {
    id: '3',
    title: 'Deep Residual Learning for Image Recognition',
    authors: ['Kaiming He', 'Xiangyu Zhang', 'Shaoqing Ren', 'Jian Sun'],
    year: 2016,
    journal: 'IEEE Conference on Computer Vision and Pattern Recognition',
    pages: '770-778',
    doi: '10.1109/CVPR.2016.90',
    url: 'https://arxiv.org/abs/1512.03385',
    abstract: 'Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks that are substantially deeper than those used previously. We explicitly reformulate the layers as learning residual functions with reference to the layer inputs, instead of learning unreferenced functions...',
    keywords: ['ResNet', 'Deep Learning', 'Computer Vision', 'Image Recognition'],
    notes: 'Introduced ResNet architecture which solved the vanishing gradient problem in very deep networks.',
    tags: ['Computer Vision', 'Deep Learning', 'Important'],
    folder: 'Computer Vision',
    dateAdded: new Date('2023-01-05'),
    lastModified: new Date('2023-04-12'),
    citationCount: 93451,
    fullTextAvailable: true
  },
  {
    id: '4',
    title: 'Generative Adversarial Networks',
    authors: ['Ian J. Goodfellow', 'Jean Pouget-Abadie', 'Mehdi Mirza', 'Bing Xu', 'David Warde-Farley', 'Sherjil Ozair', 'Aaron Courville', 'Yoshua Bengio'],
    year: 2014,
    journal: 'Advances in Neural Information Processing Systems',
    volume: '27',
    doi: '10.48550/arXiv.1406.2661',
    url: 'https://arxiv.org/abs/1406.2661',
    abstract: 'We propose a new framework for estimating generative models via an adversarial process, in which we simultaneously train two models: a generative model G that captures the data distribution, and a discriminative model D that estimates the probability that a sample came from the training data rather than G...',
    keywords: ['GAN', 'Generative Models', 'Deep Learning'],
    notes: 'Introduced the GAN framework which has revolutionized generative modeling.',
    tags: ['Deep Learning', 'Generative Models', 'To Read'],
    folder: 'Machine Learning',
    dateAdded: new Date('2023-03-20'),
    lastModified: new Date('2023-03-20'),
    citationCount: 41285,
    fullTextAvailable: false
  },
  {
    id: '5',
    title: 'Federated Learning: Strategies for Improving Communication Efficiency',
    authors: ['Jakub Konečný', 'H. Brendan McMahan', 'Felix X. Yu', 'Peter Richtárik', 'Ananda Theertha Suresh', 'Dave Bacon'],
    year: 2016,
    journal: 'arXiv preprint',
    doi: '10.48550/arXiv.1610.05492',
    url: 'https://arxiv.org/abs/1610.05492',
    abstract: 'Federated Learning is a machine learning setting where the goal is to train a high-quality centralized model with training data distributed over a large number of clients each with unreliable and relatively slow network connections. We consider learning algorithms for this setting where on each round, each client independently computes an update to the current model based on its local data, and communicates this update to a central server...',
    keywords: ['Federated Learning', 'Distributed Computing', 'Privacy'],
    notes: 'Important paper on federated learning techniques for privacy-preserving distributed training.',
    tags: ['Privacy', 'Distributed Computing', 'To Read'],
    folder: 'Privacy & Security',
    dateAdded: new Date('2023-04-05'),
    lastModified: new Date('2023-04-05'),
    citationCount: 2187,
    fullTextAvailable: true
  }
];

const mockFolders: Folder[] = [
  {
    id: '1',
    name: 'Machine Learning',
    color: 'bg-blue-500',
    count: 3
  },
  {
    id: '2',
    name: 'Computer Vision',
    color: 'bg-green-500',
    count: 1
  },
  {
    id: '3',
    name: 'Privacy & Security',
    color: 'bg-purple-500',
    count: 1
  },
  {
    id: '4',
    name: 'Unorganized',
    color: 'bg-gray-500',
    count: 0
  }
];

const mockTags = [
  { id: '1', name: 'Deep Learning', count: 4 },
  { id: '2', name: 'NLP', count: 2 },
  { id: '3', name: 'Computer Vision', count: 1 },
  { id: '4', name: 'Important', count: 2 },
  { id: '5', name: 'To Read', count: 3 },
  { id: '6', name: 'Privacy', count: 1 },
  { id: '7', name: 'Distributed Computing', count: 1 },
  { id: '8', name: 'Generative Models', count: 1 }
];

const SmartReferenceManager: React.FC = () => {
  const [references, setReferences] = useState<Reference[]>(mockReferences);
  const [folders, setFolders] = useState<Folder[]>(mockFolders);
  const [tags, setTags] = useState(mockTags);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedReference, setSelectedReference] = useState<Reference | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedReference, setEditedReference] = useState<Partial<Reference>>({});
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importText, setImportText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'author' | 'year' | 'citations'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter references based on search query, selected folder, and selected tags
  const filteredReferences = references.filter(ref => {
    const matchesSearch = 
      searchQuery === '' || 
      ref.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ref.abstract && ref.abstract.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ref.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ref.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFolder = selectedFolder === null || ref.folder === selectedFolder;
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => ref.tags.includes(tag));
    
    return matchesSearch && matchesFolder && matchesTags;
  });

  // Sort references
  const sortedReferences = [...filteredReferences].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = a.dateAdded.getTime() - b.dateAdded.getTime();
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'author':
        comparison = a.authors[0].localeCompare(b.authors[0]);
        break;
      case 'year':
        comparison = a.year - b.year;
        break;
      case 'citations':
        comparison = (a.citationCount || 0) - (b.citationCount || 0);
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleSelectFolder = (folderId: string | null) => {
    setSelectedFolder(folderId);
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const handleSelectReference = (ref: Reference) => {
    setSelectedReference(ref);
    setIsEditing(false);
  };

  const handleEditReference = () => {
    if (!selectedReference) return;
    setEditedReference({ ...selectedReference });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!selectedReference || !editedReference) return;
    
    const updatedReference = {
      ...selectedReference,
      ...editedReference,
      lastModified: new Date()
    };
    
    setReferences(refs => 
      refs.map(ref => ref.id === selectedReference.id ? updatedReference : ref)
    );
    
    setSelectedReference(updatedReference);
    setIsEditing(false);
    
    toast({
      title: "Reference updated",
      description: "The reference has been successfully updated.",
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedReference({});
  };

  const handleCreateFolder = () => {
    if (!newFolderName) return;
    
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newFolder: Folder = {
      id: (folders.length + 1).toString(),
      name: newFolderName,
      color: randomColor,
      count: 0
    };
    
    setFolders([...folders, newFolder]);
    setNewFolderName('');
    setIsCreatingFolder(false);
    
    toast({
      title: "Folder created",
      description: `New folder "${newFolderName}" has been created.`,
    });
  };

  const handleAddTag = () => {
    if (!newTagName) return;
    
    const newTag = {
      id: (tags.length + 1).toString(),
      name: newTagName,
      count: 0
    };
    
    setTags([...tags, newTag]);
    setNewTagName('');
    setIsAddingTag(false);
    
    toast({
      title: "Tag created",
      description: `New tag "${newTagName}" has been created.`,
    });
  };

  const handleMoveToFolder = (refId: string, folderId: string) => {
    const folderName = folders.find(f => f.id === folderId)?.name || '';
    
    setReferences(refs => 
      refs.map(ref => ref.id === refId ? { ...ref, folder: folderName, lastModified: new Date() } : ref)
    );
    
    if (selectedReference && selectedReference.id === refId) {
      setSelectedReference(prev => prev ? { ...prev, folder: folderName, lastModified: new Date() } : null);
    }
    
    // Update folder counts
    const updatedFolders = [...folders];
    const oldFolder = references.find(r => r.id === refId)?.folder;
    
    updatedFolders.forEach(folder => {
      if (folder.name === oldFolder) folder.count--;
      if (folder.name === folderName) folder.count++;
    });
    
    setFolders(updatedFolders);
    
    toast({
      title: "Reference moved",
      description: `Reference moved to "${folderName}" folder.`,
    });
  };

  const handleAddTagToReference = (refId: string, tagName: string) => {
    setReferences(refs => 
      refs.map(ref => {
        if (ref.id === refId && !ref.tags.includes(tagName)) {
          return { 
            ...ref, 
            tags: [...ref.tags, tagName],
            lastModified: new Date()
          };
        }
        return ref;
      })
    );
    
    if (selectedReference && selectedReference.id === refId && !selectedReference.tags.includes(tagName)) {
      setSelectedReference({
        ...selectedReference,
        tags: [...selectedReference.tags, tagName],
        lastModified: new Date()
      });
    }
    
    // Update tag count
    setTags(tags => 
      tags.map(tag => 
        tag.name === tagName ? { ...tag, count: tag.count + 1 } : tag
      )
    );
    
    toast({
      title: "Tag added",
      description: `Tag "${tagName}" added to reference.`,
    });
  };

  const handleRemoveTagFromReference = (refId: string, tagName: string) => {
    setReferences(refs => 
      refs.map(ref => {
        if (ref.id === refId) {
          return { 
            ...ref, 
            tags: ref.tags.filter(t => t !== tagName),
            lastModified: new Date()
          };
        }
        return ref;
      })
    );
    
    if (selectedReference && selectedReference.id === refId) {
      setSelectedReference({
        ...selectedReference,
        tags: selectedReference.tags.filter(t => t !== tagName),
        lastModified: new Date()
      });
    }
    
    // Update tag count
    setTags(tags => 
      tags.map(tag => 
        tag.name === tagName ? { ...tag, count: Math.max(0, tag.count - 1) } : tag
      )
    );
    
    toast({
      title: "Tag removed",
      description: `Tag "${tagName}" removed from reference.`,
    });
  };

  const handleDeleteReference = (refId: string) => {
    const refToDelete = references.find(r => r.id === refId);
    if (!refToDelete) return;
    
    // Update folder counts
    const updatedFolders = [...folders];
    updatedFolders.forEach(folder => {
      if (folder.name === refToDelete.folder) folder.count--;
    });
    
    // Update tag counts
    const updatedTags = [...tags];
    refToDelete.tags.forEach(tagName => {
      const tagIndex = updatedTags.findIndex(t => t.name === tagName);
      if (tagIndex !== -1) {
        updatedTags[tagIndex] = {
          ...updatedTags[tagIndex],
          count: Math.max(0, updatedTags[tagIndex].count - 1)
        };
      }
    });
    
    setReferences(refs => refs.filter(ref => ref.id !== refId));
    setFolders(updatedFolders);
    setTags(updatedTags);
    
    if (selectedReference && selectedReference.id === refId) {
      setSelectedReference(null);
    }
    
    toast({
      title: "Reference deleted",
      description: "The reference has been deleted.",
    });
  };

  const handleImportReferences = async () => {
    if (!importText) return;
    
    setIsLoading(true);
    try {
      // In a real implementation, this would parse the BibTeX/RIS/etc.
      // For demo purposes, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate adding a new reference
      const newRef: Reference = {
        id: (references.length + 1).toString(),
        title: 'Imported Reference: Large Language Models for Scientific Discovery',
        authors: ['John Smith', 'Jane Doe'],
        year: 2023,
        journal: 'Nature Machine Intelligence',
        volume: '5',
        issue: '2',
        pages: '123-135',
        doi: '10.1038/s42256-023-00001-x',
        abstract: 'This paper explores the application of large language models to scientific discovery processes...',
        keywords: ['LLM', 'Scientific Discovery', 'AI'],
        notes: '',
        tags: ['Deep Learning', 'To Read'],
        folder: 'Unorganized',
        dateAdded: new Date(),
        lastModified: new Date(),
        fullTextAvailable: false
      };
      
      setReferences([...references, newRef]);
      
      // Update folder counts
      setFolders(folders => 
        folders.map(folder => 
          folder.name === 'Unorganized' ? { ...folder, count: folder.count + 1 } : folder
        )
      );
      
      // Update tag counts
      setTags(tags => 
        tags.map(tag => 
          newRef.tags.includes(tag.name) ? { ...tag, count: tag.count + 1 } : tag
        )
      );
      
      setImportText('');
      setIsImporting(false);
      
      toast({
        title: "References imported",
        description: "1 reference has been successfully imported.",
      });
    } catch (error) {
      toast({
        title: "Import failed",
        description: "Failed to import references. Please check the format and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedReference(prev => ({ ...prev, [name]: value }));
  };

  const handleAuthorsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const authors = e.target.value.split('\n').filter(a => a.trim() !== '');
    setEditedReference(prev => ({ ...prev, authors }));
  };

  const handleKeywordsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const keywords = e.target.value.split(',').map(k => k.trim()).filter(k => k !== '');
    setEditedReference(prev => ({ ...prev, keywords }));
  };

  const formatAuthors = (authors: string[]) => {
    if (authors.length === 0) return '';
    if (authors.length === 1) return authors[0];
    if (authors.length === 2) return `${authors[0]} and ${authors[1]}`;
    return `${authors[0]}, ${authors[1]}, et al.`;
  };

  const toggleSort = (field: 'date' | 'title' | 'author' | 'year' | 'citations') => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const exportReferences = (format: 'bibtex' | 'ris' | 'csv') => {
    let content = '';
    const selectedRefs = selectedReference ? [selectedReference] : sortedReferences;
    
    if (format === 'bibtex') {
      content = selectedRefs.map(ref => {
        const authors = ref.authors.join(' and ');
        return `@article{${ref.authors[0].split(' ').pop()}${ref.year},
  title = {${ref.title}},
  author = {${authors}},
  journal = {${ref.journal || ''}},
  year = {${ref.year}},
  volume = {${ref.volume || ''}},
  number = {${ref.issue || ''}},
  pages = {${ref.pages || ''}},
  doi = {${ref.doi || ''}}
}`;
      }).join('\n\n');
    } else if (format === 'ris') {
      content = selectedRefs.map(ref => {
        const authors = ref.authors.map(author => `AU  - ${author}`).join('\n');
        return `TY  - JOUR
${authors}
TI  - ${ref.title}
JO  - ${ref.journal || ''}
PY  - ${ref.year}
VL  - ${ref.volume || ''}
IS  - ${ref.issue || ''}
SP  - ${ref.pages?.split('-')[0] || ''}
EP  - ${ref.pages?.split('-')[1] || ''}
DO  - ${ref.doi || ''}
ER  - `;
      }).join('\n\n');
    } else if (format === 'csv') {
      content = 'Title,Authors,Year,Journal,Volume,Issue,Pages,DOI\n';
      content += selectedRefs.map(ref => {
        return `"${ref.title}","${ref.authors.join('; ')}",${ref.year},"${ref.journal || ''}","${ref.volume || ''}","${ref.issue || ''}","${ref.pages || ''}","${ref.doi || ''}"`;
      }).join('\n');
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `references.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "References exported",
      description: `${selectedReference ? '1 reference' : `${sortedReferences.length} references`} exported as ${format.toUpperCase()}.`,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Smart Reference Manager</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsImporting(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Export Format</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => exportReferences('bibtex')}>
                BibTeX
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportReferences('ris')}>
                RIS
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportReferences('csv')}>
                CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar: Folders and Tags */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Organize</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Folders */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Folders</h3>
                    <Button variant="ghost" size="icon" onClick={() => setIsCreatingFolder(true)}>
                      <FolderPlus className="h-4 w-4" />
                    </Button>
                  </div>
                  <ul className="space-y-1">
                    <li>
                      <Button
                        variant={selectedFolder === null ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => handleSelectFolder(null)}
                      >
                        <Folder className="h-4 w-4 mr-2" />
                        All References
                        <Badge className="ml-auto">{references.length}</Badge>
                      </Button>
                    </li>
                    {folders.map(folder => (
                      <li key={folder.id}>
                        <Button
                          variant={selectedFolder === folder.name ? "default" : "ghost"}
                          className="w-full justify-start"
                          onClick={() => handleSelectFolder(folder.name)}
                        >
                          <div className={`w-3 h-3 rounded-full ${folder.color} mr-2`}></div>
                          {folder.name}
                          <Badge className="ml-auto">{folder.count}</Badge>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Tags */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Tags</h3>
                    <Button variant="ghost" size="icon" onClick={() => setIsAddingTag(true)}>
                      <Tag className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <Badge
                        key={tag.id}
                        variant={selectedTags.includes(tag.name) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleToggleTag(tag.name)}
                      >
                        {tag.name} ({tag.count})
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Reference List */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>References</CardTitle>
              <div className="mt-2">
                <Input
                  placeholder="Search references..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-muted-foreground">
                  {sortedReferences.length} references
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Sort
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => toggleSort('date')}>
                      Date Added {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleSort('title')}>
                      Title {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleSort('author')}>
                      First Author {sortBy === 'author' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleSort('year')}>
                      Year {sortBy === 'year' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleSort('citations')}>
                      Citations {sortBy === 'citations' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-3">
                  {sortedReferences.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No references found matching your criteria.</p>
                    </div>
                  ) : (
                    sortedReferences.map(ref => (
                      <div 
                        key={ref.id} 
                        className={`p-3 rounded-md border cursor-pointer ${selectedReference?.id === ref.id ? 'border-primary bg-primary/5' : ''}`}
                        onClick={() => handleSelectReference(ref)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{ref.title}</h3>
                            <p className="text-sm text-muted-foreground">{formatAuthors(ref.authors)}, {ref.year}</p>
                            <p className="text-xs">{ref.journal}</p>
                            
                            <div className="mt-2 flex flex-wrap gap-1">
                              {ref.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                              <Button variant="ghost" size="icon">
                                <Filter className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handleSelectReference(ref);
                                handleEditReference();
                              }}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>Move to Folder</DropdownMenuLabel>
                              {folders.map(folder => (
                                <DropdownMenuItem 
                                  key={folder.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMoveToFolder(ref.id, folder.id);
                                  }}
                                >
                                  <div className={`w-3 h-3 rounded-full ${folder.color} mr-2`}></div>
                                  {folder.name}
                                </DropdownMenuItem>
                              ))}
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>Add Tag</DropdownMenuLabel>
                              {tags
                                .filter(tag => !ref.tags.includes(tag.name))
                                .map(tag => (
                                  <DropdownMenuItem 
                                    key={tag.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAddTagToReference(ref.id, tag.name);
                                    }}
                                  >
                                    <Tag className="h-4 w-4 mr-2" />
                                    {tag.name}
                                  </DropdownMenuItem>
                                ))
                              }
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteReference(ref.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        
        {/* Reference Details */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            {selectedReference ? (
              <>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{selectedReference.title}</CardTitle>
                      <CardDescription>
                        {selectedReference.authors.join(', ')} ({selectedReference.year})
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {!isEditing ? (
                        <>
                          <Button variant="outline" onClick={handleEditReference}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button>
                                <Download className="h-4 w-4 mr-2" />
                                Export
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => exportReferences('bibtex')}>
                                BibTeX
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => exportReferences('ris')}>
                                RIS
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => exportReferences('csv')}>
                                CSV
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </>
                      ) : (
                        <>
                          <Button variant="outline" onClick={handleCancelEdit}>
                            Cancel
                          </Button>
                          <Button onClick={handleSaveEdit}>
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px] pr-4">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Title</label>
                          <Input
                            name="title"
                            value={editedReference.title || selectedReference.title}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Authors (one per line)</label>
                          <Textarea
                            value={editedReference.authors?.join('\n') || selectedReference.authors.join('\n')}
                            onChange={handleAuthorsChange}
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Year</label>
                            <Input
                              name="year"
                              type="number"
                              value={editedReference.year || selectedReference.year}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Journal/Publication</label>
                            <Input
                              name="journal"
                              value={editedReference.journal || selectedReference.journal || ''}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Volume</label>
                            <Input
                              name="volume"
                              value={editedReference.volume || selectedReference.volume || ''}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Issue</label>
                            <Input
                              name="issue"
                              value={editedReference.issue || selectedReference.issue || ''}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Pages</label>
                            <Input
                              name="pages"
                              value={editedReference.pages || selectedReference.pages || ''}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">DOI</label>
                          <Input
                            name="doi"
                            value={editedReference.doi || selectedReference.doi || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">URL</label>
                          <Input
                            name="url"
                            value={editedReference.url || selectedReference.url || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Abstract</label>
                          <Textarea
                            name="abstract"
                            value={editedReference.abstract || selectedReference.abstract || ''}
                            onChange={handleInputChange}
                            rows={5}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Keywords (comma separated)</label>
                          <Textarea
                            value={editedReference.keywords?.join(', ') || selectedReference.keywords.join(', ')}
                            onChange={handleKeywordsChange}
                            rows={2}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Notes</label>
                          <Textarea
                            name="notes"
                            value={editedReference.notes || selectedReference.notes || ''}
                            onChange={handleInputChange}
                            rows={5}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <Tabs defaultValue="details">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="abstract">Abstract</TabsTrigger>
                            <TabsTrigger value="notes">Notes</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="details" className="space-y-4 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Journal</h3>
                                <p>{selectedReference.journal || 'N/A'}</p>
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Year</h3>
                                <p>{selectedReference.year}</p>
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Volume</h3>
                                <p>{selectedReference.volume || 'N/A'}</p>
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Issue</h3>
                                <p>{selectedReference.issue || 'N/A'}</p>
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Pages</h3>
                                <p>{selectedReference.pages || 'N/A'}</p>
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Citations</h3>
                                <p>{selectedReference.citationCount?.toLocaleString() || 'N/A'}</p>
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">DOI</h3>
                              {selectedReference.doi ? (
                                <div className="flex items-center gap-2">
                                  <p className="text-primary">{selectedReference.doi}</p>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => window.open(`https://doi.org/${selectedReference.doi}`, '_blank')}
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <p>N/A</p>
                              )}
                            </div>
                            
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">URL</h3>
                              {selectedReference.url ? (
                                <div className="flex items-center gap-2">
                                  <p className="text-primary truncate">{selectedReference.url}</p>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => window.open(selectedReference.url, '_blank')}
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <p>N/A</p>
                              )}
                            </div>
                            
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">Keywords</h3>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {selectedReference.keywords.map((keyword, index) => (
                                  <Badge key={index} variant="secondary">
                                    {keyword}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">Tags</h3>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {selectedReference.tags.map((tag, index) => (
                                  <Badge 
                                    key={index} 
                                    variant="outline"
                                    className="flex items-center gap-1"
                                  >
                                    {tag}
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-4 w-4 p-0 ml-1"
                                      onClick={() => handleRemoveTagFromReference(selectedReference.id, tag)}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </Badge>
                                ))}
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="h-6"
                                  onClick={() => setIsAddingTag(true)}
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Add
                                </Button>
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">Folder</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <div className={`w-3 h-3 rounded-full ${folders.find(f => f.name === selectedReference.folder)?.color || 'bg-gray-500'}`}></div>
                                <p>{selectedReference.folder}</p>
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">Full Text</h3>
                              <div className="flex items-center gap-2 mt-1">
                                {selectedReference.fullTextAvailable ? (
                                  <>
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    <p>Available</p>
                                    <Button variant="outline" size="sm" className="ml-2">
                                      <FileText className="h-4 w-4 mr-2" />
                                      Open PDF
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle className="h-4 w-4 text-amber-500" />
                                    <p>Not Available</p>
                                    <Button variant="outline" size="sm" className="ml-2">
                                      <Upload className="h-4 w-4 mr-2" />
                                      Upload PDF
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                            
                            <div className="pt-2 border-t">
                              <div className="flex justify-between text-sm text-muted-foreground">
                                <p>Added: {selectedReference.dateAdded.toLocaleDateString()}</p>
                                <p>Modified: {selectedReference.lastModified.toLocaleDateString()}</p>
                              </div>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="abstract" className="mt-4">
                            {selectedReference.abstract ? (
                              <div className="relative">
                                <p className="whitespace-pre-line">{selectedReference.abstract}</p>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="absolute top-0 right-0"
                                  onClick={() => {
                                    navigator.clipboard.writeText(selectedReference.abstract || '');
                                    toast({
                                      title: "Copied",
                                      description: "Abstract copied to clipboard",
                                    });
                                  }}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <p className="text-muted-foreground">No abstract available.</p>
                            )}
                          </TabsContent>
                          
                          <TabsContent value="notes" className="mt-4">
                            {selectedReference.notes ? (
                              <div className="relative">
                                <p className="whitespace-pre-line">{selectedReference.notes}</p>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="absolute top-0 right-0"
                                  onClick={() => {
                                    navigator.clipboard.writeText(selectedReference.notes || '');
                                    toast({
                                      title: "Copied",
                                      description: "Notes copied to clipboard",
                                    });
                                  }}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="text-center py-8">
                                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
                                <p className="mt-4 text-muted-foreground">No notes yet. Click edit to add notes.</p>
                              </div>
                            )}
                          </TabsContent>
                        </Tabs>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </>
            ) : (
              <div className="flex items-center justify-center h-full py-12">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-xl font-medium">No Reference Selected</h3>
                  <p className="text-muted-foreground mt-2 max-w-md">
                    Select a reference from the list to view its details.
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
      
      {/* Create Folder Dialog */}
      {isCreatingFolder && (
        <Dialog open={isCreatingFolder} onOpenChange={setIsCreatingFolder}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
              <DialogDescription>
                Create a folder to organize your references
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Folder Name</label>
                <Input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="e.g., Machine Learning"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreatingFolder(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateFolder} disabled={!newFolderName}>
                <FolderPlus className="h-4 w-4 mr-2" />
                Create Folder
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Add Tag Dialog */}
      {isAddingTag && (
        <Dialog open={isAddingTag} onOpenChange={setIsAddingTag}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Tag</DialogTitle>
              <DialogDescription>
                Create a tag to categorize your references
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tag Name</label>
                <Input
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="e.g., To Read"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingTag(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTag} disabled={!newTagName}>
                <Tag className="h-4 w-4 mr-2" />
                Create Tag
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Import References Dialog */}
      {isImporting && (
        <Dialog open={isImporting} onOpenChange={setIsImporting}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Import References</DialogTitle>
              <DialogDescription>
                Import references from BibTeX, RIS, or other formats
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Tabs defaultValue="bibtex">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="bibtex">BibTeX</TabsTrigger>
                  <TabsTrigger value="ris">RIS</TabsTrigger>
                  <TabsTrigger value="doi">DOI List</TabsTrigger>
                </TabsList>
                
                <TabsContent value="bibtex" className="mt-4">
                  <Textarea
                    placeholder="Paste BibTeX entries here..."
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    rows={10}
                    className="font-mono text-sm"
                  />
                </TabsContent>
                
                <TabsContent value="ris" className="mt-4">
                  <Textarea
                    placeholder="Paste RIS entries here..."
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    rows={10}
                    className="font-mono text-sm"
                  />
                </TabsContent>
                
                <TabsContent value="doi" className="mt-4">
                  <Textarea
                    placeholder="Paste DOIs (one per line)..."
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    rows={10}
                    className="font-mono text-sm"
                  />
                </TabsContent>
              </Tabs>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsImporting(false)}>
                Cancel
              </Button>
              <Button onClick={handleImportReferences} disabled={!importText || isLoading}>
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Import References
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SmartReferenceManager;