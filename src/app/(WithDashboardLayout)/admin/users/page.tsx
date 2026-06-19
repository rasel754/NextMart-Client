import { getAllUsers } from "@/services/user";
import AdminUsersContainer from "./AdminUsersContainer";

export default async function AdminUsersPage() {
  const res = await getAllUsers();
  const users = res?.data || res?.result || [];

  return <AdminUsersContainer initialUsers={users} />;
}
