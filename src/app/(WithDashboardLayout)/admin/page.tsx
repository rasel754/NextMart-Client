import { getAdminMeta } from "@/services/meta";
import AdminDashboardOverview from "./AdminDashboardOverview";

export default async function AdminDashboardPage() {
  const res = await getAdminMeta();
  const metaData = res?.data || null;

  return (
    <div>
      {metaData ? (
        <AdminDashboardOverview metaData={metaData} />
      ) : (
        <div className="text-center py-20 bg-card border rounded-3xl">
          <p className="text-muted-foreground text-sm">Failed to retrieve admin analytics. Please make sure you are logged in as admin.</p>
        </div>
      )}
    </div>
  );
}
