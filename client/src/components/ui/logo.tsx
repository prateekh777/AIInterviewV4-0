import React from "react";

const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className="flex items-center">
      <div className={`h-8 w-8 bg-primary rounded-md flex items-center justify-center mr-2 ${className}`}>
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
        </svg>
      </div>
      <span className="text-lg font-semibold text-neutral-800">TalentFlow</span>
    </div>
  );
};

export default Logo;
