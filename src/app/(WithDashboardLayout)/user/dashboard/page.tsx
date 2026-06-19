import { getMyOrders } from "@/services/order";
import UserDashboardOverview from "./UserDashboardOverview";

export default async function UserDashboard() {
  const res = await getMyOrders({ limit: 100 });
  const orders = res?.result || res?.data || [];

  return <UserDashboardOverview orders={orders} />;
}
