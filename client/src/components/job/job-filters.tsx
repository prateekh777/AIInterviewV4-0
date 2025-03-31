import React, { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface JobFiltersProps {
  onSearch: (query: string, filters: any) => void;
  initialQuery?: string;
}

const JobFilters: React.FC<JobFiltersProps> = ({ 
  onSearch,
  initialQuery = "",
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [workType, setWorkType] = useState("");

  const handleSearch = () => {
    onSearch(query, {
      location,
      jobType,
      experienceLevel,
      companyType,
      workType
    });
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleClearFilter = () => {
    setQuery("");
    setLocation("");
    setJobType("");
    setExperienceLevel("");
    setCompanyType("");
    setWorkType("");
    
    onSearch("", {});
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="mb-6 bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-neutral-400" />
            </div>
            <Input
              type="text"
              value={query}
              onChange={handleQueryChange}
              onKeyPress={handleKeyPress}
              className="pl-10 pr-3 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Job title, keywords, or company"
            />
          </div>
        </div>
        
        <div>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-full py-2.5 px-3 border border-neutral-300 rounded-lg">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Remote">Remote</SelectItem>
                <SelectItem value="New York">New York, USA</SelectItem>
                <SelectItem value="San Francisco">San Francisco, CA</SelectItem>
                <SelectItem value="Tucson">Tucson, AZ</SelectItem>
                <SelectItem value="Columbus">Columbus, OH</SelectItem>
                <SelectItem value="Denver">Denver, CO</SelectItem>
                <SelectItem value="Tulsa">Tulsa, OK</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Select value={jobType} onValueChange={setJobType}>
            <SelectTrigger className="w-full py-2.5 px-3 border border-neutral-300 rounded-lg">
              <SelectValue placeholder="Job type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Select value={experienceLevel} onValueChange={setExperienceLevel}>
            <SelectTrigger className="w-full py-2.5 px-3 border border-neutral-300 rounded-lg">
              <SelectValue placeholder="Experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Entry-level">Entry Level</SelectItem>
                <SelectItem value="Mid-level">Mid Level</SelectItem>
                <SelectItem value="Senior-level">Senior Level</SelectItem>
                <SelectItem value="Director">Director</SelectItem>
                <SelectItem value="Executive">Executive</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-between mt-4">
        <div className="flex space-x-4 items-center">
          <Select value={workType} onValueChange={setWorkType}>
            <SelectTrigger className="w-full py-2.5 px-3 border border-neutral-300 rounded-lg">
              <SelectValue placeholder="Work type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Remote">Remote</SelectItem>
                <SelectItem value="Onsite">Onsite</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <Button
          variant="link"
          className="text-primary hover:text-primary-dark text-sm font-medium"
          onClick={handleClearFilter}
        >
          Clear filter
        </Button>
      </div>

      <div className="mt-4">
        <Button 
          className="w-full md:w-auto"
          onClick={handleSearch}
        >
          Search Jobs
        </Button>
      </div>
    </div>
  );
};

export default JobFilters;
