import { Button } from "@/components/ui/button";
import NMContainer from "@/components/ui/core/NMContainer";
import ProductCard from "@/components/ui/core/ProductCard";
import { getAllProducts } from "@/services/product";
import { IProduct } from "@/types/product";
import Link from "next/link";

const FeaturedProducts = async () => {
  const { data: products } = await getAllProducts();

  return (
   <NMContainer>
     <div className="bg-white bg-opacity-50 py-10">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-2xl">Featured Products</h2>
          <Link href="/products">
            <Button variant="outline" className="rounded-full">
              All Collection
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-5">
          {products && products.length > 0 ? (
            products.slice(0, 8).map((product: IProduct, idx: number) => (
              <ProductCard key={product._id || idx} product={product} />
            ))
          ) : (
            <p className="text-center text-muted-foreground col-span-full py-8">
              No products found.
            </p>
          )}
        </div>
      </div>
    </div>
   </NMContainer>
  );
};

export default FeaturedProducts;