import { getAllBrands } from "@/services/Brand";
import AdminBrandsContainer from "./AdminBrandsContainer";

export default async function AdminBrandsPage() {
  const res = await getAllBrands();
  const brands = res?.data || [];

  return <AdminBrandsContainer initialBrands={brands} />;
}
