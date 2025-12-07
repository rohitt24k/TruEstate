import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

function PaginationData({
  paginationData,
  onPageChange,
  onLimitChange,
  isLoading,
}: {
  paginationData?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  isLoading: boolean;
}) {
  const currentLimit = paginationData?.limit || 10;

  const [currentPage, setCurrentPage] = useState(paginationData?.page || 1);
  const [totalPages, setTotalPages] = useState(paginationData?.totalPages || 1);

  useEffect(() => {
    if (paginationData) {
      setCurrentPage(paginationData.page);
      setTotalPages(paginationData.totalPages);
    }
  }, [paginationData]);

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const window = 2; // # of pages to show around current

    if (totalPages <= 7) {
      return [...Array(totalPages)].map((_, i) => i + 1);
    }

    // Always include first page
    pages.push(1);

    // Show left ellipsis if needed
    if (currentPage > window + 2) {
      pages.push("ellipsis");
    }

    // Middle pages around current
    const startPage = Math.max(2, currentPage - window);
    const endPage = Math.min(totalPages - 1, currentPage + window);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Show right ellipsis if needed
    if (currentPage < totalPages - (window + 1)) {
      pages.push("ellipsis");
    }

    // Always include last page
    pages.push(totalPages);

    return pages;
  };

  const handlePageChange = (page: number) => {
    onPageChange(page);
    setCurrentPage(page);
  };

  return (
    <div className="no-scrollbar flex flex-col overflow-x-auto px-4 pb-4">
      <Pagination>
        <PaginationContent className="w-full justify-between!">
          <Select
            onValueChange={(value) => onLimitChange(Number(value))}
            value={String(currentLimit)}
          >
            <SelectTrigger className="bg-gray-90 h-7!rounded! border-none shadow-none">
              <SelectValue className="text-gray-20 text-base font-medium!" />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50, 100].map((limitOption) => (
                <SelectItem key={limitOption} value={String(limitOption)}>
                  {limitOption} / page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex shrink-0 items-center gap-1">
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                aria-disabled={!paginationData?.hasPreviousPage || isLoading}
                className={
                  !paginationData?.hasPreviousPage
                    ? "pointer-events-none opacity-50"
                    : undefined
                }
              />
            </PaginationItem>

            {getPageNumbers().map((item, index) =>
              item === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={item}>
                  <PaginationLink
                    onClick={() => handlePageChange(item as number)}
                    isActive={item === currentPage}
                    aria-disabled={isLoading}
                    size={"default"}
                  >
                    {item}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  handlePageChange(Math.min(currentPage + 1, totalPages))
                }
                aria-disabled={!paginationData?.hasNextPage || isLoading}
                className={
                  !paginationData?.hasNextPage
                    ? "pointer-events-none opacity-50"
                    : undefined
                }
              />
            </PaginationItem>
            <PaginationItem className="shrink-0">
              <div className="flex items-center gap-2 pl-4">
                <p className="gray-20 text-sm text-nowrap">Go to</p>
                <input
                  className="bg-gray-90 border-gray-80 h-7 w-12 rounded border p-2 outline-none"
                  onBlur={(e) => {
                    if (
                      Number(e.target.value) &&
                      Number(e.target.value) <= totalPages
                    )
                      handlePageChange(Number(e.target.value));
                    e.target.value = "";
                  }}
                />
                <p className="text-gray-20 text-sm text-nowrap">Page</p>
              </div>
            </PaginationItem>
          </div>
          <p className="text-gray-30 mr-4 text-sm font-medium max-lg:hidden">
            {currentPage} of {totalPages}
          </p>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export default PaginationData;
