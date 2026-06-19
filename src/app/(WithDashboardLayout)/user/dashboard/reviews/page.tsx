import { getMyReviews } from "@/services/review";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Star } from "lucide-react";

export default async function UserReviewsPage() {
  const res = await getMyReviews();
  // We can handle if result is directly under data or result
  const reviews = res?.data || res?.result || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">My Reviews</h1>
        <p className="text-xs text-muted-foreground">Manage and track your product feedback.</p>
      </div>

      <div className="bg-card border border-border/60 rounded-3xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Reviewed On</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.length > 0 ? (
              reviews.map((rev: any) => (
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
                  <TableCell className="text-xs text-muted-foreground shrink-0">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-muted-foreground text-xs">
                  No reviews submitted yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
