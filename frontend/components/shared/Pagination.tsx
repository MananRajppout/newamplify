
import { Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink, } from "components/ui/pagination";

export default function CustomPagination({
  totalPages,
  currentPage,
  onPageChange,
}: {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  const generatePages = (): (number | "…")[] => {
    // If total pages is 7 or less, show all pages
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "…")[] = [];
    
    // Always show first page
    pages.push(1);
    
    if (currentPage <= 3) {
      // If current page is near the beginning (1, 2, 3)
      // Show: 1, 2, 3, 4, ..., last
      pages.push(2, 3, 4);
      if (totalPages > 5) {
        pages.push("…");
      }
      if (totalPages > 4) {
        pages.push(totalPages);
      }
    } else if (currentPage >= totalPages - 2) {
      // If current page is near the end
      // Show: 1, ..., last-3, last-2, last-1, last
      if (totalPages > 4) {
        pages.push("…");
      }
      pages.push(totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      // Current page is in the middle
      // Show: 1, ..., current-1, current, current+1, ..., last
      pages.push("…");
      pages.push(currentPage - 1, currentPage, currentPage + 1);
      pages.push("…");
      pages.push(totalPages);
    }
    
    // Remove duplicates and filter out invalid pages
    const uniquePages = pages.filter((page, index, arr) => {
      if (typeof page === "string") return true;
      return page >= 1 && page <= totalPages && arr.indexOf(page) === index;
    });
    
    return uniquePages;
  };

  const pages = generatePages();

  return (
    <Pagination className="flex mt-6">
      <PaginationContent>
        {pages.map((p, idx) =>
          typeof p === "number" ? (
            <PaginationItem key={p}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(p);
                }}
                className={`
                  w-9 h-9 flex items-center justify-center
                  rounded-md text-sm font-medium
                  ${currentPage === p
                    ? "bg-custom-dark-blue-1 text-white"
                    : "text-gray-600 hover:bg-gray-100"}
                `}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ) : (
            <PaginationItem key={`dot-${idx}`} className="pointer-events-none">
              <span className="w-9 h-9 flex items-center justify-center text-gray-400">
                {p}
              </span>
            </PaginationItem>
          )
        )}
      </PaginationContent>
    </Pagination>
  );
}
