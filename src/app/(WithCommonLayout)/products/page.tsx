import AllProducts from "@/components/modules/products";
import ProductBanner from "@/components/modules/products/banner";
import CategoryCard from "@/components/ui/core/CategoryCard";
import NMContainer from "@/components/ui/core/NMContainer";
import { getAllCategories } from "@/services/Category";
import { getAllProducts } from "@/services/product";
import { ICategory } from "@/types";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const AllProductsPage = async ({ searchParams }: { searchParams: SearchParams }) => {
  const resolvedParams = await searchParams;
  const { data: categories } = await getAllCategories();
  const res = await getAllProducts(resolvedParams);
  
  const products = res?.data || [];
  const meta = res?.meta || null;

  return (
    <NMContainer>
      <ProductBanner title="All Products" path="Home - Products" />
      
      <h2 className="text-xl font-bold my-5">Featured Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 my-5">
        {categories?.slice(0, 6).map((category: ICategory, idx: number) => (
          <CategoryCard key={category._id || idx} category={category} />
        ))}
      </div>
      
      <AllProducts products={products} meta={meta} />
    </NMContainer>
  );
};

export default AllProductsPage;