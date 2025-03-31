import React from "react";

const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className="flex items-center">
      <div className={`h-8 w-8 bg-primary rounded-md flex items-center justify-center mr-2 ${className}`}>
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm4 1a1 1 0 00-1 1v6a1 1 0 001 1h1a1 1 0 001-1V7a1 1 0 00-1-1H7zm5-1a1 1 0 011 1v8a1 1 0 01-1 1h-1a1 1 0 01-1-1V6a1 1 0 011-1h1z"></path>
        </svg>
      </div>
      <span className="text-lg font-semibold text-neutral-800">Brivio</span>
    </div>
  );
};

export default Logo;
