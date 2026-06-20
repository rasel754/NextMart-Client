import { Skeleton } from "@/components/ui/skeleton";

export default function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/60 overflow-hidden bg-card/50 flex flex-col h-full shadow-sm">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-3 flex-grow">
        <Skeleton className="h-3.5 w-1/4 rounded-full" />
        <Skeleton className="h-5 w-full rounded-md" />
        <Skeleton className="h-5 w-2/3 rounded-md" />
        <Skeleton className="h-4 w-1/3 rounded-full mt-2" />
        <Skeleton className="h-6 w-1/2 rounded-md mt-3" />
      </div>
      <div className="p-4 pt-0 mt-auto flex gap-2">
        <Skeleton className="h-9 flex-grow rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
      </div>
    </div>
  );
}
