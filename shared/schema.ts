import { pgTable, text, serial, integer, boolean, timestamp, json, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  phone: text("phone"),
  resume: text("resume"),
  coverLetter: text("cover_letter"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Job table
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  salary: text("salary"),
  description: text("description").notNull(),
  responsibilities: text("responsibilities").notNull(),
  companyDescription: text("company_description").notNull(),
  jobType: text("job_type").notNull(), // Full-time, Part-time, Contract, etc.
  workType: text("work_type").notNull(), // Remote, Onsite, Hybrid
  experienceLevel: text("experience_level").notNull(), // Entry, Mid, Senior
  companySize: text("company_size"),
  companyLogo: text("company_logo"),
  postedDate: timestamp("posted_date").defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

// Job applications table
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull(),
  userId: integer("user_id").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  resume: text("resume").notNull(), // File path or URL
  coverLetter: text("cover_letter"),
  status: text("status").default("applied").notNull(), // applied, reviewed, interview, rejected, offered, hired
  applicationDate: timestamp("application_date").defaultNow().notNull(),
});

// Saved jobs table
export const savedJobs = pgTable("saved_jobs", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull(),
  userId: integer("user_id").notNull(),
  savedAt: timestamp("saved_at").defaultNow().notNull(),
}, (table) => {
  return {
    uniqueJobUser: uniqueIndex("unique_job_user").on(table.jobId, table.userId),
  };
});

// Schema for inserting a user
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  phone: true,
});

// Schema for inserting a job
export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  isActive: true,
  postedDate: true,
});

// Schema for inserting an application
export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  applicationDate: true,
  status: true,
});

// Schema for inserting a saved job
export const insertSavedJobSchema = createInsertSchema(savedJobs).omit({
  id: true,
  savedAt: true,
});

// File upload schema
export const resumeUploadSchema = z.object({
  file: z.instanceof(File),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;

export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;

export type SavedJob = typeof savedJobs.$inferSelect;
export type InsertSavedJob = z.infer<typeof insertSavedJobSchema>;
