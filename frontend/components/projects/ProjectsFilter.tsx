// frontend/components/projects/ProjectsFilter.tsx
"use client";

import React from "react";
import { Input } from "components/ui/input";
import { SearchIcon, CalendarIcon, TagIcon, Loader2, Filter } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "components/ui/popover";
import { Button } from "components/ui/button";
import { Calendar } from "components/ui/calendar";
import { format } from "date-fns";
import { cn } from "lib/utils";
import { useIsMobile } from "hooks/use-mobile";

export interface DateRange {
  from: Date | undefined;
  to?: Date | undefined;
}

interface ProjectsFilterProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  dateRange?: DateRange;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onSearchChangeTags: (val: string) => void;
  searchTermTags: string;
  isSearching?: boolean;
  isFilteringTags?: boolean;
  isFilteringDate?: boolean;
  isAnyFilterLoading?: boolean;
}

const ProjectsFilter: React.FC<ProjectsFilterProps> = ({
  searchTerm,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  onSearchChangeTags,
  searchTermTags,
  isSearching = false,
  isFilteringTags = false,
  isFilteringDate = false,
  isAnyFilterLoading = false,
}) => {
  const isMobile = useIsMobile();
  const [isFiltersExpanded, setIsFiltersExpanded] = React.useState(false);

  // Mobile layout
  if (isMobile) {
    return (
      <div className="mb-6 space-y-4">
        {/* Main search - always visible */}
        <div className="relative">
          <Input
            placeholder="Search projects..."
            className={cn(
              "pl-9 pr-9 rounded-lg transition-opacity",
              isSearching && "opacity-75"
            )}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <SearchIcon 
            size={16} 
            className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-opacity",
              isSearching && "opacity-50"
            )} 
          />
          {isSearching && (
            <Loader2 
              size={16} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 animate-spin" 
            />
          )}
        </div>

        {/* Collapsible filters button */}
        <Button
          variant="outline"
          onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
          className="w-full justify-between rounded-lg border-gray-300"
        >
          <div className="flex items-center gap-2">
            <Filter size={16} />
            <span>Advanced Filters</span>
            {(searchTermTags || dateRange?.from) && (
              <div className="h-2 w-2 bg-blue-500 rounded-full" />
            )}
          </div>
          <div className={cn(
            "transition-transform duration-200",
            isFiltersExpanded && "rotate-180"
          )}>
            ↓
          </div>
        </Button>

        {/* Expanded filters */}
        {isFiltersExpanded && (
          <div className="space-y-4 pb-2">
            {/* Tags search */}
            <div className="relative">
              <Input
                placeholder="Search by tags (urgent, important, etc.)"
                className={cn(
                  "pl-9 pr-9 rounded-lg transition-opacity",
                  isFilteringTags && "opacity-75"
                )}
                value={searchTermTags}
                onChange={(e) => onSearchChangeTags(e.target.value)}
              />
              <TagIcon 
                size={16} 
                className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-opacity",
                  isFilteringTags && "opacity-50"
                )} 
              />
              {isFilteringTags && (
                <Loader2 
                  size={16} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 animate-spin" 
                />
              )}
            </div>

            {/* Date range picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  disabled={isAnyFilterLoading}
                  className={cn(
                    "w-full justify-start text-left rounded-lg border-gray-300 text-body-text font-body transition-opacity",
                    isFilteringDate && "opacity-75"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                  {dateRange?.from && dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd/MM/yy")} – {format(dateRange.to, "dd/MM/yy")}
                    </>
                  ) : (
                    <span className="text-muted-foreground">Select date range</span>
                  )}
                  {isFilteringDate && (
                    <Loader2 className="ml-auto h-4 w-4 animate-spin text-blue-500" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0 !border-0 bg-white shadow-md">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={onDateRangeChange}
                  initialFocus
                  className="!border-0"
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    );
  }

  // Desktop/Tablet layout
  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-6">
      {/* Search input */}
      <div className="relative flex-1 lg:max-w-sm">
        <Input
          placeholder="Search projects..."
          className={cn(
            "pl-9 pr-9 rounded-none transition-opacity",
            isSearching && "opacity-75"
          )}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <SearchIcon 
          size={16} 
          className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-opacity",
            isSearching && "opacity-50"
          )} 
        />
        {isSearching && (
          <Loader2 
            size={16} 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 animate-spin" 
          />
        )}
      </div>

      {/* Tags search input */}
      <div className="relative flex-1 lg:max-w-sm">
        <Input
          placeholder="urgents, important, etc."
          className={cn(
            "pl-9 pr-9 rounded-none transition-opacity",
            // isFilteringTags && "opacity-75"
          )}
          value={searchTermTags}
          onChange={(e) => onSearchChangeTags(e.target.value)}
        />
        <TagIcon 
          size={16} 
          className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-opacity",
            isFilteringTags && "opacity-50"
          )} 
        />
        {isFilteringTags && (
          <Loader2 
            size={16} 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 animate-spin" 
          />
        )}
      </div>

      {/* Date-range picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={isAnyFilterLoading}
            className={cn(
              "w-full lg:w-[220px] justify-start text-left rounded-none border-gray-300 text-body-text font-body transition-opacity",
              isFilteringDate && "opacity-75"
            )}
          >
            {dateRange?.from && dateRange.to ? (
              <>
                {format(dateRange.from, "dd/MM/yy")} – {format(dateRange.to, "dd/MM/yy")}
              </>
            ) : (
              <span className="text-muted-foreground">DD/MM/YY – DD/MM/YY</span>
            )}
            {isFilteringDate ? (
              <Loader2 className="ml-auto h-4 w-4 animate-spin text-blue-500" />
            ) : (
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-auto p-0 !border-0 bg-white shadow-md">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={onDateRangeChange}
            initialFocus
            className="!border-0"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ProjectsFilter;
