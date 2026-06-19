"use client";

import React, { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { deleteReview } from "@/services/review";
import { DataTable } from "@/components/ui/core/DataTable";
import { ConfirmModal } from "@/components/ui/core/ConfirmModal";
import { IMeta } from "@/types/meta";

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

  useEffect(() => {
    setReviews(initialReviews);
  }, [initialReviews]);

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
          <Button
            variant="outline"
            size="icon"
            disabled={isDeleting}
            className="h-8 w-8 rounded-full border-red-500/10 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
            onClick={() => triggerDeleteConfirm(r)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
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
    </div>
  );
}
