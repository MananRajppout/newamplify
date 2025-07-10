// frontend/components/projects/ProjectMobileCard.tsx
"use client";

import React from "react";
import { IProject } from "@shared/interface/ProjectInterface";
import { Card, CardContent } from "components/ui/card";
import { Badge } from "components/ui/badge";
import CustomButton from "components/shared/CustomButton";
import { getFirstSessionDate } from "utils/getFirstSessionDate";
import { format } from "date-fns";
import { Calendar, Tag, ExternalLink, Users, Eye } from "lucide-react";
import { cn } from "lib/utils";

interface ProjectMobileCardProps {
  project: IProject;
  onRowClick: (projectId: string) => void;
  onShareClick: (project: IProject, type: "observer" | "participant") => void;
  isLoading?: boolean;
}

const ProjectMobileCard: React.FC<ProjectMobileCardProps> = ({
  project,
  onRowClick,
  onShareClick,
  isLoading = false,
}) => {
  const firstDate = getFirstSessionDate(project);

  if (isLoading) {
    return (
      <Card className="mb-4 animate-pulse">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="h-5 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="flex gap-2">
              <div className="h-8 bg-gray-200 rounded w-20" />
              <div className="h-8 bg-gray-200 rounded w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        "mb-4 cursor-pointer transition-all duration-200 hover:shadow-md border-l-4",
        project.status === "Active" && "border-l-green-500",
        project.status === "Closed" && "border-l-blue-500",
        project.status === "Draft" && "border-l-yellow-500",
        project.status === "Inactive" && "border-l-gray-500",
        project.status === "Archived" && "border-l-red-500"
      )}
      onClick={() => onRowClick(project._id)}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Project Name and Status */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 flex-1">
              {project.name}
            </h3>
            <Badge 
              variant="outline" 
              className={cn(
                "shrink-0 ml-2",
                project.status === "Active" && "border-green-500 text-green-700 bg-green-50",
                project.status === "Closed" && "border-blue-500 text-blue-700 bg-blue-50",
                project.status === "Draft" && "border-yellow-500 text-yellow-700 bg-yellow-50",
                project.status === "Inactive" && "border-gray-500 text-gray-700 bg-gray-50",
                project.status === "Archived" && "border-red-500 text-red-700 bg-red-50"
              )}
            >
              {project.status}
            </Badge>
          </div>

          {/* Tags */}
          {project.tags.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Tag size={14} className="text-gray-400 shrink-0" />
              <span className="line-clamp-1">
                {project.tags.map((t) => t.title).join(", ")}
              </span>
            </div>
          )}

          {/* Start Date */}
          {firstDate && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={14} className="text-gray-400 shrink-0" />
              <span>Start Date: {format(firstDate, "MMM dd, yyyy")}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div 
            className="flex flex-col sm:flex-row gap-2 pt-2"
            onClick={(e) => e.stopPropagation()}
          >
            <CustomButton
              size="sm"
              variant="outline"
              className="flex-1 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:text-blue-800 font-medium"
              onClick={() => onShareClick(project, "observer")}
            >
              <Eye size={14} className="mr-1" />
              Observer Link
            </CustomButton>
            <CustomButton
              size="sm"
              variant="outline"
              className="flex-1 bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800 font-medium"
              onClick={() => onShareClick(project, "participant")}
            >
              <Users size={14} className="mr-1" />
              Participant Link
            </CustomButton>
          </div>

          {/* View Details Link */}
          <div className="flex items-center justify-end pt-1">
            <div 
              className="flex items-center gap-1 text-blue-600 text-sm font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              <span>View Details</span>
              <ExternalLink size={12} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectMobileCard; 