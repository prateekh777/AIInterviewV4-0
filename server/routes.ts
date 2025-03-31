import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertApplicationSchema, resumeUploadSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Make sure the uploads directory exists
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      // Create user
      const user = await storage.createUser(userData);
      
      // Don't return the password
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      console.log("Login attempt:", { username, password });
      
      // Validate input
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      // Find user
      const user = await storage.getUserByUsername(username);
      console.log("User found:", user ? "Yes" : "No");
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Check password (in a real app, you'd use bcrypt to compare hashed passwords)
      console.log("Password check:", user.password === password ? "Match" : "No match");
      
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Don't return the password
      const { password: _, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Job routes
  app.get("/api/jobs", async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string || "";
      const location = req.query.location as string;
      const jobType = req.query.jobType as string;
      const experienceLevel = req.query.experienceLevel as string;
      const workType = req.query.workType as string;
      const companyType = req.query.companyType as string;
      
      const filters = {
        location,
        jobType,
        experienceLevel,
        workType,
        companyType
      };
      
      const jobs = await storage.searchJobs(query, filters);
      res.json(jobs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/jobs/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid job ID" });
      }
      
      const job = await storage.getJob(id);
      
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      
      res.json(job);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Job application routes
  app.post("/api/jobs/:id/apply", async (req: Request, res: Response) => {
    try {
      const jobId = parseInt(req.params.id);
      
      if (isNaN(jobId)) {
        return res.status(400).json({ message: "Invalid job ID" });
      }
      
      // Check if job exists
      const job = await storage.getJob(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      
      // Parse and validate application data
      const applicationData = insertApplicationSchema.parse(req.body);
      
      // Create application
      const application = await storage.createApplication({
        ...applicationData,
        jobId
      });
      
      res.status(201).json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Saved jobs routes
  app.post("/api/jobs/:id/save", async (req: Request, res: Response) => {
    try {
      const jobId = parseInt(req.params.id);
      const { userId } = req.body;
      
      if (isNaN(jobId) || !userId) {
        return res.status(400).json({ message: "Invalid job ID or user ID" });
      }
      
      // Check if job exists
      const job = await storage.getJob(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      
      // Check if user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Save the job
      const savedJob = await storage.createSavedJob({ jobId, userId });
      
      res.status(201).json(savedJob);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/jobs/:id/save", async (req: Request, res: Response) => {
    try {
      const jobId = parseInt(req.params.id);
      const userId = parseInt(req.query.userId as string);
      
      if (isNaN(jobId) || isNaN(userId)) {
        return res.status(400).json({ message: "Invalid job ID or user ID" });
      }
      
      // Find the saved job
      const savedJobs = await storage.getSavedJobsByUser(userId);
      const savedJob = savedJobs.find(job => job.jobId === jobId);
      
      if (!savedJob) {
        return res.status(404).json({ message: "Saved job not found" });
      }
      
      // Delete the saved job
      await storage.deleteSavedJob(savedJob.id);
      
      res.status(204).end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/users/:id/saved-jobs", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      // Check if user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get saved jobs
      const savedJobs = await storage.getSavedJobsByUser(userId);
      
      // Get full job details
      const jobDetails = await Promise.all(
        savedJobs.map(async (saved) => {
          const job = await storage.getJob(saved.jobId);
          return {
            ...saved,
            job
          };
        })
      );
      
      res.json(jobDetails);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get current user
  app.get("/api/user", async (req: Request, res: Response) => {
    try {
      // In a real app with sessions, this would use session data
      // For demo purposes, we're accepting a userId from query param or authentication header
      let userId: number | undefined;
      
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        // In real apps, this would verify a JWT token
        const token = authHeader.slice(7);
        userId = parseInt(token);
      } else if (req.query.userId) {
        userId = parseInt(req.query.userId as string);
      }
      
      if (!userId || isNaN(userId)) {
        return res.status(400).json({ message: "Valid user ID is required" });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't send the password
      const { password, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
