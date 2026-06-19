import { getAllOrders } from "@/services/order";
import AdminOrdersContainer from "./AdminOrdersContainer";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminOrdersPage({ searchParams }: { searchParams: SearchParams }) {
  const resolvedParams = await searchParams;
  const res = await getAllOrders(resolvedParams);
  
  const orders = res?.result || res?.data || [];
  const meta = res?.meta || null;

  return <AdminOrdersContainer orders={orders} meta={meta} />;
}
