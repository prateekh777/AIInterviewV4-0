import React, { useState } from "react";
import { useLocation } from "wouter";
import { Job } from "@shared/schema";
import { Heart } from "lucide-react";
import { Building, MapPin, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface JobListItemProps {
  job: Job;
  isSelected?: boolean;
  onSave?: (jobId: number) => void;
  isSaved?: boolean;
  userId?: number | null;
}

const getIconByName = (iconName: string | undefined) => {
  switch (iconName) {
    case "bezier-curve":
      return "fas fa-bezier-curve";
    case "user-plus":
      return "fas fa-user-plus";
    case "font":
      return "fas fa-font";
    case "pen-fancy":
      return "fas fa-pen-fancy";
    default:
      return "fas fa-briefcase";
  }
};

const getIconColorClass = (iconName: string | undefined) => {
  switch (iconName) {
    case "bezier-curve":
      return "bg-gradient-to-br from-purple-500 to-pink-500";
    case "user-plus":
      return "bg-white border border-neutral-200 text-primary";
    case "font":
      return "bg-gradient-to-br from-green-400 to-cyan-400";
    case "pen-fancy":
      return "bg-gradient-to-br from-blue-500 to-indigo-500";
    default:
      return "bg-gradient-to-br from-purple-500 to-pink-500";
  }
};

const JobListItem: React.FC<JobListItemProps> = ({
  job,
  isSelected = false,
  onSave,
  isSaved = false,
  userId = null,
}) => {
  const [, navigate] = useLocation();
  const [isHovering, setIsHovering] = useState(false);
  const [saved, setSaved] = useState(isSaved);
  const { toast } = useToast();

  const handleJobClick = () => {
    navigate(`/jobs/${job.id}`);
  };

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save jobs",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (saved) {
        await apiRequest("DELETE", `/api/jobs/${job.id}/save?userId=${userId}`, undefined);
      } else {
        await apiRequest("POST", `/api/jobs/${job.id}/save`, { userId });
      }
      
      setSaved(!saved);
      if (onSave) {
        onSave(job.id);
      }
      
      toast({
        title: saved ? "Job removed from saved jobs" : "Job saved successfully",
        description: saved ? "You can add it back anytime" : "You can view it in your saved jobs",
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

  const iconClass = getIconColorClass(job.companyLogo);
  const iconName = getIconByName(job.companyLogo);

  return (
    <div
      className={cn(
        "bg-white rounded-lg border p-4 cursor-pointer hover:shadow-md transition duration-150",
        isSelected ? "border-primary-light" : "border-neutral-200",
        isHovering ? "shadow-md" : ""
      )}
      onClick={handleJobClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-md ${iconClass} flex items-center justify-center text-white mr-3`}>
            <i className={iconName}></i>
          </div>
          <div>
            <h3 className="font-medium text-neutral-800">{job.title}</h3>
            <p className="text-sm text-neutral-500">{job.salary}</p>
          </div>
        </div>
        <button
          className={`text-neutral-400 hover:text-primary ${saved ? "text-primary" : ""}`}
          onClick={handleSaveClick}
        >
          <Heart className={`h-5 w-5 ${saved ? "fill-current" : ""}`} />
        </button>
      </div>
      
      <div className="space-y-2 mb-3">
        <div className="flex items-center text-sm text-neutral-600">
          <Building className="w-4 h-4 mr-2 text-neutral-400" />
          <span>{job.company}</span>
        </div>
        <div className="flex items-center text-sm text-neutral-600">
          <MapPin className="w-4 h-4 mr-2 text-neutral-400" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center text-sm text-neutral-600">
          <Briefcase className="w-4 h-4 mr-2 text-neutral-400" />
          <span>{job.workType}</span>
        </div>
      </div>
    </div>
  );
};

export default JobListItem;
