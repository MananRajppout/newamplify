"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useGlobalContext } from "context/GlobalContext";
import { IProject } from "@shared/interface/ProjectInterface";
import NoSearchResult from "components/NoSearchResult";
import { useRouter } from "next/navigation";
import { Card } from "components/ui/card";
import { toast } from "sonner";
import { useProjectFilter } from "hooks/useProjectFilter";
import { useProjects } from "hooks/useProjects";
import ProjectsHeader from "components/projects/ProjectsHeader";
import ProjectsFilter from "components/projects/ProjectsFilter";
import ProjectsPagination from "components/projects/ProjectsPagination";
import ProjectsTable from "components/projects/ProjectsTable";
import ShareProjectModal from "components/projects/ShareProjectModal";

interface DateRange {
  from: Date | undefined;
  to?: Date | undefined;
}

type SortField = "name" | "startDate" | "status" | "createdAt";
type SortDirection = "asc" | "desc";

interface SortConfig {
  field: SortField | null;
  direction: SortDirection;
}

const Projects: React.FC = () => {
  const { user } = useGlobalContext();
  const router = useRouter();
  const userId = user?._id;
  
  // UI state for immediate feedback
  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchTermTagsInputValue, setSearchTermTagsInputValue] = useState("");
  
  // Debounced values for API calls
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermTags, setSearchTermTags] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: null,
    direction: "asc",
  });
  
  // Loading states for individual filters
  const [isSearching, setIsSearching] = useState(false);
  const [isFilteringTags, setIsFilteringTags] = useState(false);
  const [isFilteringDate, setIsFilteringDate] = useState(false);

  const limit = 10;
  
  // Modal state
  const [activeShareType, setActiveShareType] = useState<
    "observer" | "participant" | null
  >(null);
  const [shareProject, setShareProject] = useState<IProject | null>(null);

  // Debounce search term
  useEffect(() => {
    setIsSearching(true);
    const debounceTimer = setTimeout(() => {
      setSearchTerm(searchInputValue);
      setIsSearching(false);
    }, 300);

    return () => {
      clearTimeout(debounceTimer);
      setIsSearching(false);
    };
  }, [searchInputValue]);

  // Debounce tag search
  useEffect(() => {
    setIsFilteringTags(true);
    const debounceTimer = setTimeout(() => {
      setSearchTermTags(searchTermTagsInputValue);
      setIsFilteringTags(false);
    }, 300);

    return () => {
      clearTimeout(debounceTimer);
      setIsFilteringTags(false);
    };
  }, [searchTermTagsInputValue]);

  // Date range loading effect
  useEffect(() => {
    setIsFilteringDate(true);
    const timer = setTimeout(() => {
      setIsFilteringDate(false);
    }, 150);

    return () => {
      clearTimeout(timer);
      setIsFilteringDate(false);
    };
  }, [dateRange]);

  // ---- useProjects hook ----
  const { projects, meta, isLoading, error } = useProjects({
    userId,
    page,
    limit,
    search: searchTerm,
    tags: searchTermTags,
  });

  const filtered = useProjectFilter(projects, searchTerm, dateRange);

  // Sorting function
  const sortProjects = (projects: IProject[], sortConfig: SortConfig): IProject[] => {
    if (!sortConfig.field) return projects;

    return [...projects].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortConfig.field) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "startDate":
          aValue = new Date(a.startDate);
          bValue = new Date(b.startDate);
          break;
        case "status":
          aValue = a.status.toLowerCase();
          bValue = b.status.toLowerCase();
          break;
        case "createdAt":
          aValue = new Date(a.createdAt || 0);
          bValue = new Date(b.createdAt || 0);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  // Apply sorting to filtered projects
  const sortedProjects = sortProjects(filtered, sortConfig);

  // Handle sort
  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Check if any filter is currently loading
  const isAnyFilterLoading = isSearching || isFilteringTags || isFilteringDate;

  // Determine active filter types for NoSearchResult context
  const getActiveFilterTypes = (): string[] => {
    const activeFilters: string[] = [];
    if (searchTerm.trim()) activeFilters.push("search");
    if (searchTermTags.trim()) activeFilters.push("tags");
    if (dateRange?.from) activeFilters.push("dateRange");
    return activeFilters;
  };

  const hasActiveFilters = Boolean(searchTerm.trim() || searchTermTags.trim() || dateRange?.from);
  const activeFilterTypes = getActiveFilterTypes();

  if (!userId) {
    return <p>User not found or not authenticated.</p>;
  }

  if (error) {
    toast.error(error instanceof Error ? error.message : "Unknown error");
    return <p className="p-6 text-red-600"></p>;
  }

  return (
    <div className="p-4 sm:p-6">
      {/* heading and upload button */}
      <ProjectsHeader onCreateClick={() => router.push("/create-project")} />

      <ProjectsFilter
        searchTerm={searchInputValue}
        onSearchChange={(v) => {
          setSearchInputValue(v);
          setPage(1);
        }}
        dateRange={dateRange}
        onDateRangeChange={(r) => {
          setDateRange(r);
          setPage(1);
        }}
        onSearchChangeTags={(v) => {
          setSearchTermTagsInputValue(v);
          setPage(1);
        }}
        searchTermTags={searchTermTagsInputValue}
        isSearching={isSearching}
        isFilteringTags={isFilteringTags}
        isFilteringDate={isFilteringDate}
        isAnyFilterLoading={isAnyFilterLoading}
      />
      
      <div className="md:hidden">
        {/* Mobile: No card wrapper, direct display */}
        {sortedProjects.length === 0 && !isLoading && !isAnyFilterLoading ? (
          <NoSearchResult 
            hasActiveFilters={hasActiveFilters}
            filterTypes={activeFilterTypes}
          />
        ) : (
          <ProjectsTable
            filteredProjects={sortedProjects}
            isLoading={isLoading || isAnyFilterLoading}
            sortConfig={sortConfig}
            onSort={handleSort}
            onRowClick={(projectId: string) => {
              router.push(`/view-project/${projectId}`);
            }}
            onShareClick={(project, type) => {
              setShareProject(project);
              setActiveShareType(type);
            }}
          />
        )}

        <ProjectsPagination
          totalPages={meta.totalPages}
          currentPage={page}
          onPageChange={(newPage) => {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </div>

      <div className="hidden md:block">
        {/* Desktop/Tablet: Card wrapper */}
        <Card className="shadow-all-sides border-0 rounded-md !p-0">
          <div className="shadow-all-sides border-0 rounded-md">
            {sortedProjects.length === 0 && !isLoading && !isAnyFilterLoading ? (
              <NoSearchResult 
                hasActiveFilters={hasActiveFilters}
                filterTypes={activeFilterTypes}
              />
            ) : (
              <ProjectsTable
                filteredProjects={sortedProjects}
                isLoading={isLoading || isAnyFilterLoading}
                sortConfig={sortConfig}
                onSort={handleSort}
                onRowClick={(projectId: string) => {
                  router.push(`/view-project/${projectId}`);
                }}
                onShareClick={(project, type) => {
                  setShareProject(project);
                  setActiveShareType(type);
                }}
              />
            )}

            <ProjectsPagination
              totalPages={meta.totalPages}
              currentPage={page}
              onPageChange={(newPage) => {
                setPage(newPage);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        </Card>
      </div>
      
      {/* Share Modal */}
      <ShareProjectModal
        open={Boolean(activeShareType && shareProject)}
        shareType={activeShareType}
        project={shareProject}
        onClose={() => {
          setActiveShareType(null);
          setShareProject(null);
        }}
      />
    </div>
  );
};

export default Projects;
