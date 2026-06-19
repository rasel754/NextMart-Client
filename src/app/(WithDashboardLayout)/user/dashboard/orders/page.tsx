import { getMyOrders } from "@/services/order";
import UserOrdersContainer from "./UserOrdersContainer";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function UserOrdersPage({ searchParams }: { searchParams: SearchParams }) {
  const resolvedParams = await searchParams;
  const res = await getMyOrders(resolvedParams);
  
  const orders = res?.result || res?.data || [];
  const meta = res?.meta || null;

  return <UserOrdersContainer orders={orders} meta={meta} />;
}
