import { getMyProfile } from "@/services/user";
import AdminProfileContainer from "./AdminProfileContainer";

export default async function AdminProfilePage() {
  const res = await getMyProfile();
  const userProfile = res?.data || null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Profile Settings</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage your administrator profile details and security configurations.
        </p>
      </div>

      {userProfile ? (
        <AdminProfileContainer userProfile={userProfile} />
      ) : (
        <div className="text-center py-20 bg-card border border-border/60 rounded-3xl">
          <p className="text-muted-foreground text-sm">
            Failed to load profile. Please log in again.
          </p>
        </div>
      )}
    </div>
  );
}
