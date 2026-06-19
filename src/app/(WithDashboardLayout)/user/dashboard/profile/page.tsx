import { getMyProfile } from "@/services/user";
import UserProfileSettings from "./UserProfileSettings";

export default async function UserProfilePage() {
  const res = await getMyProfile();
  const userProfile = res?.data || null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Profile Settings</h1>
        <p className="text-xs text-muted-foreground">Manage your customer profile and update password.</p>
      </div>

      {userProfile ? (
        <UserProfileSettings userProfile={userProfile} />
      ) : (
        <div className="text-center py-20 bg-card border rounded-3xl">
          <p className="text-muted-foreground text-sm">Failed to load profile. Please log in again.</p>
        </div>
      )}
    </div>
  );
}
