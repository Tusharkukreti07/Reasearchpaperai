import { 
  users, 
  papers, 
  annotations, 
  citations, 
  summaries, 
  chats,
  messages,
  researchGoals,
  type User, 
  type InsertUser,
  type Paper,
  type InsertPaper,
  type Annotation,
  type InsertAnnotation,
  type Citation,
  type InsertCitation,
  type Summary,
  type InsertSummary,
  type Chat,
  type InsertChat,
  type Message,
  type InsertMessage,
  type ResearchGoal,
  type InsertResearchGoal
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Paper methods
  getPaper(id: number): Promise<Paper | undefined>;
  getPapersByUserId(userId: number): Promise<Paper[]>;
  createPaper(paper: InsertPaper): Promise<Paper>;
  updatePaper(id: number, paper: Partial<Paper>): Promise<Paper | undefined>;
  deletePaper(id: number): Promise<boolean>;
  
  // Annotation methods
  getAnnotation(id: number): Promise<Annotation | undefined>;
  getAnnotationsByPaperId(paperId: number): Promise<Annotation[]>;
  createAnnotation(annotation: InsertAnnotation): Promise<Annotation>;
  updateAnnotation(id: number, annotation: Partial<Annotation>): Promise<Annotation | undefined>;
  deleteAnnotation(id: number): Promise<boolean>;
  
  // Citation methods
  getCitation(id: number): Promise<Citation | undefined>;
  getCitationsByPaperId(paperId: number): Promise<Citation[]>;
  createCitation(citation: InsertCitation): Promise<Citation>;
  deleteCitation(id: number): Promise<boolean>;
  
  // Summary methods
  getSummary(id: number): Promise<Summary | undefined>;
  getSummaryByPaperId(paperId: number): Promise<Summary | undefined>;
  createSummary(summary: InsertSummary): Promise<Summary>;
  updateSummary(id: number, summary: Partial<Summary>): Promise<Summary | undefined>;
  
  // Chat methods
  getChat(id: number): Promise<Chat | undefined>;
  getChatsByUserId(userId: number): Promise<Chat[]>;
  createChat(chat: InsertChat): Promise<Chat>;
  updateChat(id: number, title: string): Promise<Chat | undefined>;
  deleteChat(id: number): Promise<boolean>;
  
  // Message methods
  getMessage(id: number): Promise<Message | undefined>;
  getMessagesByChatId(chatId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Research Goal methods
  getResearchGoal(id: number): Promise<ResearchGoal | undefined>;
  getResearchGoalsByUserId(userId: number): Promise<ResearchGoal[]>;
  createResearchGoal(goal: InsertResearchGoal): Promise<ResearchGoal>;
  updateResearchGoal(id: number, goal: Partial<ResearchGoal>): Promise<ResearchGoal | undefined>;
  deleteResearchGoal(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private papers: Map<number, Paper>;
  private annotations: Map<number, Annotation>;
  private citations: Map<number, Citation>;
  private summaries: Map<number, Summary>;
  private chats: Map<number, Chat>;
  private messages: Map<number, Message>;
  private researchGoals: Map<number, ResearchGoal>;
  
  private currentUserId: number;
  private currentPaperId: number;
  private currentAnnotationId: number;
  private currentCitationId: number;
  private currentSummaryId: number;
  private currentChatId: number;
  private currentMessageId: number;
  private currentResearchGoalId: number;

  constructor() {
    this.users = new Map();
    this.papers = new Map();
    this.annotations = new Map();
    this.citations = new Map();
    this.summaries = new Map();
    this.chats = new Map();
    this.messages = new Map();
    this.researchGoals = new Map();
    
    this.currentUserId = 1;
    this.currentPaperId = 1;
    this.currentAnnotationId = 1;
    this.currentCitationId = 1;
    this.currentSummaryId = 1;
    this.currentChatId = 1;
    this.currentMessageId = 1;
    this.currentResearchGoalId = 1;

    // Create a demo user
    this.createUser({
      username: "sarah",
      password: "password123",
      displayName: "Sarah Chen",
      role: "researcher"
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }

  // Paper methods
  async getPaper(id: number): Promise<Paper | undefined> {
    return this.papers.get(id);
  }

  async getPapersByUserId(userId: number): Promise<Paper[]> {
    return Array.from(this.papers.values()).filter(
      (paper) => paper.userId === userId
    );
  }

  async createPaper(insertPaper: InsertPaper): Promise<Paper> {
    const id = this.currentPaperId++;
    const uploadDate = new Date();
    const isProcessed = false;
    const paper: Paper = { ...insertPaper, id, uploadDate, isProcessed };
    this.papers.set(id, paper);
    return paper;
  }

  async updatePaper(id: number, paperUpdate: Partial<Paper>): Promise<Paper | undefined> {
    const paper = this.papers.get(id);
    if (!paper) return undefined;
    
    const updatedPaper = { ...paper, ...paperUpdate };
    this.papers.set(id, updatedPaper);
    return updatedPaper;
  }

  async deletePaper(id: number): Promise<boolean> {
    return this.papers.delete(id);
  }

  // Annotation methods
  async getAnnotation(id: number): Promise<Annotation | undefined> {
    return this.annotations.get(id);
  }

  async getAnnotationsByPaperId(paperId: number): Promise<Annotation[]> {
    return Array.from(this.annotations.values()).filter(
      (annotation) => annotation.paperId === paperId
    );
  }

  async createAnnotation(insertAnnotation: InsertAnnotation): Promise<Annotation> {
    const id = this.currentAnnotationId++;
    const createdAt = new Date();
    const annotation: Annotation = { ...insertAnnotation, id, createdAt };
    this.annotations.set(id, annotation);
    return annotation;
  }

  async updateAnnotation(id: number, annotationUpdate: Partial<Annotation>): Promise<Annotation | undefined> {
    const annotation = this.annotations.get(id);
    if (!annotation) return undefined;
    
    const updatedAnnotation = { ...annotation, ...annotationUpdate };
    this.annotations.set(id, updatedAnnotation);
    return updatedAnnotation;
  }

  async deleteAnnotation(id: number): Promise<boolean> {
    return this.annotations.delete(id);
  }

  // Citation methods
  async getCitation(id: number): Promise<Citation | undefined> {
    return this.citations.get(id);
  }

  async getCitationsByPaperId(paperId: number): Promise<Citation[]> {
    return Array.from(this.citations.values()).filter(
      (citation) => citation.paperId === paperId
    );
  }

  async createCitation(insertCitation: InsertCitation): Promise<Citation> {
    const id = this.currentCitationId++;
    const createdAt = new Date();
    const citation: Citation = { ...insertCitation, id, createdAt };
    this.citations.set(id, citation);
    return citation;
  }

  async deleteCitation(id: number): Promise<boolean> {
    return this.citations.delete(id);
  }

  // Summary methods
  async getSummary(id: number): Promise<Summary | undefined> {
    return this.summaries.get(id);
  }

  async getSummaryByPaperId(paperId: number): Promise<Summary | undefined> {
    return Array.from(this.summaries.values()).find(
      (summary) => summary.paperId === paperId
    );
  }

  async createSummary(insertSummary: InsertSummary): Promise<Summary> {
    const id = this.currentSummaryId++;
    const createdAt = new Date();
    const summary: Summary = { ...insertSummary, id, createdAt };
    this.summaries.set(id, summary);
    return summary;
  }

  async updateSummary(id: number, summaryUpdate: Partial<Summary>): Promise<Summary | undefined> {
    const summary = this.summaries.get(id);
    if (!summary) return undefined;
    
    const updatedSummary = { ...summary, ...summaryUpdate };
    this.summaries.set(id, updatedSummary);
    return updatedSummary;
  }

  // Chat methods
  async getChat(id: number): Promise<Chat | undefined> {
    return this.chats.get(id);
  }

  async getChatsByUserId(userId: number): Promise<Chat[]> {
    return Array.from(this.chats.values()).filter(
      (chat) => chat.userId === userId
    );
  }

  async createChat(insertChat: InsertChat): Promise<Chat> {
    const id = this.currentChatId++;
    const createdAt = new Date();
    const chat: Chat = { ...insertChat, id, createdAt };
    this.chats.set(id, chat);
    return chat;
  }

  async updateChat(id: number, title: string): Promise<Chat | undefined> {
    const chat = this.chats.get(id);
    if (!chat) return undefined;
    
    const updatedChat = { ...chat, title };
    this.chats.set(id, updatedChat);
    return updatedChat;
  }

  async deleteChat(id: number): Promise<boolean> {
    return this.chats.delete(id);
  }

  // Message methods
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async getMessagesByChatId(chatId: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter((message) => message.chatId === chatId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const createdAt = new Date();
    const message: Message = { ...insertMessage, id, createdAt };
    this.messages.set(id, message);
    return message;
  }

  // Research Goal methods
  async getResearchGoal(id: number): Promise<ResearchGoal | undefined> {
    return this.researchGoals.get(id);
  }

  async getResearchGoalsByUserId(userId: number): Promise<ResearchGoal[]> {
    return Array.from(this.researchGoals.values()).filter(
      (goal) => goal.userId === userId
    );
  }

  async createResearchGoal(insertGoal: InsertResearchGoal): Promise<ResearchGoal> {
    const id = this.currentResearchGoalId++;
    const createdAt = new Date();
    const goal: ResearchGoal = { ...insertGoal, id, createdAt };
    this.researchGoals.set(id, goal);
    return goal;
  }

  async updateResearchGoal(id: number, goalUpdate: Partial<ResearchGoal>): Promise<ResearchGoal | undefined> {
    const goal = this.researchGoals.get(id);
    if (!goal) return undefined;
    
    const updatedGoal = { ...goal, ...goalUpdate };
    this.researchGoals.set(id, updatedGoal);
    return updatedGoal;
  }

  async deleteResearchGoal(id: number): Promise<boolean> {
    return this.researchGoals.delete(id);
  }
}

// Initialize storage
export const storage = new MemStorage();
