import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Job } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Building, MapPin, Briefcase, DollarSign, Heart, Clock, User, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import JobApplicationForm from "@/components/job/job-application-form";
import { formatRelativeTime } from "@/lib/format";
import { useToast } from "@/hooks/use-toast";

const JobDetails: React.FC = () => {
  const { id } = useParams();
  const jobId = parseInt(id);
  const [, navigate] = useLocation();
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
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Fetch job details
  const { data: job, isLoading, error } = useQuery({
    queryKey: [`/api/jobs/${jobId}`],
    queryFn: async () => {
      const res = await fetch(`/api/jobs/${jobId}`);
      if (!res.ok) throw new Error('Failed to fetch job details');
      return res.json();
    }
  });

  // Check if job is saved
  const { data: savedJobs } = useQuery({
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
    onSuccess: (data) => {
      if (data.some((savedJob: any) => savedJob.jobId === jobId)) {
        setIsSaved(true);
      }
    }
  });

  const handleSaveJob = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save jobs",
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (isSaved) {
        await apiRequest("DELETE", `/api/jobs/${jobId}/save?userId=${user.id}`, undefined);
      } else {
        await apiRequest("POST", `/api/jobs/${jobId}/save`, { userId: user.id });
      }
      
      setIsSaved(!isSaved);
      
      toast({
        title: isSaved ? "Job removed from saved jobs" : "Job saved successfully",
        description: isSaved ? "You can add it back anytime" : "You can view it in your saved jobs",
      });
    } catch (error) {
      console.error("Error saving job:", error);
      toast({
        title: "Failed to save job",
        description: "Please try again later",
        variant: "destructive",
      });
    }
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

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-center">
            <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
            <p className="text-red-600 mb-4">{(error as Error).message}</p>
            <Button onClick={() => navigate("/jobs")}>
              Back to Jobs
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-neutral-50">
        <div className="container mx-auto px-4 py-6">
          <Button
            variant="ghost"
            className="mb-4 flex items-center text-neutral-600 hover:text-neutral-800"
            onClick={() => navigate("/jobs")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to job listings
          </Button>
          
          <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
            {isLoading ? (
              // Skeleton loading state
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
            ) : job ? (
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
                      <h2 className="text-xl font-semibold text-neutral-800 mb-1">{job.title}</h2>
                      <p className="text-primary font-medium">{job.salary}</p>
                    </div>
                    
                    <div className="flex space-x-2 mt-2 sm:mt-0">
                      <Button 
                        variant="ghost" 
                        className="flex items-center text-primary hover:text-primary-dark"
                        onClick={handleSaveJob}
                      >
                        <Heart className={`mr-2 h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
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
                      <span>{job.company}</span>
                    </div>
                    <div className="flex items-center text-sm text-neutral-600">
                      <MapPin className="mr-2 text-neutral-400 h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-neutral-600">
                      <Clock className="mr-2 text-neutral-400 h-4 w-4" />
                      <span>Posted {formatRelativeTime(new Date(job.postedDate))}</span>
                    </div>
                  </div>
                  
                  <Separator className="mb-6" />
                  
                  <div className="flex gap-4 mb-4">
                    <Badge variant="secondary" className="bg-neutral-100 text-neutral-800">
                      {job.experienceLevel}
                    </Badge>
                    <Badge variant="secondary" className="bg-neutral-100 text-neutral-800">
                      {job.jobType}
                    </Badge>
                    <Badge variant="secondary" className="bg-neutral-100 text-neutral-800">
                      {job.workType}
                    </Badge>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center mr-3">
                        <User className="h-5 w-5" />
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
                      {job.description}
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-neutral-800 mb-3">Responsibilities</h3>
                    <ul className="list-disc list-inside space-y-2 text-neutral-600">
                      {job.responsibilities.split("\n").map((responsibility, index) => (
                        <li key={index}>{responsibility}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-neutral-800 mb-3">About company</h3>
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 rounded-md flex items-center justify-center text-white mr-3 ${
                        job.companyLogo === "bezier-curve" 
                          ? "bg-gradient-to-br from-purple-500 to-pink-500" 
                          : job.companyLogo === "user-plus" 
                          ? "bg-white border border-neutral-200 text-primary" 
                          : job.companyLogo === "font" 
                          ? "bg-gradient-to-br from-green-400 to-cyan-400" 
                          : "bg-gradient-to-br from-blue-500 to-indigo-500"
                      }`}>
                        <i className={`fas fa-${job.companyLogo || "building"} text-xl`}></i>
                      </div>
                      <div>
                        <h4 className="font-medium text-neutral-800">{job.company.toUpperCase()}</h4>
                        <a href="#" className="text-sm text-primary hover:text-primary-dark">View company profile</a>
                      </div>
                    </div>
                    
                    <p className="text-neutral-600 mb-4">
                      {job.companyDescription}
                    </p>
                    
                    <div className="flex flex-wrap gap-x-6 gap-y-3">
                      {job.companySize && (
                        <div className="flex items-center text-sm text-neutral-600">
                          <i className="fas fa-users mr-2 text-neutral-400"></i>
                          <span>{job.companySize}</span>
                        </div>
                      )}
                      <div className="flex items-center text-sm text-neutral-600">
                        <MapPin className="mr-2 text-neutral-400 h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-neutral-600">
                        <Clock className="mr-2 text-neutral-400 h-4 w-4" />
                        <span>Mon - Fri</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-neutral-200 pt-6">
                    <div className="flex justify-center">
                      <Button size="lg" onClick={handleApplyNow}>
                        Apply for this position
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-10 text-center">
                <p className="text-neutral-600">Job not found.</p>
                <Button 
                  variant="link" 
                  className="mt-4" 
                  onClick={() => navigate("/jobs")}
                >
                  Return to job listings
                </Button>
              </div>
            )}
          </div>
          
          {/* Similar Jobs Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Similar Jobs</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* This would be populated with similar jobs based on the current job's category, title, etc. */}
              {/* For this demo, we'll show a loading state */}
              {Array(3).fill(0).map((_, i) => (
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
              ))}
            </div>
          </div>
        </div>
      </main>
      
      {/* Application Form Dialog */}
      {showApplicationForm && job && (
        <JobApplicationForm 
          job={job} 
          onClose={() => setShowApplicationForm(false)} 
        />
      )}
      
      <Footer />
    </div>
  );
};

export default JobDetails;
