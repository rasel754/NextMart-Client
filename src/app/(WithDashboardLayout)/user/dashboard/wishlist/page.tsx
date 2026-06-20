"use client";

import ProductCard from "@/components/ui/core/ProductCard";
import { useWishlist } from "@/hooks/useWishlist";
import { IProduct } from "@/types/product";
import { Heart, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UserWishlistPage() {
  const { wishlist, refreshWishlist } = useWishlist();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      await refreshWishlist();
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
          <Heart className="w-12 h-12 text-muted-foreground mb-3" />
          <h3 className="text-lg font-bold mb-1">Your Wishlist is Empty</h3>
          <p className="text-sm text-muted-foreground max-w-sm mb-4">
            Save items to your wishlist while browsing, and they will show up here.
          </p>
          <Button asChild className="rounded-full">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
