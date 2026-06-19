import { getAllUsers } from "@/services/user";
import AdminUsersContainer from "./AdminUsersContainer";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolvedParams = await searchParams;
  const res = await getAllUsers(resolvedParams);
  
  const users = res?.data || res?.result || [];
  const meta = res?.meta || null;

  return <AdminUsersContainer initialUsers={users} meta={meta} />;
}
