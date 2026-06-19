"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DashboardTableSkeletonProps {
  rows?: number;
}

export function DashboardTableSkeleton({ rows = 5 }: DashboardTableSkeletonProps) {
  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-between items-center gap-4">
        <Skeleton className="h-9 w-64 rounded-full" />
        <Skeleton className="h-9 w-32 rounded-full" />
      </div>
      <div className="overflow-x-auto rounded-3xl border border-border/60 bg-card shadow-sm">
        <Table className="min-w-full">
          <TableHeader className="bg-muted/40">
            <TableRow>
              {Array.from({ length: 5 }).map((_, idx) => (
                <TableHead key={idx} className="h-10 px-4 py-3">
                  <Skeleton className="h-4 w-20 rounded" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, rIdx) => (
              <TableRow key={rIdx} className="border-b border-border/40">
                {Array.from({ length: 5 }).map((_, cIdx) => (
                  <TableCell key={cIdx} className="px-4 py-3.5">
                    <Skeleton className="h-5 w-full rounded" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
