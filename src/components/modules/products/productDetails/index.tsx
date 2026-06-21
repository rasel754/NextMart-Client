"use client";

import { Button } from "@/components/ui/button";
import { IProduct } from "@/types/product";
import { Star, ShoppingCart, Heart, Plus, Minus, Store, BadgeCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { addProduct } from "@/redux/featurs/cartSlice";
import { useAppDispatch } from "@/redux/hooks";
import { toast } from "sonner";
import useEmblaCarousel from "embla-carousel-react";
import ProductCard from "@/components/ui/core/ProductCard";
import { useUser } from "@/context/UserContext";
import { useWishlist } from "@/hooks/useWishlist";
import { getMyOrders } from "@/services/order";
import { createReview } from "@/services/review";
import { Textarea } from "@/components/ui/textarea";

interface ProductDetailsProps {
  product: IProduct & { reviews?: any[] };
  relatedProducts?: IProduct[];
}

export default function ProductDetails({ product, relatedProducts = [] }: ProductDetailsProps) {
  const dispatch = useAppDispatch();
  const { user } = useUser();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [activeImage, setActiveImage] = useState(product?.imageUrls?.[0] || "");
  const [quantity, setQuantity] = useState(1);

  const [isEligible, setIsEligible] = useState(false);
  const [reviewsList, setReviewsList] = useState<any[]>(product?.reviews || []);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Embla for related products
  const [emblaRef] = useEmblaCarousel({ align: "start", dragFree: true });

  const wishlisted = isWishlisted(product?._id);

  useEffect(() => {
    const checkEligibility = async () => {
      if (!user) return;
      try {
        const res = await getMyOrders({ limit: 100 });
        const orders = res?.result || res?.data || [];
        if (Array.isArray(orders)) {
          // Check completed orders with matching product id
          const hasPurchased = orders.some((order: any) => {
            const isCompleted = ["Completed", "Delivered"].includes(order.status);
            if (!isCompleted) return false;
            return order.products?.some((p: any) => {
              const prodId = p.product?._id || p.product;
              return prodId === product._id;
            });
          });
          setIsEligible(hasPurchased);
        }
      } catch (err) {
        console.error("Error checking review eligibility:", err);
      }
    };
    checkEligibility();
  }, [user, product._id]);

  const handleAddToCart = () => {
    dispatch(addProduct({ product, quantity }));
    toast.success(`Added ${quantity} item(s) of "${product.name}" to cart.`);
  };

  const handleWishlistToggle = async () => {
    await toggleWishlist(product._id);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment || comment.trim().length < 10) {
      toast.error("Please enter a review comment of at least 10 characters.");
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await createReview({
        product: product._id,
        rating,
        comment,
      });
      if (res?.success) {
        toast.success("Review submitted successfully!");
        setComment("");
        setRating(5);
        setReviewsList((prev) => [
          ...prev,
          {
            _id: res.data?._id || Math.random().toString(),
            user: { name: user?.name || "Customer" },
            rating,
            comment,
            createdAt: new Date().toISOString(),
          },
        ]);
        setIsEligible(false);
      } else {
        toast.error(res?.message || "Failed to submit review.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while submitting review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const incrementQty = () => {
    if (quantity < product.stock) {
      setQuantity((q) => q + 1);
    } else {
      toast.warning(`Only ${product.stock} items are in stock.`);
    }
  };

  const decrementQty = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const ratingValue = product.averageRating || 0;
  const ratingCount = reviewsList.length || product.ratingCount || 0;

  return (
    <div className="space-y-12 my-10">
      {/* 1. Core Info & Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left: Gallery */}
        <div className="space-y-4">
          <div className="relative w-full h-[400px] rounded-3xl overflow-hidden border bg-card/50 flex items-center justify-center">
            <Image
              src={activeImage || "https://psediting.websites.co.in/obaju-turquoise/img/product-placeholder.png"}
              alt="product image"
              fill
              className="object-contain p-4 transition duration-300"
              priority
            />
          </div>
          {/* Thumbnails strip */}
          {product?.imageUrls && product.imageUrls.length > 0 && (
            <div className="grid grid-cols-5 gap-3">
              {product.imageUrls.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative h-20 rounded-xl overflow-hidden border-2 bg-card/30 transition ${
                    activeImage === img ? "border-primary" : "border-transparent hover:border-border"
                  }`}
                >
                  <Image src={img} alt="thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="bg-card border border-border/60 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
          <div>
            <div className="flex gap-2 mb-2 items-center">
              <span className="px-2.5 py-0.5 text-xs font-bold bg-primary/10 text-primary rounded-full">
                {product?.category?.name || "eCommerce"}
              </span>
              {product?.stock > 0 ? (
                <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-500/10 text-emerald-600 rounded-full">
                  In Stock
                </span>
              ) : (
                <span className="px-2.5 py-0.5 text-xs font-bold bg-red-500/10 text-red-600 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-foreground">{product?.name}</h1>
          </div>

          {/* Rating summary */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1 bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 px-3 py-1 rounded-full font-bold">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{ratingValue.toFixed(1)}</span>
            </div>
            <span>({ratingCount} Reviews)</span>
          </div>

          <hr className="border-border/40" />

          {/* Price */}
          <div className="space-y-1">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Price</p>
            <div className="flex items-baseline gap-3">
              {product?.offerPrice ? (
                <>
                  <span className="text-3xl font-extrabold text-primary">
                    ${product.offerPrice.toLocaleString()}
                  </span>
                  <del className="text-sm font-medium text-muted-foreground">
                    ${product.price.toLocaleString()}
                  </del>
                </>
              ) : (
                <span className="text-3xl font-extrabold text-foreground">
                  ${product.price.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed text-justify">
            {product?.description}
          </p>

          <hr className="border-border/40" />

          {/* Quantity & Cart Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-muted-foreground">Quantity:</span>
              <div className="flex items-center border rounded-full px-2 py-1 bg-background">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full w-8 h-8 text-foreground"
                  disabled={quantity <= 1 || product.stock === 0}
                  onClick={decrementQty}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center text-sm font-bold">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full w-8 h-8 text-foreground"
                  disabled={quantity >= product.stock || product.stock === 0}
                  onClick={incrementQty}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                ({product.stock} items left)
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                disabled={product.stock === 0}
                onClick={handleAddToCart}
                className="flex-1 rounded-full py-6 font-bold flex gap-2 items-center justify-center text-base"
              >
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </Button>
              <Button
                onClick={handleWishlistToggle}
                variant="outline"
                className={`rounded-full p-6 transition ${
                  wishlisted ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-950/40" : "text-muted-foreground"
                }`}
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`w-5 h-5 ${wishlisted ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
            </div>
          </div>

          {/* Vendor Details */}
          {product?.shop && (
            <div className="flex items-center gap-3 bg-muted/30 border border-border/40 p-4 rounded-2xl text-sm mt-4">
              <Store className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Sold By</p>
                {product.shop.isOfficial ? (
                  <h4 className="font-bold text-blue-600 inline-flex items-center gap-1">
                    NextMart Official Store <BadgeCheck className="w-4 h-4 text-blue-600" />
                  </h4>
                ) : (
                  <Link href={`/shop/${product.shop._id}`} className="font-bold text-foreground hover:underline">
                    {product.shop.shopName}
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Specs details table */}
      {product?.specification && (
        <div className="bg-card border border-border/60 rounded-3xl p-6 md:p-8">
          <h2 className="text-xl font-bold mb-6">Specifications Details</h2>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
            {Object.entries(product.specification).map(([key, val]) => (
              <div key={key} className="flex justify-between border-b pb-2 text-sm">
                <span className="text-muted-foreground font-medium capitalize">{key}</span>
                <span className="font-bold text-foreground text-right">{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Reviews List */}
      <div className="bg-card border border-border/60 rounded-3xl p-6 md:p-8 space-y-8">
        <h2 className="text-xl font-bold">Customer Reviews</h2>
        
        {reviewsList.length > 0 ? (
          <div className="space-y-6">
            {reviewsList.map((rev, idx) => (
              <div key={idx} className="border-b pb-4 last:border-b-0 last:pb-0 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      {rev.user?.name ? rev.user.name.slice(0, 2).toUpperCase() : "US"}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">{rev.user?.name || "Customer"}</h4>
                      <p className="text-[10px] text-muted-foreground">
                        {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < rev.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-slate-200 dark:text-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground pl-10 leading-relaxed text-justify">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-6">
            No reviews yet. Be the first to review this product!
          </p>
        )}

        {/* 3a. Write a Review Form */}
        {isEligible && (
          <div className="border-t pt-6 space-y-4">
            <h3 className="text-lg font-bold">Write a Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-muted-foreground">Rating:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="text-yellow-400 hover:scale-110 transition"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-slate-300 dark:text-slate-700"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <Textarea
                  placeholder="Share your experience with this product (min 10 characters)..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="rounded-2xl border-border/80 min-h-24"
                />
              </div>
              <Button
                type="submit"
                disabled={submittingReview}
                className="rounded-full px-6 font-bold"
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          </div>
        )}
      </div>

      {/* 4. Related Products carousel */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-6">Related Products</h2>
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {relatedProducts.slice(0, 6).map((item, idx) => (
                <div key={item._id || idx} className="flex-none w-[240px]">
                  <ProductCard product={item} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}