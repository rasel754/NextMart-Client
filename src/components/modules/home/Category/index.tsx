import { Button } from "@/components/ui/button";
import CategoryCard from "@/components/ui/core/CategoryCard";
import NMContainer from "@/components/ui/core/NMContainer";
import { getAllCategories } from "@/services/Category";
import { ICategory } from "@/types";
import Link from "next/link";

const Category = async () => {
  const { data: categories } = await getAllCategories();
  return (
  <NMContainer>
      <div className="container mx-auto my-20">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-2xl">Category</h2>
        <Link href="/products">
          <Button variant="outline" className="rounded-full">
            View All
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-6 my-5">
        {categories && categories.length > 0 ? (
          categories.slice(0, 12).map((category: ICategory, idx: number) => (
            <Link key={category._id || idx} href={`/products?category=${category._id}`}>
              <div className="transform transition duration-300 hover:scale-105 cursor-pointer">
                <CategoryCard category={category} />
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center text-muted-foreground col-span-full py-6">
            No categories found.
          </p>
        )}
      </div>
    </div>
  </NMContainer>
  );
};

export default Category;