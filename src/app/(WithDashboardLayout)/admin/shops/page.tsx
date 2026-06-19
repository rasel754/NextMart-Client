import { getAllShops } from "@/services/Shop";
import AdminShopsContainer from "./AdminShopsContainer";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminShopsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolvedParams = await searchParams;
  const res = await getAllShops(resolvedParams);

  const shops = res?.data || res?.result || [];
  const meta = res?.meta || null;

  return <AdminShopsContainer initialShops={shops} meta={meta} />;
}
