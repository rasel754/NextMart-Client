"use client";

import React, { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Trash2, Star, Eye } from "lucide-react";
import { toast } from "sonner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { deleteReview } from "@/services/review";
import { DataTable } from "@/components/ui/core/DataTable";
import { ConfirmModal } from "@/components/ui/core/ConfirmModal";
import { IMeta } from "@/types/meta";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AdminReviewsContainerProps {
  initialReviews: any[];
  meta: IMeta | null;
}

export default function AdminReviewsContainer({
  initialReviews = [],
  meta,
}: AdminReviewsContainerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [reviews, setReviews] = useState<any[]>(initialReviews);
  const [loadingDeleteId, setLoadingDeleteId] = useState<string | null>(null);

  // Confirm delete modal state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [targetReview, setTargetReview] = useState<any>(null);

  // View details modal state
  const [viewOpen, setViewOpen] = useState(false);
  const [viewReview, setViewReview] = useState<any | null>(null);

  useEffect(() => {
    setReviews(initialReviews);
  }, [initialReviews]);

  const triggerViewDetails = (reviewObj: any) => {
    setViewReview(reviewObj);
    setViewOpen(true);
  };

  const handleDelete = async (reviewId: string) => {
    setLoadingDeleteId(reviewId);
    try {
      const res = await deleteReview(reviewId);
      if (res?.success) {
        toast.success(res?.message || "Review deleted successfully.");
        setReviews((prev) => prev.filter((r) => r._id !== reviewId));
        router.refresh();
      } else {
        toast.error(res?.message || "Failed to delete review.");
      }
    } catch {
      toast.error("An error occurred while deleting review.");
    } finally {
      setLoadingDeleteId(null);
      setDeleteOpen(false);
    }
  };

  const triggerDeleteConfirm = (reviewObj: any) => {
    setTargetReview(reviewObj);
    setDeleteOpen(true);
  };

  const currentPage = meta?.page || 1;
  const searchVal = searchParams.get("search") || "";

  // Star rating helper
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, idx) => {
          const isFilled = idx < Math.floor(rating);
          return (
            <Star
              key={idx}
              className={`w-3.5 h-3.5 ${
                isFilled
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground/30 dark:text-muted-foreground/20"
              }`}
            />
          );
        })}
      </div>
    );
  };

  // Table Columns
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "user",
      header: "Customer",
      cell: ({ row }) => {
        const u = row.original.user;
        const name = typeof u === "object" ? u?.name : "Platform Customer";
        const email = typeof u === "object" ? u?.email : row.original.userEmail;
        return (
          <div className="flex flex-col">
            <span className="font-bold text-xs text-foreground">{name}</span>
            <span className="text-[10px] text-muted-foreground font-mono">{email || "N/A"}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "product",
      header: "Product",
      cell: ({ row }) => {
        const p = row.original.product;
        const name = typeof p === "object" ? p?.name : "Catalog Product";
        return (
          <span className="font-bold text-xs text-foreground truncate max-w-[150px] block">
            {name}
          </span>
        );
      },
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => renderStars(row.original.rating || 0),
    },
    {
      accessorKey: "comment",
      header: "Review Text",
      cell: ({ row }) => {
        const text = row.original.comment || row.original.text || row.original.review || "";
        const truncated = text.length > 60 ? text.substring(0, 60) + "..." : text;
        return (
          <span className="text-xs text-muted-foreground font-medium max-w-[250px] block leading-relaxed break-words">
            {"\""}{truncated}{"\""}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground font-medium">
          {new Date(row.original.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const r = row.original;
        const isDeleting = loadingDeleteId === r._id;
        return (
          <div className="flex gap-1.5 justify-start">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full border-primary/10 text-primary hover:bg-primary/5"
              onClick={() => triggerViewDetails(r)}
            >
              <Eye className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={isDeleting}
              className="h-8 w-8 rounded-full border-red-500/10 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
              onClick={() => triggerDeleteConfirm(r)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Reviews</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Moderate platform reviews: verify user rating feedback, delete inappropriate postings.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={reviews}
        totalCount={meta?.total || reviews.length}
        currentPage={currentPage}
        pageSize={meta?.limit || 10}
        onPageChange={(page) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set("page", page.toString());
          router.push(`${pathname}?${params.toString()}`);
        }}
        onSearch={(searchVal) => {
          const params = new URLSearchParams(searchParams.toString());
          if (searchVal) {
            params.set("search", searchVal);
          } else {
            params.delete("search");
          }
          params.set("page", "1");
          router.push(`${pathname}?${params.toString()}`, { scroll: false });
        }}
        searchPlaceholder="Search reviews by user..."
        defaultSearchValue={searchVal}
      />

      <ConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => {
          if (targetReview) {
            handleDelete(targetReview._id);
          }
        }}
        title="Delete Review?"
        description="Are you sure you want to permanently delete this customer review? This action cannot be undone."
        confirmLabel="Delete Review"
        variant="danger"
        isLoading={loadingDeleteId === targetReview?._id}
      />

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-[450px] rounded-3xl p-6">
          <DialogHeader className="border-b pb-3 mb-4">
            <DialogTitle className="text-lg font-black text-foreground">
              Review Details
            </DialogTitle>
          </DialogHeader>

          {viewReview && (
            <div className="space-y-4 text-sm leading-relaxed">
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase font-black tracking-wider">Customer</span>
                <span className="font-bold text-foreground">{typeof viewReview.user === "object" ? viewReview.user.name : "Platform Customer"}</span>
                <span className="text-xs text-muted-foreground font-mono">{typeof viewReview.user === "object" ? viewReview.user.email : ""}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase font-black tracking-wider">Product</span>
                <span className="font-bold text-foreground">{typeof viewReview.product === "object" ? viewReview.product.name : "Catalog Product"}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase font-black tracking-wider">Rating</span>
                <div className="mt-1">{renderStars(viewReview.rating || 0)}</div>
              </div>

              <div className="flex flex-col bg-muted/30 dark:bg-muted/10 border border-muted-foreground/10 rounded-2xl p-4">
                <span className="text-[10px] text-muted-foreground uppercase font-black tracking-wider mb-1">Feedback Comment</span>
                <p className="text-xs text-foreground italic break-words">
                  {"\""}{viewReview.comment || viewReview.text || viewReview.review || "No feedback comment was written."}{"\""}
                </p>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase font-black tracking-wider">Date Posted</span>
                <span className="text-xs text-muted-foreground font-medium">
                  {new Date(viewReview.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 border-t pt-4 mt-2">
            <Button variant="outline" onClick={() => setViewOpen(false)} className="rounded-full font-bold h-9 text-xs px-5">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
