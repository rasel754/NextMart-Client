import { getAllReviews } from "@/services/review";
import AdminReviewsContainer from "./AdminReviewsContainer";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolvedParams = await searchParams;
  const res = await getAllReviews(resolvedParams);

  const reviews = res?.data || res?.result || [];
  const meta = res?.meta || null;

  return <AdminReviewsContainer initialReviews={reviews} meta={meta} />;
}
