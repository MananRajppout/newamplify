// frontend/components/projects/ProjectsTable.tsx
import React from "react";
import { IProject } from "@shared/interface/ProjectInterface";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "components/ui/table";
import ProjectRow from "./ProjectRow";
import ProjectMobileCard from "./ProjectMobileCard";
import { ChevronUp, ChevronDown, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "lib/utils";
import { useIsMobile } from "hooks/use-mobile";

type SortField = "name" | "startDate" | "status" | "createdAt";
type SortDirection = "asc" | "desc";

interface SortConfig {
  field: SortField | null;
  direction: SortDirection;
}

interface ProjectsTableProps {
  filteredProjects: IProject[];
  isLoading: boolean;
  sortConfig: SortConfig;
  onSort: (field: SortField) => void;
  onRowClick: (projectId: string) => void;
  onShareClick: (project: IProject, type: "observer" | "participant") => void;
}

interface SortableHeaderProps {
  field: SortField;
  label: string;
  sortConfig: SortConfig;
  onSort: (field: SortField) => void;
  className?: string;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({
  field,
  label,
  sortConfig,
  onSort,
  className,
}) => {
  const getSortIcon = () => {
    if (sortConfig.field !== field) {
      return <ChevronsUpDown className="h-4 w-4 text-gray-400" />;
    }
    return sortConfig.direction === "asc" 
      ? <ChevronUp className="h-4 w-4 text-blue-600" />
      : <ChevronDown className="h-4 w-4 text-blue-600" />;
  };

  return (
    <TableHead 
      className={`cursor-pointer select-none hover:bg-gray-50 transition-colors ${className || ""}`}
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        <span>{label}</span>
        {getSortIcon()}
      </div>
    </TableHead>
  );
};

const ProjectsTable: React.FC<ProjectsTableProps> = ({
  filteredProjects,
  isLoading,
  sortConfig,
  onSort,
  onRowClick,
  onShareClick,
}) => {
  const isMobile = useIsMobile();

  // Mobile Card Layout
  if (isMobile) {
    return (
      <div className="space-y-4">
        {/* Loading overlay for mobile */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2 text-blue-600 bg-white px-4 py-2 rounded-lg shadow-sm border">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm font-medium">Loading projects...</span>
            </div>
          </div>
        )}
        
        {/* Mobile project cards */}
        {isLoading
          ? [...Array(3)].map((_, idx) => (
              <ProjectMobileCard
                key={`skeleton-${idx}`}
                project={{} as IProject}
                onRowClick={onRowClick}
                onShareClick={onShareClick}
                isLoading={true}
              />
            ))
          : filteredProjects.map((project) => (
              <ProjectMobileCard
                key={project._id}
                project={project}
                onRowClick={onRowClick}
                onShareClick={onShareClick}
                isLoading={false}
              />
            ))}
      </div>
    );
  }

  // Desktop/Tablet Table Layout
  return (
    <div className="bg-white shadow-all-sides overflow-hidden rounded-md relative">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[0.5px] z-10 flex items-center justify-center">
          <div className="flex items-center gap-2 text-blue-600 bg-white px-4 py-2 rounded-lg shadow-sm border">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm font-medium">Loading projects...</span>
          </div>
        </div>
      )}
      
      {/* Horizontal scroll container for tablets */}
      <div className="overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader className="bg-light-gray text-body-text font-header font-bold">
            <TableRow>
              <SortableHeader
                field="name"
                label="Project Name"
                sortConfig={sortConfig}
                onSort={onSort}
                className="min-w-[200px]"
              />
              <TableHead className="min-w-[150px]">Tags</TableHead>
              <SortableHeader
                field="status"
                label="Status"
                sortConfig={sortConfig}
                onSort={onSort}
                className="min-w-[100px]"
              />
              <SortableHeader
                field="startDate"
                label="Start Date"
                sortConfig={sortConfig}
                onSort={onSort}
                className="min-w-[120px]"
              />
              <TableHead className="text-center min-w-[280px]">Share</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className={cn(
            "divide-y divide-gray-200 transition-opacity duration-200",
            isLoading && "opacity-50"
          )}>
            {isLoading
              ? [...Array(5)].map((_, idx) => (
                  <TableRow key={`skeleton-${idx}`}>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))
              : filteredProjects.map((project) => (
                  <ProjectRow
                    key={project._id}
                    project={project}
                    onRowClick={onRowClick}
                    onShareClick={onShareClick}
                  />
                ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProjectsTable;
