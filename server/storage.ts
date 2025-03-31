import { 
  users, type User, type InsertUser, 
  jobs, type Job, type InsertJob,
  applications, type Application, type InsertApplication,
  savedJobs, type SavedJob, type InsertSavedJob 
} from "@shared/schema";

// Storage interface with CRUD methods
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;

  // Job operations
  getJob(id: number): Promise<Job | undefined>;
  getAllJobs(): Promise<Job[]>;
  searchJobs(query: string, filters?: JobFilters): Promise<Job[]>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: number, jobData: Partial<Job>): Promise<Job | undefined>;

  // Application operations
  getApplication(id: number): Promise<Application | undefined>;
  getApplicationsByJob(jobId: number): Promise<Application[]>;
  getApplicationsByUser(userId: number): Promise<Application[]>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplicationStatus(id: number, status: string): Promise<Application | undefined>;

  // Saved jobs operations
  getSavedJobsByUser(userId: number): Promise<SavedJob[]>;
  createSavedJob(savedJob: InsertSavedJob): Promise<SavedJob>;
  deleteSavedJob(id: number): Promise<boolean>;
  isSavedJob(jobId: number, userId: number): Promise<boolean>;
}

// Job filters interface
export interface JobFilters {
  location?: string;
  jobType?: string;
  experienceLevel?: string;
  companyType?: string;
  workType?: string;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private jobs: Map<number, Job>;
  private applications: Map<number, Application>;
  private savedJobs: Map<number, SavedJob>;
  private userId: number;
  private jobId: number;
  private applicationId: number;
  private savedJobId: number;

  constructor() {
    this.users = new Map();
    this.jobs = new Map();
    this.applications = new Map();
    this.savedJobs = new Map();
    this.userId = 1;
    this.jobId = 1;
    this.applicationId = 1;
    this.savedJobId = 1;

    // Initialize with some sample jobs
    this.initializeSampleData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt, resume: null, coverLetter: null };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Job operations
  async getJob(id: number): Promise<Job | undefined> {
    return this.jobs.get(id);
  }

  async getAllJobs(): Promise<Job[]> {
    return Array.from(this.jobs.values())
      .filter(job => job.isActive)
      .sort((a, b) => b.postedDate.getTime() - a.postedDate.getTime());
  }

  async searchJobs(query: string, filters?: JobFilters): Promise<Job[]> {
    let results = Array.from(this.jobs.values()).filter(job => job.isActive);
    
    // Apply search query
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(job => 
        job.title.toLowerCase().includes(lowerQuery) || 
        job.company.toLowerCase().includes(lowerQuery) ||
        job.description.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Apply filters
    if (filters) {
      if (filters.location) {
        results = results.filter(job => job.location.toLowerCase().includes(filters.location!.toLowerCase()));
      }
      
      if (filters.jobType) {
        results = results.filter(job => job.jobType === filters.jobType);
      }
      
      if (filters.experienceLevel) {
        results = results.filter(job => job.experienceLevel === filters.experienceLevel);
      }
      
      if (filters.workType) {
        results = results.filter(job => job.workType === filters.workType);
      }
      
      if (filters.companyType) {
        // This is a bit trickier since we don't have a direct companyType field
        // For now, we'll just skip this filter in the demo
      }
    }
    
    // Sort by most recent
    return results.sort((a, b) => b.postedDate.getTime() - a.postedDate.getTime());
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const id = this.jobId++;
    const postedDate = new Date();
    const job: Job = { ...insertJob, id, postedDate, isActive: true };
    this.jobs.set(id, job);
    return job;
  }

  async updateJob(id: number, jobData: Partial<Job>): Promise<Job | undefined> {
    const job = this.jobs.get(id);
    if (!job) return undefined;
    
    const updatedJob = { ...job, ...jobData };
    this.jobs.set(id, updatedJob);
    return updatedJob;
  }

  // Application operations
  async getApplication(id: number): Promise<Application | undefined> {
    return this.applications.get(id);
  }

  async getApplicationsByJob(jobId: number): Promise<Application[]> {
    return Array.from(this.applications.values())
      .filter(app => app.jobId === jobId)
      .sort((a, b) => b.applicationDate.getTime() - a.applicationDate.getTime());
  }

  async getApplicationsByUser(userId: number): Promise<Application[]> {
    return Array.from(this.applications.values())
      .filter(app => app.userId === userId)
      .sort((a, b) => b.applicationDate.getTime() - a.applicationDate.getTime());
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const id = this.applicationId++;
    const applicationDate = new Date();
    const application: Application = { 
      ...insertApplication, 
      id, 
      applicationDate, 
      status: "applied" 
    };
    this.applications.set(id, application);
    return application;
  }

  async updateApplicationStatus(id: number, status: string): Promise<Application | undefined> {
    const application = this.applications.get(id);
    if (!application) return undefined;
    
    const updatedApplication = { ...application, status };
    this.applications.set(id, updatedApplication);
    return updatedApplication;
  }

  // Saved jobs operations
  async getSavedJobsByUser(userId: number): Promise<SavedJob[]> {
    return Array.from(this.savedJobs.values())
      .filter(saved => saved.userId === userId)
      .sort((a, b) => b.savedAt.getTime() - a.savedAt.getTime());
  }

  async createSavedJob(insertSavedJob: InsertSavedJob): Promise<SavedJob> {
    // Check if already saved
    const exists = Array.from(this.savedJobs.values()).find(
      saved => saved.jobId === insertSavedJob.jobId && saved.userId === insertSavedJob.userId
    );
    
    if (exists) return exists;
    
    const id = this.savedJobId++;
    const savedAt = new Date();
    const savedJob: SavedJob = { ...insertSavedJob, id, savedAt };
    this.savedJobs.set(id, savedJob);
    return savedJob;
  }

  async deleteSavedJob(id: number): Promise<boolean> {
    return this.savedJobs.delete(id);
  }

  async isSavedJob(jobId: number, userId: number): Promise<boolean> {
    return Array.from(this.savedJobs.values()).some(
      saved => saved.jobId === jobId && saved.userId === userId
    );
  }

  // Initialize with some sample data for demonstration
  private initializeSampleData() {
    // Sample jobs
    const sampleJobs: InsertJob[] = [
      {
        title: "UI / UX Designer",
        company: "Laborum",
        location: "Tucson, AZ",
        salary: "$95K - $120K",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolorem sed lacinia quos. Nabi vestibulum elittu iaculis dolor velit in vel majgna arcu sit leo. In honcus maet donec vehicula sed pellentesque sit quis eu, facilisi. Id Ac magna congue eleifend ult erat sit sed ultrices dolor accumsan dis. Id quam.",
        responsibilities: "Conduct user research to inform design decisions\nConsectetur adipiscing elit. Lorem ipsum dolor sed lacinia quos.\nIn honcus maet donec vehicula sed pellentesque sit quis eu, faccilsi.\nId ac magna congue eleifend ultricies erat sit sed ultrices dolor.",
        companyDescription: "Quibusdam velit consequunt ex error ullam et ad ut sure dillore quas adipisum sed. Lorem ipsum dolor. Ut non minim dolor duis aute culpa eu enim. Et velit culpa do minum laborem esse sint auta ullum ea tempor dolore ad.",
        jobType: "Full-time",
        workType: "Onsite",
        experienceLevel: "Mid-level",
        companySize: "100 - 250 employees",
        companyLogo: "bezier-curve"
      },
      {
        title: "Senior UX/UI Designer",
        company: "Laborum",
        location: "Columbus, OH",
        salary: "$110K - $135K",
        description: "Looking for an experienced UX/UI Designer to lead design projects and work closely with our product and development teams. The ideal candidate will have a strong portfolio demonstrating expertise in user-centered design methodologies.",
        responsibilities: "Lead the design process from concept to implementation\nCreate wireframes, prototypes, and high-fidelity mockups\nConduct user research and usability testing\nCollaborate with cross-functional teams to deliver cohesive product experiences",
        companyDescription: "At Laborum, we're dedicated to creating innovative solutions that improve people's lives. Our talented team works in a collaborative environment where creativity and problem-solving are valued.",
        jobType: "Full-time",
        workType: "Hybrid",
        experienceLevel: "Senior-level",
        companySize: "100 - 250 employees",
        companyLogo: "user-plus"
      },
      {
        title: "UX Copywriter",
        company: "ABC",
        location: "Tulsa, OK",
        salary: "$70K - $85K",
        description: "We're seeking a talented UX Copywriter to craft clear, concise, and user-friendly content for our digital products. You'll work alongside designers and developers to ensure our messaging aligns with our brand voice and user needs.",
        responsibilities: "Write clear, concise copy for websites, apps, and other digital products\nDevelop and maintain a consistent brand voice across all platforms\nCollaborate with design and product teams to create cohesive user experiences\nReview and edit content for clarity, grammar, and style",
        companyDescription: "ABC is a fast-growing tech company focused on creating intuitive digital experiences that simplify complex processes. We value creativity, collaboration, and a user-first approach to product development.",
        jobType: "Full-time",
        workType: "Remote",
        experienceLevel: "Mid-level",
        companySize: "50 - 100 employees",
        companyLogo: "font"
      },
      {
        title: "UI / UX Designer",
        company: "Negotiate",
        location: "Denver, CO",
        salary: "Negotiable",
        description: "Join our creative team as a UI/UX Designer where you'll help shape the future of our products. We're looking for someone who can blend beautiful interfaces with functional user experiences.",
        responsibilities: "Design intuitive user interfaces for web and mobile applications\nCreate user flows, wireframes, and prototypes\nConduct user research and incorporate feedback into design iterations\nCollaborate with developers to ensure design integrity during implementation",
        companyDescription: "Negotiate is a design-forward company that specializes in creating digital products that make life easier for our users. We believe in iterative design processes and continuous improvement.",
        jobType: "Full-time",
        workType: "Onsite",
        experienceLevel: "Entry-level",
        companySize: "25 - 50 employees",
        companyLogo: "pen-fancy"
      },
      {
        title: "Product Designer",
        company: "TechSolutions Inc.",
        location: "New York, USA",
        salary: "$3,000 - $3,800",
        description: "We are looking for a talented Product Designer to join our team and help create intuitive and visually appealing user experiences for our digital products. The ideal candidate will have a strong portfolio demonstrating both UX and UI skills.",
        responsibilities: "Create user-centered designs by understanding business requirements, user feedback, and research\nIllustrate design ideas using storyboards, process flows and sitemaps\nDesign graphic user interface elements, like menus, tabs and widgets\nBuild page navigation buttons and search fields",
        companyDescription: "TechSolutions Inc. is a leading technology company focused on creating innovative solutions that solve real-world problems. We have a collaborative and inclusive culture that values creativity and personal growth.",
        jobType: "Full-time",
        workType: "Remote",
        experienceLevel: "Mid-level",
        companySize: "250 - 500 employees",
        companyLogo: "bezier-curve"
      }
    ];

    // Add sample jobs to storage
    sampleJobs.forEach(job => {
      const id = this.jobId++;
      const postedDate = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000); // Random date within last 30 days
      const completeJob: Job = { ...job, id, postedDate, isActive: true };
      this.jobs.set(id, completeJob);
    });
  }
}

export const storage = new MemStorage();
