import { useMemo } from "react";

interface UsePaginationParams {
  total: number;
  pageSize: number;
  currentPage: number;
}

export const usePagination = ({ total, pageSize, currentPage }: UsePaginationParams) => {
  const totalPages = Math.ceil(total / pageSize) || 1;

  const pages = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);

  const hasNext = currentPage < totalPages;
  const hasPrev = currentPage > 1;

  return {
    pages,
    hasNext,
    hasPrev,
    totalPages,
  };
};
