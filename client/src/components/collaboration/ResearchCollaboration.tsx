import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { 
  Users, 
  MessageSquare, 
  FileText, 
  Calendar, 
  Clock, 
  Plus, 
  Send, 
  Share2, 
  UserPlus, 
  Lock, 
  Unlock, 
  MoreHorizontal,
  RefreshCw
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'editor' | 'viewer';
  online: boolean;
}

interface Comment {
  id: string;
  user: Collaborator;
  text: string;
  timestamp: Date;
}

interface Project {
  id: string;
  title: string;
  description: string;
  lastEdited: Date;
  collaborators: Collaborator[];
}

const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Machine Learning in Healthcare',
    description: 'Research on applications of ML in diagnostic procedures',
    lastEdited: new Date(Date.now() - 3600000), // 1 hour ago
    collaborators: [
      {
        id: '1',
        name: 'Sarah Chen',
        email: 'sarah.chen@example.com',
        role: 'owner',
        online: true
      },
      {
        id: '2',
        name: 'David Kim',
        email: 'david.kim@example.com',
        role: 'editor',
        online: false
      }
    ]
  },
  {
    id: '2',
    title: 'Climate Change Effects on Marine Life',
    description: 'Analysis of temperature changes on coral reef ecosystems',
    lastEdited: new Date(Date.now() - 86400000), // 1 day ago
    collaborators: [
      {
        id: '1',
        name: 'Sarah Chen',
        email: 'sarah.chen@example.com',
        role: 'owner',
        online: true
      },
      {
        id: '3',
        name: 'Emma Wilson',
        email: 'emma.w@example.com',
        role: 'editor',
        online: true
      },
      {
        id: '4',
        name: 'Michael Brown',
        email: 'm.brown@example.com',
        role: 'viewer',
        online: false
      }
    ]
  }
];

const mockComments: Comment[] = [
  {
    id: '1',
    user: mockProjects[0].collaborators[0],
    text: 'I think we should expand the literature review section to include more recent studies.',
    timestamp: new Date(Date.now() - 3600000 * 2) // 2 hours ago
  },
  {
    id: '2',
    user: mockProjects[0].collaborators[1],
    text: 'Agreed. I found some papers from 2024 that would be relevant. I'll add them to our shared folder.',
    timestamp: new Date(Date.now() - 3600000) // 1 hour ago
  },
  {
    id: '3',
    user: mockProjects[0].collaborators[0],
    text: 'Great! Also, we should discuss the methodology section in our next meeting.',
    timestamp: new Date(Date.now() - 1800000) // 30 minutes ago
  }
];

const ResearchCollaboration: React.FC = () => {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState('');
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState('');
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [isAddingCollaborator, setIsAddingCollaborator] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectProject = (project: Project) => {
    setActiveProject(project);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle) return;
    
    setIsLoading(true);
    try {
      // In a real implementation, this would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newProject: Project = {
        id: (projects.length + 1).toString(),
        title: newProjectTitle,
        description: newProjectDescription,
        lastEdited: new Date(),
        collaborators: [
          {
            id: '1',
            name: 'Sarah Chen',
            email: 'sarah.chen@example.com',
            role: 'owner',
            online: true
          }
        ]
      };
      
      setProjects([...projects, newProject]);
      setNewProjectTitle('');
      setNewProjectDescription('');
      setIsCreatingProject(false);
      
      toast({
        title: "Project created",
        description: "Your new collaborative project has been created.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCollaborator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollaboratorEmail || !activeProject) return;
    
    setIsLoading(true);
    try {
      // In a real implementation, this would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCollaborator: Collaborator = {
        id: (activeProject.collaborators.length + 10).toString(), // Just for mock
        name: newCollaboratorEmail.split('@')[0].replace('.', ' '),
        email: newCollaboratorEmail,
        role: 'viewer',
        online: false
      };
      
      const updatedProject = {
        ...activeProject,
        collaborators: [...activeProject.collaborators, newCollaborator]
      };
      
      setProjects(projects.map(p => p.id === activeProject.id ? updatedProject : p));
      setActiveProject(updatedProject);
      setNewCollaboratorEmail('');
      setIsAddingCollaborator(false);
      
      toast({
        title: "Collaborator added",
        description: `${newCollaborator.name} has been added to the project.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add collaborator. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendComment = () => {
    if (!newComment || !activeProject) return;
    
    const comment: Comment = {
      id: (comments.length + 1).toString(),
      user: activeProject.collaborators[0], // Current user
      text: newComment,
      timestamp: new Date()
    };
    
    setComments([...comments, comment]);
    setNewComment('');
    
    toast({
      title: "Comment sent",
      description: "Your comment has been added to the discussion.",
    });
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
      }).format(date);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Research Collaboration</h1>
        <Button onClick={() => setIsCreatingProject(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects List */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Collaborative Projects</CardTitle>
              <CardDescription>
                Work together with colleagues on research papers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {projects.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No projects yet. Create your first collaborative project.</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {projects.map(project => (
                    <li key={project.id}>
                      <Button
                        variant={activeProject?.id === project.id ? "default" : "outline"}
                        className="w-full justify-start h-auto py-3 px-4"
                        onClick={() => handleSelectProject(project)}
                      >
                        <div className="flex flex-col items-start text-left">
                          <div className="font-medium">{project.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Last edited {formatDate(project.lastEdited)} • {project.collaborators.length} collaborators
                          </div>
                        </div>
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Project Details and Collaboration */}
        <div className="lg:col-span-2">
          {activeProject ? (
            <Card className="h-full flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{activeProject.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {activeProject.description}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Project Options</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Link
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setIsAddingCollaborator(true)}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Collaborator
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileText className="h-4 w-4 mr-2" />
                        Export as PDF
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        Delete Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1">
                <Tabs defaultValue="discussion" className="h-full flex flex-col">
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="discussion">Discussion</TabsTrigger>
                    <TabsTrigger value="document">Document</TabsTrigger>
                    <TabsTrigger value="collaborators">Collaborators</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="discussion" className="flex-1 flex flex-col">
                    <ScrollArea className="flex-1 pr-4 h-[400px]">
                      <div className="space-y-4">
                        {comments.map(comment => (
                          <div key={comment.id} className="flex gap-3">
                            <Avatar>
                              <AvatarImage src={comment.user.avatar} />
                              <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{comment.user.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(comment.timestamp)}
                                </span>
                              </div>
                              <p className="mt-1">{comment.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex gap-3">
                        <Avatar>
                          <AvatarFallback>SC</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <Textarea
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="resize-none"
                          />
                          <div className="flex justify-end mt-2">
                            <Button onClick={handleSendComment} disabled={!newComment}>
                              <Send className="h-4 w-4 mr-2" />
                              Send
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="document" className="h-[500px] flex items-center justify-center bg-muted/30 rounded-md">
                    <div className="text-center">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                      <h3 className="mt-4 font-medium">Collaborative Document</h3>
                      <p className="text-sm text-muted-foreground mt-1 max-w-md">
                        This is where the collaborative document editor would be integrated.
                        Users can edit the document in real-time with their collaborators.
                      </p>
                      <Button className="mt-4">Open Document Editor</Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="collaborators">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Project Members</h3>
                        <Button variant="outline" size="sm" onClick={() => setIsAddingCollaborator(true)}>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>
                      
                      <ul className="space-y-3">
                        {activeProject.collaborators.map(collaborator => (
                          <li key={collaborator.id} className="flex items-center justify-between p-3 rounded-md border">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={collaborator.avatar} />
                                <AvatarFallback>{collaborator.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium flex items-center gap-2">
                                  {collaborator.name}
                                  {collaborator.online && (
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">{collaborator.email}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={
                                collaborator.role === 'owner' ? 'default' : 
                                collaborator.role === 'editor' ? 'outline' : 'secondary'
                              }>
                                {collaborator.role.charAt(0).toUpperCase() + collaborator.role.slice(1)}
                              </Badge>
                              {collaborator.role !== 'owner' && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Manage Access</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                      Make Editor
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      Make Viewer
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">
                                      Remove Access
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="mt-6 pt-4 border-t">
                        <h3 className="font-medium mb-2">Access Settings</h3>
                        <div className="flex items-center justify-between p-3 rounded-md border">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-muted">
                              <Lock className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-medium">Private Project</div>
                              <div className="text-sm text-muted-foreground">
                                Only invited members can access
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Change
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-xl font-medium">No Project Selected</h3>
                <p className="text-muted-foreground mt-2 max-w-md">
                  Select a project from the list or create a new one to start collaborating.
                </p>
                <Button className="mt-4" onClick={() => setIsCreatingProject(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Project
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Create Project Dialog */}
      {isCreatingProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Create New Project</CardTitle>
              <CardDescription>
                Start a new collaborative research project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Project Title</label>
                  <Input
                    value={newProjectTitle}
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                    placeholder="e.g., Neural Networks in Medical Imaging"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    placeholder="Brief description of the research project"
                    rows={3}
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setIsCreatingProject(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateProject} disabled={!newProjectTitle || isLoading}>
                {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Create Project
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
      
      {/* Add Collaborator Dialog */}
      {isAddingCollaborator && activeProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Add Collaborator</CardTitle>
              <CardDescription>
                Invite someone to collaborate on "{activeProject.title}"
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddCollaborator} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input
                    type="email"
                    value={newCollaboratorEmail}
                    onChange={(e) => setNewCollaboratorEmail(e.target.value)}
                    placeholder="colleague@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Permission</label>
                  <Select defaultValue="viewer">
                    <SelectTrigger>
                      <SelectValue placeholder="Select permission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="editor">Editor (can edit)</SelectItem>
                      <SelectItem value="viewer">Viewer (can view only)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setIsAddingCollaborator(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCollaborator} disabled={!newCollaboratorEmail || isLoading}>
                {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                Add Collaborator
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ResearchCollaboration;