"use client";

import { FolderSearch, Search, Calendar, Tag } from "lucide-react";
import { cn } from "lib/utils";

interface NoSearchResultProps {
  className?: string;
  hasActiveFilters?: boolean;
  filterTypes?: string[]; // e.g., ["search", "tags", "dateRange"]
  title?: string;
  description?: string;
}

const NoSearchResult = ({ 
  className,
  hasActiveFilters = false,
  filterTypes = [],
  title,
  description
}: NoSearchResultProps) => {
  const getIcon = () => {
    if (filterTypes.includes("search")) return <Search className="h-28 w-28 text-gray-200" />;
    if (filterTypes.includes("tags")) return <Tag className="h-28 w-28 text-gray-200" />;
    if (filterTypes.includes("dateRange")) return <Calendar className="h-28 w-28 text-gray-200" />;
    return <FolderSearch className="h-28 w-28 text-gray-200" />;
  };

  const getTitle = () => {
    if (title) return title;
    if (hasActiveFilters) return "NO RESULTS FOUND";
    return "NO PROJECTS YET";
  };

  const getDescription = () => {
    if (description) return description;
    
    if (hasActiveFilters) {
      if (filterTypes.includes("search") && filterTypes.includes("tags")) {
        return "No projects match your search term and tags. Try adjusting your filters.";
      }
      if (filterTypes.includes("search") && filterTypes.includes("dateRange")) {
        return "No projects match your search term and date range. Try adjusting your filters.";
      }
      if (filterTypes.includes("tags") && filterTypes.includes("dateRange")) {
        return "No projects match your tags and date range. Try adjusting your filters.";
      }
      if (filterTypes.includes("search")) {
        return "No projects match your search term. Try a different keyword.";
      }
      if (filterTypes.includes("tags")) {
        return "No projects match your selected tags. Try different tags.";
      }
      if (filterTypes.includes("dateRange")) {
        return "No projects found in the selected date range. Try a different period.";
      }
      return "No projects match your current filters. Try adjusting your search criteria.";
    }
    
    return "You haven't created any projects yet. Create your first project to get started.";
  };

  return (
    <div className={cn("flex justify-center items-center py-10", className)}>
      <div className="flex flex-col justify-center items-center gap-5 pt-20">
        {getIcon()}
        <h1 className="text-blue-900 text-3xl font-bold text-center">
          {getTitle()}
        </h1>
        <p className="text-center text-xl text-blue-950 max-w-2xl">
          {getDescription()}
        </p>
      </div>
    </div>
  );
};

export default NoSearchResult;
