"use client";

import React from "react";
import { FolderOpen } from "lucide-react";

interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode;
}

export function EmptyState({ message, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[300px] border border-border/60 bg-card rounded-3xl shadow-sm text-center">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
        {icon || <FolderOpen className="w-6 h-6" />}
      </div>
      <h3 className="text-base font-bold text-foreground mb-1">No results found</h3>
      <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">{message}</p>
    </div>
  );
}
