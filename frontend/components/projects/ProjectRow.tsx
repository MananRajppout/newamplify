// frontend/components/projects/ProjectRow.tsx
"use client";

import React from "react";
import { IProject } from "@shared/interface/ProjectInterface";
import {
  TableRow,
  TableCell,
} from "components/ui/table";
import { Badge } from "components/ui/badge";
import CustomButton from "components/shared/CustomButton";
import { getFirstSessionDate } from "utils/getFirstSessionDate";
import { format } from "date-fns";

interface ProjectRowProps {
  project: IProject;
  onRowClick: (projectId: string) => void;
  onShareClick: (project: IProject, type: "observer" | "participant") => void;
}

const ProjectRow: React.FC<ProjectRowProps> = ({
  project,
  onRowClick,
  onShareClick,
}) => {
  const firstDate = getFirstSessionDate(project);

  return (
    <TableRow
      // Entire row is clickable:
      className="cursor-pointer hover:bg-gray-50 text-body-text font-header"
      onClick={() => onRowClick(project._id)}
    >
      {/* 1) Project Name */}
      <TableCell className="font-medium">
        <div className="truncate max-w-[200px] lg:max-w-none">
          {project.name}
        </div>
      </TableCell>

      {/* 2) Tags */}
      <TableCell>
        <div className="truncate max-w-[150px] lg:max-w-none">
          {project.tags.length > 0
            ? project.tags.map((t) => t.title).join(", ")
            : "—"}
        </div>
      </TableCell>

      {/* 3) Status */}
      <TableCell>
        <Badge variant="outline" className="text-xs whitespace-nowrap">
          {project.status}
        </Badge>
      </TableCell>

      {/* 4) First Session / Start Date */}
      <TableCell>
        <span className="text-sm whitespace-nowrap">
          {firstDate ? format(firstDate, "MM/dd/yyyy") : "—"}
        </span>
      </TableCell>

      {/* 5) Share Buttons: stop propagation so row click still works */}
      <TableCell
        className="text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col xl:flex-row gap-1 xl:gap-2 xl:justify-center">
          <CustomButton
            size="sm"
            variant="outline"
            className="bg-primary-blue text-white font-body hover:bg-primary-blue hover:text-white font-medium text-xs px-2 py-1"
            onClick={() => onShareClick(project, "observer")}
          >
            Observer
          </CustomButton>
          <CustomButton
            size="sm"
            variant="outline"
            className="bg-primary-blue text-white font-body hover:bg-primary-blue hover:text-white font-medium text-xs px-2 py-1"
            onClick={() => onShareClick(project, "participant")}
          >
            Participant
          </CustomButton>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ProjectRow;
