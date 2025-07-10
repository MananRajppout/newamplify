// frontend/components/projects/ProjectsHeader.tsx
"use client";

import React from "react";
import { Plus } from "lucide-react";
import HeadingBlue25px from "components/HeadingBlue25pxComponent";
import CustomButton from "components/shared/CustomButton";
import { useIsMobile } from "hooks/use-mobile";

interface ProjectsHeaderProps {
  onCreateClick: () => void;
}

const ProjectsHeader: React.FC<ProjectsHeaderProps> = ({ onCreateClick }) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
      <HeadingBlue25px>Projects Dashboard</HeadingBlue25px>
      <CustomButton
        icon={<Plus size={isMobile ? 18 : 20} />}
        className="bg-custom-orange-1 hover:bg-custom-orange-2 text-custom-white w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3"
        onClick={onCreateClick}
      >
        {isMobile ? "Create Project" : "Create New Project"}
      </CustomButton>
    </div>
  );
};

export default ProjectsHeader;
