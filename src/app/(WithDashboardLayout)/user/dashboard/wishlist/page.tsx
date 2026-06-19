import { getWishlist } from "@/services/product";
import ProductCard from "@/components/ui/core/ProductCard";
import { IProduct } from "@/types/product";

export default async function UserWishlistPage() {
  const res = await getWishlist();
  const wishlist = res?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">My Wishlist</h1>
        <p className="text-xs text-muted-foreground">Manage and purchase items you have saved.</p>
      </div>

      {wishlist && wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product: IProduct, idx: number) => (
            <ProductCard key={product._id || idx} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-3xl text-center p-6 bg-card/40">
          <h3 className="text-lg font-bold mb-1">Your Wishlist is Empty</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Save items to your wishlist while browsing, and they will show up here.
          </p>
        </div>
      )}
    </div>
  );
}
