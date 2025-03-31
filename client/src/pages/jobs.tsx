import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import JobFilters from "@/components/job/job-filters";
import JobListItem from "@/components/job/job-list-item";
import { Job } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Building, MapPin, Briefcase, DollarSign, Heart, Clock, User as UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import JobApplicationForm from "@/components/job/job-application-form";
import { formatRelativeTime } from "@/lib/format";
import { useToast } from "@/hooks/use-toast";

const Jobs: React.FC = () => {
  const [user, setUser] = useState<any | null>(null);
  const { toast } = useToast();
  
  // Load user from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load user from localStorage:", error);
    }
  }, []);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<any>({});
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [savedJobs, setSavedJobs] = useState<number[]>([]);

  // Fetch job listings
  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ['/api/jobs', query, filters],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (query) queryParams.append('q', query);
      if (filters.location) queryParams.append('location', filters.location);
      if (filters.jobType) queryParams.append('jobType', filters.jobType);
      if (filters.experienceLevel) queryParams.append('experienceLevel', filters.experienceLevel);
      if (filters.workType) queryParams.append('workType', filters.workType);
      if (filters.companyType) queryParams.append('companyType', filters.companyType);
      
      const res = await fetch(`/api/jobs?${queryParams.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch jobs');
      return res.json();
    }
  });

  // Fetch user's saved jobs if logged in
  const { data: userSavedJobs } = useQuery({
    queryKey: [`/api/users/${user?.id}/saved-jobs`],
    queryFn: async () => {
      if (!user) return [];
      const res = await fetch(`/api/users/${user.id}/saved-jobs`);
      if (!res.ok) {
        if (res.status === 401) return [];
        throw new Error('Failed to fetch saved jobs');
      }
      return res.json();
    },
    enabled: !!user,
  });

  // Update saved jobs when data is available
  useEffect(() => {
    if (userSavedJobs) {
      setSavedJobs(userSavedJobs.map((savedJob: any) => savedJob.jobId));
    }
  }, [userSavedJobs]);

  // Set the first job as selected when jobs load
  useEffect(() => {
    if (jobs && jobs.length > 0 && !selectedJobId) {
      setSelectedJobId(jobs[0].id);
    }
  }, [jobs, selectedJobId]);

  const handleSearch = (searchQuery: string, searchFilters: any) => {
    setQuery(searchQuery);
    setFilters(searchFilters);
  };

  const handleSaveJob = (jobId: number) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save jobs",
        variant: "destructive"
      });
      return;
    }
    
    // The actual save/unsave logic is handled in the JobListItem component
    // Here we just update the UI state
    setSavedJobs(prev => {
      if (prev.includes(jobId)) {
        return prev.filter(id => id !== jobId);
      } else {
        return [...prev, jobId];
      }
    });
  };

  const handleApplyNow = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to apply for jobs",
        variant: "destructive"
      });
      return;
    }
    
    setShowApplicationForm(true);
  };

  const selectedJob = jobs?.find((job: Job) => job.id === selectedJobId);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-neutral-50">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-neutral-800 mb-2">Search <span className="text-primary">Jobs</span></h1>
          </div>
          
          {/* Search and Filters */}
          <JobFilters onSearch={handleSearch} initialQuery={query} />
          
          {/* Search Results */}
          <div className="mb-6">
            {isLoading ? (
              <Skeleton className="h-6 w-48" />
            ) : jobs && jobs.length > 0 ? (
              <p className="text-neutral-600 text-sm">{jobs.length} results {query ? `for "${query}"` : ""}</p>
            ) : (
              <p className="text-neutral-600 text-sm">No jobs found {query ? `for "${query}"` : ""}</p>
            )}
          </div>
          
          {/* Job Listings */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Job Listings Left Column */}
            <div className="lg:col-span-1 space-y-4">
              {isLoading ? (
                // Skeleton loading state for job list
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg border border-neutral-200 p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <Skeleton className="w-10 h-10 rounded-md mr-3" />
                        <div>
                          <Skeleton className="h-5 w-32 mb-1" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                      <Skeleton className="h-6 w-6 rounded-full" />
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))
              ) : error ? (
                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                  <p className="text-red-600">Error loading jobs: {(error as Error).message}</p>
                </div>
              ) : jobs && jobs.length > 0 ? (
                <>
                  {jobs.map((job: Job) => (
                    <JobListItem 
                      key={job.id} 
                      job={job} 
                      isSelected={job.id === selectedJobId}
                      onSave={handleSaveJob}
                      isSaved={savedJobs.includes(job.id)}
                      userId={user?.id || null}
                      onClick={() => setSelectedJobId(job.id)}
                    />
                  ))}
                  
                  {jobs.length > 4 && (
                    <Button variant="outline" className="w-full">
                      Show more
                    </Button>
                  )}
                </>
              ) : (
                <div className="bg-white rounded-lg border border-neutral-200 p-8 text-center">
                  <p className="text-neutral-600 mb-4">No jobs found matching your criteria.</p>
                  <Button variant="outline" onClick={() => handleSearch("", {})}>
                    Clear filters and try again
                  </Button>
                </div>
              )}
            </div>
            
            {/* Job Details Center/Right Column */}
            <div className="lg:col-span-2 bg-white rounded-lg border border-neutral-200 overflow-hidden">
              {isLoading || !selectedJob ? (
                // Skeleton loading state for job details
                <div>
                  <Skeleton className="h-36 w-full" />
                  <div className="p-6">
                    <div className="flex flex-wrap justify-between items-start mb-4">
                      <div>
                        <Skeleton className="h-7 w-64 mb-2" />
                        <Skeleton className="h-5 w-32" />
                      </div>
                      
                      <div className="flex space-x-2">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-32" />
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 mb-6">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-32" />
                    </div>
                    
                    <Skeleton className="h-0.5 w-full mb-6" />
                    
                    <div className="mb-6">
                      <Skeleton className="h-6 w-48 mb-3" />
                      <Skeleton className="h-20 w-full mb-4" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                    
                    <div className="mb-6">
                      <Skeleton className="h-6 w-48 mb-3" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Job Header Image */}
                  <div className="h-36 bg-gradient-to-r from-blue-500 to-primary overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                      alt="Modern office building" 
                      className="w-full h-full object-cover opacity-80"
                    />
                  </div>
                  
                  {/* Job Details Content */}
                  <div className="p-6">
                    <div className="flex flex-wrap justify-between items-start mb-4">
                      <div>
                        <h2 className="text-xl font-semibold text-neutral-800 mb-1">{selectedJob.title}</h2>
                        <p className="text-primary font-medium">{selectedJob.salary}</p>
                      </div>
                      
                      <div className="flex space-x-2 mt-2 sm:mt-0">
                        <Button 
                          variant="ghost" 
                          className="flex items-center text-primary hover:text-primary-dark"
                          onClick={() => handleSaveJob(selectedJob.id)}
                        >
                          <Heart className={`mr-2 h-5 w-5 ${savedJobs.includes(selectedJob.id) ? "fill-current" : ""}`} />
                          <span className="text-sm">Save</span>
                        </Button>
                        <Button onClick={handleApplyNow}>
                          Apply Now
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 mb-6">
                      <div className="flex items-center text-sm text-neutral-600">
                        <Building className="mr-2 text-neutral-400 h-4 w-4" />
                        <span>{selectedJob.company}</span>
                      </div>
                      <div className="flex items-center text-sm text-neutral-600">
                        <MapPin className="mr-2 text-neutral-400 h-4 w-4" />
                        <span>{selectedJob.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-neutral-600">
                        <Clock className="mr-2 text-neutral-400 h-4 w-4" />
                        <span>Posted {formatRelativeTime(new Date(selectedJob.postedDate))}</span>
                      </div>
                    </div>
                    
                    <Separator className="mb-6" />
                    
                    <div className="flex gap-4 mb-4">
                      <Badge variant="secondary" className="bg-neutral-100 text-neutral-800">
                        {selectedJob.experienceLevel}
                      </Badge>
                      <Badge variant="secondary" className="bg-neutral-100 text-neutral-800">
                        {selectedJob.jobType}
                      </Badge>
                      <Badge variant="secondary" className="bg-neutral-100 text-neutral-800">
                        {selectedJob.workType}
                      </Badge>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center mr-3">
                          <UserIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-neutral-800">Hiring Manager</h4>
                          <p className="text-xs text-neutral-500">Recruiting Team</p>
                        </div>
                      </div>
                      
                      <Button variant="link" className="text-primary p-0 h-auto font-medium text-sm hover:text-primary-dark">
                        <i className="far fa-comment-dots mr-1"></i> Message
                      </Button>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-neutral-800 mb-3">Job Description</h3>
                      <p className="text-neutral-600 mb-4 whitespace-pre-line">
                        {selectedJob.description}
                      </p>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-neutral-800 mb-3">Responsibilities</h3>
                      <ul className="list-disc list-inside space-y-2 text-neutral-600">
                        {selectedJob.responsibilities.split("\n").map((responsibility: string, index: number) => (
                          <li key={index}>{responsibility}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-neutral-800 mb-3">About company</h3>
                      <div className="flex items-center mb-4">
                        <div className={`w-12 h-12 rounded-md flex items-center justify-center text-white mr-3 ${
                          selectedJob.companyLogo === "bezier-curve" 
                            ? "bg-gradient-to-br from-purple-500 to-pink-500" 
                            : selectedJob.companyLogo === "user-plus" 
                            ? "bg-white border border-neutral-200 text-primary" 
                            : selectedJob.companyLogo === "font" 
                            ? "bg-gradient-to-br from-green-400 to-cyan-400" 
                            : "bg-gradient-to-br from-blue-500 to-indigo-500"
                        }`}>
                          <i className={`fas fa-${selectedJob.companyLogo || "building"} text-xl`}></i>
                        </div>
                        <div>
                          <h4 className="font-medium text-neutral-800">{selectedJob.company.toUpperCase()}</h4>
                          <a href="#" className="text-sm text-primary hover:text-primary-dark">View company profile</a>
                        </div>
                      </div>
                      
                      <p className="text-neutral-600 mb-4">
                        {selectedJob.companyDescription}
                      </p>
                      
                      <div className="flex flex-wrap gap-x-6 gap-y-3">
                        {selectedJob.companySize && (
                          <div className="flex items-center text-sm text-neutral-600">
                            <i className="fas fa-users mr-2 text-neutral-400"></i>
                            <span>{selectedJob.companySize}</span>
                          </div>
                        )}
                        <div className="flex items-center text-sm text-neutral-600">
                          <MapPin className="mr-2 text-neutral-400 h-4 w-4" />
                          <span>{selectedJob.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-neutral-600">
                          <Clock className="mr-2 text-neutral-400 h-4 w-4" />
                          <span>Mon - Fri</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Profile Completion Banner */}
          {user && (
            <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-md overflow-hidden relative">
              <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between">
                <div className="mb-4 sm:mb-0 sm:mr-6">
                  <h3 className="text-xl font-semibold text-white mb-2">Complete your profile</h3>
                  <p className="text-indigo-100">Complete your profile to increase your chances of getting hired. Add your skills, experience, and education.</p>
                  <Button className="mt-4 bg-white text-primary hover:bg-neutral-100">
                    Update profile
                  </Button>
                </div>
                <div className="flex items-center">
                  <div className="relative mr-4">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white border-2 border-white">
                      <span className="text-lg font-medium">
                        {user.fullName
                          ? `${user.fullName.split(" ")[0][0]}${user.fullName.split(" ")[1]?.[0] || ""}`
                          : user.username.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-purple-200 rounded-full p-1">
                      <i className="fas fa-user-plus text-xs text-primary"></i>
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center border-2 border-white">
                    <UserIcon className="h-6 w-6 text-neutral-400" />
                  </div>
                </div>
              </div>
              <button 
                className="absolute top-2 right-2 bg-white bg-opacity-20 rounded-full w-6 h-6 flex items-center justify-center hover:bg-opacity-30"
                aria-label="Close"
              >
                <i className="fas fa-times text-xs text-white"></i>
              </button>
            </div>
          )}
        </div>
      </main>
      
      {/* Application Form Dialog */}
      {showApplicationForm && selectedJob && (
        <JobApplicationForm 
          job={selectedJob} 
          onClose={() => setShowApplicationForm(false)} 
        />
      )}
      
      <Footer />
    </div>
  );
};

export default Jobs;
