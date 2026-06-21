"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Search, Database } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataTableProps<T> {
  columns: ColumnDef<T, any>[];
  data: T[];
  isLoading?: boolean;
  searchPlaceholder?: string;
  totalCount: number;
  currentPage: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  onSearch?: (value: string) => void;
  filterSlot?: React.ReactNode;
  defaultSearchValue?: string;
}

export function DataTable<T>({
  columns,
  data = [],
  isLoading = false,
  searchPlaceholder = "Search...",
  totalCount,
  currentPage,
  pageSize = 10,
  onPageChange,
  onSearch,
  filterSlot,
  defaultSearchValue = "",
}: DataTableProps<T>) {
  const [searchValue, setSearchValue] = useState(defaultSearchValue);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Sync state if prop changes
  useEffect(() => {
    setSearchValue(defaultSearchValue);
  }, [defaultSearchValue]);

  // Store onSearch in a ref to avoid dependency changes triggering effect
  const onSearchRef = useRef(onSearch);
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  // Debounced search logic (400ms)
  useEffect(() => {
    if (!onSearchRef.current) return;

    // Skip if search value is same as the prop value
    if (searchValue === defaultSearchValue) {
      return;
    }

    const delayDebounce = setTimeout(() => {
      onSearchRef.current?.(searchValue);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchValue, defaultSearchValue]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // Determine standard pagination layout with ellipsis (max 5 buttons visible + ellipsis)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  const startResultIdx = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endResultIdx = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="w-full space-y-4">
      {/* Top search & filter row */}
      {(onSearch || filterSlot) && (
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {onSearch ? (
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-9 h-9 rounded-full focus-visible:ring-primary bg-card"
              />
            </div>
          ) : (
            <div />
          )}
          {filterSlot && <div className="flex items-center gap-2 w-full sm:w-auto justify-end">{filterSlot}</div>}
        </div>
      )}

      {/* Main table container */}
      <div className="overflow-x-auto rounded-3xl border border-border/60 bg-card shadow-sm">
        <Table className="relative min-w-full">
          <TableHeader className="bg-muted/40 sticky top-0 backdrop-blur-sm z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-10 text-xs font-bold text-muted-foreground uppercase tracking-wider px-4 py-3">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // 5 Skeleton rows matching columns count
              Array.from({ length: 5 }).map((_, rIdx) => (
                <TableRow key={rIdx}>
                  {columns.map((_, cIdx) => (
                    <TableCell key={cIdx} className="px-4 py-3">
                      <Skeleton className="h-5 w-full rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/30 transition-colors border-b border-border/40">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-3.5 align-middle text-sm font-medium">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              // Empty State Row
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="h-48 text-center px-4 py-12">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                      <Database className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-sm text-foreground">No data found</h3>
                    <p className="text-xs text-muted-foreground">There are no records matching your query.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-muted-foreground font-medium">
            Showing <span className="font-bold text-foreground">{startResultIdx}</span>–
            <span className="font-bold text-foreground">{endResultIdx}</span> of{" "}
            <span className="font-bold text-foreground">{totalCount}</span> results
          </p>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-8 h-8"
              disabled={currentPage <= 1 || isLoading}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {getPageNumbers().map((page, idx) => {
              const isCurrent = page === currentPage;
              if (page === "...") {
                return (
                  <span key={idx} className="w-8 h-8 flex items-center justify-center text-xs text-muted-foreground">
                    ...
                  </span>
                );
              }
              return (
                <Button
                  key={idx}
                  variant={isCurrent ? "default" : "outline"}
                  className={cn(
                    "rounded-full w-8 h-8 text-xs font-semibold p-0",
                    isCurrent ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted/50"
                  )}
                  disabled={isLoading}
                  onClick={() => onPageChange(page as number)}
                >
                  {page}
                </Button>
              );
            })}

            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-8 h-8"
              disabled={currentPage >= totalPages || isLoading}
              onClick={() => onPageChange(currentPage + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
