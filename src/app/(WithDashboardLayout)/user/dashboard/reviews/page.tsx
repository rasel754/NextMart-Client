"use client";

import { useEffect, useState } from "react";
import { getMyReviews, updateReview, deleteReview } from "@/services/review";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Star, Pencil, Trash, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmModal } from "@/components/ui/core/ConfirmModal";
import Link from "next/link";

export default function UserReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit State
  const [editingReview, setEditingReview] = useState<any | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [submittingEdit, setSubmittingEdit] = useState(false);

  // Delete State
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [submittingDelete, setSubmittingDelete] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await getMyReviews();
      const list = res?.data || res?.result || [];
      setReviews(list);
    } catch (err) {
      console.error("Failed to load reviews:", err);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleEditClick = (rev: any) => {
    setEditingReview(rev);
    setEditRating(rev.rating);
    setEditComment(rev.comment);
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editComment || editComment.trim().length < 10) {
      toast.error("Please enter a review comment of at least 10 characters.");
      return;
    }
    setSubmittingEdit(true);
    try {
      const res = await updateReview(editingReview._id, {
        rating: editRating,
        comment: editComment,
      });
      if (res?.success) {
        toast.success("Review updated successfully!");
        setIsEditOpen(false);
        await fetchReviews();
      } else {
        toast.error(res?.message || "Failed to update review.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while updating review.");
    } finally {
      setSubmittingEdit(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeletingReviewId(id);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingReviewId) return;
    setSubmittingDelete(true);
    try {
      const res = await deleteReview(deletingReviewId);
      if (res?.success) {
        toast.success("Review deleted successfully.");
        setIsDeleteOpen(false);
        await fetchReviews();
      } else {
        toast.error(res?.message || "Failed to delete review.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while deleting review.");
    } finally {
      setSubmittingDelete(false);
      setDeletingReviewId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">My Reviews</h1>
        <p className="text-xs text-muted-foreground">Manage and track your product feedback.</p>
      </div>

      {reviews.length > 0 ? (
        <div className="bg-card border border-border/60 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Reviewed On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((rev: any) => (
                  <TableRow key={rev._id}>
                    <TableCell className="font-bold text-xs max-w-[180px] truncate">
                      {rev.product?.name || "Product Item"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-slate-200 dark:text-slate-700"
                            }`}
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-sm truncate leading-relaxed">
                      {rev.comment}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full h-8 w-8 hover:bg-muted"
                          onClick={() => handleEditClick(rev)}
                          title="Edit Review"
                        >
                          <Pencil className="w-3.5 h-3.5 text-muted-foreground hover:text-primary" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full h-8 w-8 hover:bg-red-50 dark:hover:bg-red-950/40"
                          onClick={() => handleDeleteClick(rev._id)}
                          title="Delete Review"
                        >
                          <Trash className="w-3.5 h-3.5 text-red-500/50 hover:text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-3xl text-center p-6 bg-card/40">
          <Star className="w-12 h-12 text-muted-foreground mb-3" />
          <h3 className="text-lg font-bold mb-1">No Reviews Found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mb-4">
            You haven&apos;t written any reviews yet. Buy products first to review them!
          </p>
          <Button asChild className="rounded-full">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Edit Review</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-muted-foreground">Rating:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setEditRating(star)}
                    className="text-yellow-400 hover:scale-110 transition"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= editRating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-slate-300 dark:text-slate-700"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground">Comment</span>
              <Textarea
                placeholder="Share your experience..."
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                className="rounded-2xl border-border/80 min-h-24"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" className="rounded-full" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submittingEdit} className="rounded-full px-6">
                {submittingEdit ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Review?"
        description="Are you absolutely sure? This action cannot be undone. This will permanently delete your review from the product."
        confirmLabel="Delete Review"
        isLoading={submittingDelete}
        variant="danger"
      />
    </div>
  );
}
