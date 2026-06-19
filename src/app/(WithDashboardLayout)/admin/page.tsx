import { getAdminMeta } from "@/services/meta";
import { getAllOrders } from "@/services/order";
import AdminDashboardOverview from "./AdminDashboardOverview";

export default async function AdminDashboardPage() {
  const [metaRes, ordersRes] = await Promise.all([
    getAdminMeta(),
    getAllOrders({ limit: 5 }),
  ]);

  const metaData = metaRes?.data || null;
  const recentOrders = ordersRes?.data || ordersRes?.result || [];

  return (
    <div>
      {metaData ? (
        <AdminDashboardOverview metaData={metaData} recentOrders={recentOrders} />
      ) : (
        <div className="text-center py-20 bg-card border rounded-3xl">
          <p className="text-muted-foreground text-sm">
            Failed to retrieve admin analytics. Please make sure you are logged in as admin.
          </p>
        </div>
      )}
    </div>
  );
}
