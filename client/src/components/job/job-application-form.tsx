import React, { useContext, useState, useRef } from "react";
import { Job } from "@shared/schema";
import { X, Upload, ArrowLeft, MapPin, Briefcase, DollarSign, Laptop } from "lucide-react";
import { AuthContext } from "@/App";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { useQueryClient } from "@tanstack/react-query";

interface JobApplicationFormProps {
  job: Job;
  onClose: () => void;
}

const JobApplicationForm: React.FC<JobApplicationFormProps> = ({ job, onClose }) => {
  const { user } = useContext(AuthContext);
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [resumeName, setResumeName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Check file type
      if (file.type !== "application/pdf" && !file.name.endsWith(".docx")) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or DOCX file",
          variant: "destructive",
        });
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setResume(file);
      setResumeName(file.name);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      // Check file type
      if (file.type !== "application/pdf" && !file.name.endsWith(".docx")) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or DOCX file",
          variant: "destructive",
        });
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setResume(file);
      setResumeName(file.name);
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!fullName || !email || !phone) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (!resume) {
      toast({
        title: "Resume required",
        description: "Please upload your resume",
        variant: "destructive",
      });
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real application, you would upload the file to a storage service
      // and get back a URL to store in the database
      // For this example, we'll just use the filename
      const resumeUrl = resumeName;
      
      await apiRequest("POST", `/api/jobs/${job.id}/apply`, {
        userId: user?.id || 0,
        fullName,
        email,
        phone,
        resume: resumeUrl,
        coverLetter: coverLetter || null,
      });
      
      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully",
      });
      
      // Invalidate the applications queries to refresh the data
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/applications`] });
      
      onClose();
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Application failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-neutral-200 p-4">
          <div className="flex items-center text-neutral-600">
            <button 
              onClick={onClose}
              className="mr-3 hover:text-primary transition duration-150"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <span>View job post</span>
          </div>
          <button 
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 transition duration-150"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600 overflow-hidden">
          {/* We could use background image, but for this example we'll just use gradient */}
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-1">{job.title}</h2>
            <div className="flex flex-wrap gap-3 mb-2">
              <div className="flex items-center text-sm text-neutral-600">
                <MapPin className="h-4 w-4 mr-2 text-neutral-400" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center text-sm text-neutral-600">
                <Laptop className="h-4 w-4 mr-2 text-neutral-400" />
                <span>{job.workType}</span>
              </div>
              <div className="flex items-center text-sm text-neutral-600">
                <Briefcase className="h-4 w-4 mr-2 text-neutral-400" />
                <span>{job.jobType}</span>
              </div>
              <div className="flex items-center text-sm text-neutral-600">
                <DollarSign className="h-4 w-4 mr-2 text-neutral-400" />
                <span>{job.salary}</span>
              </div>
            </div>
          </div>
          
          <div className="border-b border-neutral-200 pb-4 mb-6">
            <div className="flex space-x-4">
              <button className="text-neutral-600 py-2 border-b-2 border-transparent hover:text-neutral-800 transition duration-150">
                Information
              </button>
              <button className="text-primary font-medium py-2 border-b-2 border-primary">
                Application
              </button>
            </div>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="full-name" className="block text-sm font-medium text-neutral-700 mb-1">
                Full Name
              </Label>
              <Input 
                type="text" 
                id="full-name" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2.5 bg-neutral-50 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-primary"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                  Email
                </Label>
                <Input 
                  type="email" 
                  id="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
                  Phone
                </Label>
                <Input 
                  type="tel" 
                  id="phone" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="cover-letter" className="block text-sm font-medium text-neutral-700 mb-1">
                Cover letter
              </Label>
              <Textarea 
                id="cover-letter" 
                rows={4} 
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full p-2.5 bg-neutral-50 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label className="block text-sm font-medium text-neutral-700">
                  Education (Optional)
                </Label>
                <Button 
                  type="button" 
                  variant="link"
                  className="text-primary hover:text-primary-dark text-sm font-medium"
                >
                  + Add
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="resume" className="block text-sm font-medium text-neutral-700 mb-1">
                Resume
              </Label>
              <div 
                className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center bg-neutral-50"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input 
                  type="file" 
                  id="resume" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                />
                
                {resume ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Upload className="h-5 w-5 text-primary" />
                    <span className="text-neutral-800">{resumeName}</span>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setResume(null);
                        setResumeName("");
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="mb-3 text-neutral-500">
                      Drop files here<br />
                      Supported format: pdf, docx
                    </div>
                    <div className="text-neutral-500 mb-4">OR</div>
                    <Button 
                      type="button" 
                      variant="link"
                      className="text-primary hover:text-primary-dark font-medium"
                      onClick={handleBrowseClick}
                    >
                      Browse files
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            <div className="border-t border-neutral-200 pt-6">
              <Button 
                type="submit" 
                className="w-full py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition duration-150"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationForm;
