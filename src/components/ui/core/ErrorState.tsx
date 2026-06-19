"use client";

import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[300px] border border-border/60 bg-card rounded-3xl shadow-sm text-center">
      <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center text-red-600 dark:text-red-400 mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-foreground mb-1">Failed to load data</h3>
      <p className="text-xs text-muted-foreground max-w-sm mb-5 leading-relaxed">{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          className="rounded-full flex gap-1.5 items-center font-bold px-4 h-9 border-primary/20 text-primary hover:bg-primary/5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Try Again
        </Button>
      )}
    </div>
  );
}
