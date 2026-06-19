import { getAllCategories } from "@/services/Category";
import AdminCategoriesContainer from "./AdminCategoriesContainer";

export default async function AdminCategoriesPage() {
  const res = await getAllCategories();
  const categories = res?.data || [];

  return <AdminCategoriesContainer initialCategories={categories} />;
}
