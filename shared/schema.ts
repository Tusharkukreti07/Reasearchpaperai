import { pgTable, text, serial, integer, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password"), // Optional for social logins
  displayName: text("display_name"),
  email: text("email").notNull().unique(),
  profilePicture: text("profile_picture"),
  googleId: text("google_id").unique(),
  githubId: text("github_id").unique(), 
  role: text("role").default("researcher"),
  createdAt: timestamp("created_at").defaultNow(),
  lastLogin: timestamp("last_login"),
});

// Paper model
export const papers = pgTable("papers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  authors: text("authors"),
  abstract: text("abstract"),
  content: text("content"),
  uploadDate: timestamp("upload_date").defaultNow(),
  filename: text("filename").notNull(),
  fileType: text("file_type").default("pdf"),
  fileSize: integer("file_size"),
  tags: text("tags").array(),
  metadata: json("metadata"),
  isProcessed: boolean("is_processed").default(false),
});

// Summary model
export const summaries = pgTable("summaries", {
  id: serial("id").primaryKey(),
  paperId: integer("paper_id").notNull(),
  bulletPoints: text("bullet_points"),
  sectionWise: json("section_wise"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Citation model
export const citations = pgTable("citations", {
  id: serial("id").primaryKey(),
  paperId: integer("paper_id").notNull(),
  citedTitle: text("cited_title"),
  citedAuthors: text("cited_authors"),
  citedYear: text("cited_year"),
  citedDoi: text("cited_doi"),
  citationText: text("citation_text"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Annotation model
export const annotations = pgTable("annotations", {
  id: serial("id").primaryKey(),
  paperId: integer("paper_id").notNull(),
  userId: integer("user_id").notNull(),
  pageNumber: integer("page_number"),
  content: text("content").notNull(),
  highlightedText: text("highlighted_text"),
  position: json("position"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Chat model for AI conversations
export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Message model for chat history
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id").notNull(),
  content: text("content").notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  createdAt: timestamp("created_at").defaultNow(),
});

// Research goals model
export const researchGoals = pgTable("research_goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  description: text("description").notNull(),
  isCompleted: boolean("is_completed").default(false),
  dueDate: timestamp("due_date"),
  completedDate: timestamp("completed_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  createdAt: true,
  lastLogin: true,
  googleId: true,
  githubId: true
}).extend({
  email: z.string().email(),
  password: z.string().optional() // Optional for OAuth logins
});

export const insertPaperSchema = createInsertSchema(papers).omit({
  id: true,
  uploadDate: true,
  isProcessed: true,
});

export const insertSummarySchema = createInsertSchema(summaries).omit({
  id: true,
  createdAt: true,
});

export const insertCitationSchema = createInsertSchema(citations).omit({
  id: true,
  createdAt: true,
});

export const insertAnnotationSchema = createInsertSchema(annotations).omit({
  id: true,
  createdAt: true,
});

export const insertChatSchema = createInsertSchema(chats).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertResearchGoalSchema = createInsertSchema(researchGoals).omit({
  id: true,
  createdAt: true,
  completedDate: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertPaper = z.infer<typeof insertPaperSchema>;
export type Paper = typeof papers.$inferSelect;

export type InsertSummary = z.infer<typeof insertSummarySchema>;
export type Summary = typeof summaries.$inferSelect;

export type InsertCitation = z.infer<typeof insertCitationSchema>;
export type Citation = typeof citations.$inferSelect;

export type InsertAnnotation = z.infer<typeof insertAnnotationSchema>;
export type Annotation = typeof annotations.$inferSelect;

export type InsertChat = z.infer<typeof insertChatSchema>;
export type Chat = typeof chats.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertResearchGoal = z.infer<typeof insertResearchGoalSchema>;
export type ResearchGoal = typeof researchGoals.$inferSelect;
