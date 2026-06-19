import { getAllProducts } from "@/services/product";
import { getAllCategories } from "@/services/Category";
import { getAllBrands } from "@/services/Brand";
import AdminProductsContainer from "./AdminProductsContainer";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolvedParams = await searchParams;
  
  const [productsRes, categoriesRes, brandsRes] = await Promise.all([
    getAllProducts(resolvedParams),
    getAllCategories(),
    getAllBrands(),
  ]);

  const products = productsRes?.data || productsRes?.result || [];
  const meta = productsRes?.meta || null;
  const categories = categoriesRes?.data || [];
  const brands = brandsRes?.data || [];

  return (
    <AdminProductsContainer
      initialProducts={products}
      meta={meta}
      categories={categories}
      brands={brands}
    />
  );
}
