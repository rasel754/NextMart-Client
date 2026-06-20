"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Ghost, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center space-y-6">
      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-muted-foreground animate-bounce">
        <Ghost className="w-12 h-12" />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-foreground tracking-tight sm:text-5xl">
          404 — Page Not Found
        </h1>
        <p className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
      </div>

      <div className="pt-2">
        <Button asChild className="rounded-full px-6 font-bold py-6 text-sm flex gap-2 items-center justify-center">
          <Link href="/">
            <Home className="w-4 h-4" /> Go Back Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
