"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { IProduct } from "@/types/product";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const wishlisted = isWishlisted(product._id);
  const isDiscounted = !!product.offerPrice;
  const discountPercent = isDiscounted
    ? Math.round(((product.price - (product.offerPrice || 0)) / product.price) * 100)
    : 0;

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast.success(`Added "${product.name}" to cart!`);
  };

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(product._id);
  };

  return (
    <Card className="group relative flex flex-col h-full rounded-2xl overflow-hidden border border-border/60 bg-card hover:shadow-lg transition-all duration-300">
      {/* Absolute Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {isDiscounted && (
          <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-red-500 text-white rounded-full shadow-sm">
            {discountPercent}% OFF
          </span>
        )}
        {product.stock === 0 && (
          <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-destructive text-destructive-foreground rounded-full shadow-sm">
            Sold Out
          </span>
        )}
      </div>

      <button
        onClick={handleWishlistClick}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/40 text-muted-foreground hover:text-red-500 hover:scale-105 transition-all duration-200"
        title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={`w-4 h-4 transition-colors ${wishlisted ? "fill-red-500 text-red-500" : ""}`} />
      </button>

      {/* Image Header */}
      <CardHeader className="relative p-0 aspect-square w-full bg-muted/20 overflow-hidden">
        <Image
          src={
            product?.imageUrls?.[0] ||
            "https://psediting.websites.co.in/obaju-turquoise/img/product-placeholder.png"
          }
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] flex items-center justify-center">
            <span className="text-sm font-black text-muted-foreground uppercase tracking-widest">Out of Stock</span>
          </div>
        )}
      </CardHeader>

      {/* Card Body */}
      <CardContent className="flex-grow p-4 space-y-2">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          {product.category?.name || "eCommerce"}
        </p>

        <Link href={`/products/${product._id}`} className="block">
          <CardTitle
            title={product.name}
            className="font-bold text-sm text-foreground hover:text-primary transition-colors line-clamp-2 h-10 leading-tight"
          >
            {product.name}
          </CardTitle>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 text-xs">
          <div className="flex items-center text-yellow-400">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          </div>
          <span className="font-bold text-foreground">
            {product.averageRating ? product.averageRating.toFixed(1) : "0.0"}
          </span>
          <span className="text-muted-foreground font-medium">
            ({product.ratingCount || 0})
          </span>
        </div>

        {/* Price Row */}
        <div className="flex items-baseline gap-2 pt-1">
          {isDiscounted ? (
            <>
              <span className="font-extrabold text-base text-primary">
                ${product.offerPrice?.toLocaleString()}
              </span>
              <del className="text-xs text-muted-foreground font-medium">
                ${product.price.toLocaleString()}
              </del>
            </>
          ) : (
            <span className="font-extrabold text-base text-foreground">
              ${product.price.toLocaleString()}
            </span>
          )}
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-4 pt-0 mt-auto flex gap-2">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="flex-grow rounded-full text-xs font-semibold py-4"
        >
          <Link href={`/products/${product._id}`} className="flex items-center justify-center gap-1.5">
            <Eye className="w-3.5 h-3.5" /> Details
          </Link>
        </Button>
        <Button
          onClick={handleAddToCartClick}
          disabled={product.stock === 0}
          size="sm"
          className="w-10 h-10 p-0 flex items-center justify-center rounded-full shrink-0"
          title="Add to Cart"
        >
          <ShoppingCart className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
