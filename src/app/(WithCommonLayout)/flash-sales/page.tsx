"use client";

import { useEffect, useState } from "react";
import { getFlashSaleProducts } from "@/services/FlashSale";
import { useCart } from "@/hooks/useCart";
import { IProduct } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Loader2, Sparkles, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import NMContainer from "@/components/ui/core/NMContainer";
import ProductBanner from "@/components/modules/products/banner";

interface FlashSaleTimerProps {
  endTime: string;
}

const FlashSaleTimer = ({ endTime }: FlashSaleTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(endTime).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <div className="flex gap-1.5 justify-center items-center font-mono">
      <div className="bg-red-500/10 text-red-600 dark:text-red-400 px-2 py-1 rounded-lg flex flex-col items-center min-w-10">
        <span className="text-xs font-black">{timeLeft.days}</span>
        <span className="text-[7px] font-bold uppercase">Days</span>
      </div>
      <span className="text-red-500 font-bold text-xs">:</span>
      <div className="bg-red-500/10 text-red-600 dark:text-red-400 px-2 py-1 rounded-lg flex flex-col items-center min-w-10">
        <span className="text-xs font-black">{timeLeft.hours.toString().padStart(2, "0")}</span>
        <span className="text-[7px] font-bold uppercase">Hrs</span>
      </div>
      <span className="text-red-500 font-bold text-xs">:</span>
      <div className="bg-red-500/10 text-red-600 dark:text-red-400 px-2 py-1 rounded-lg flex flex-col items-center min-w-10">
        <span className="text-xs font-black">{timeLeft.minutes.toString().padStart(2, "0")}</span>
        <span className="text-[7px] font-bold uppercase">Min</span>
      </div>
      <span className="text-red-500 font-bold text-xs">:</span>
      <div className="bg-red-500/10 text-red-600 dark:text-red-400 px-2 py-1 rounded-lg flex flex-col items-center min-w-10">
        <span className="text-xs font-black">{timeLeft.seconds.toString().padStart(2, "0")}</span>
        <span className="text-[7px] font-bold uppercase">Sec</span>
      </div>
    </div>
  );
};

export default function FlashSalesPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFlashSales = async () => {
      try {
        const res = await getFlashSaleProducts();
        if (res?.success) {
          // Filter only active flash sales
          const now = Date.now();
          const activeSales = (res.data || []).filter((fs: any) => {
            const start = new Date(fs.startTime).getTime();
            const end = new Date(fs.endTime).getTime();
            return now >= start && now <= end;
          });
          setSales(activeSales);
        }
      } catch (err) {
        console.error("Failed to load flash sales", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFlashSales();
  }, []);

  const handleAddToCart = (product: IProduct, discountPercent: number) => {
    const offerPrice = product.price - (product.price * discountPercent) / 100;
    const modifiedProduct = {
      ...product,
      offerPrice,
    };
    addToCart(modifiedProduct, 1);
    toast.success(`Added "${product.name}" to cart at flash sale price!`);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <NMContainer>
      <ProductBanner title="Flash Sales" path="Home - Flash Sales" />

      <div className="my-10 space-y-6">
        <div className="flex items-center gap-2 text-foreground font-black text-xl">
          <Sparkles className="w-6 h-6 text-red-500 animate-pulse" />
          <h2>Active Promotions</h2>
        </div>

        {sales.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sales.map((sale) => {
              const product = sale.product;
              if (!product) return null;
              
              const discount = sale.discountPercentage || 0;
              const flashPrice = product.price - (product.price * discount) / 100;

              return (
                <div
                  key={sale._id}
                  className="group relative flex flex-col h-full rounded-2xl overflow-hidden border border-border/60 bg-card hover:shadow-lg transition-all duration-300 p-4 space-y-4"
                >
                  {/* Badges */}
                  <span className="absolute top-6 left-6 z-10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-red-500 text-white rounded-full shadow-sm">
                    {discount}% OFF
                  </span>

                  {/* Image */}
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-muted/40 shrink-0">
                    <Image
                      src={product.imageUrls?.[0] || "https://psediting.websites.co.in/obaju-turquoise/img/product-placeholder.png"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Title & Info */}
                  <div className="flex-grow space-y-2">
                    <Link href={`/products/${product._id}`} className="block">
                      <h4 className="font-bold text-sm text-foreground hover:text-primary transition-colors line-clamp-2 h-10 leading-tight">
                        {product.name}
                      </h4>
                    </Link>

                    {/* Ratings */}
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-foreground">
                        {product.averageRating ? product.averageRating.toFixed(1) : "0.0"}
                      </span>
                    </div>

                    {/* Strikethrough Price */}
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="font-extrabold text-base text-primary">${flashPrice.toLocaleString()}</span>
                      <del className="text-xs text-muted-foreground font-medium">${product.price.toLocaleString()}</del>
                    </div>
                  </div>

                  {/* Live Timer */}
                  <div className="border-t border-border/40 pt-3">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase text-center mb-2 tracking-wider">
                      Ends In
                    </p>
                    <FlashSaleTimer endTime={sale.endTime} />
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="flex-grow rounded-full text-xs font-semibold py-4"
                    >
                      <Link href={`/products/${product._id}`} className="flex items-center justify-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> Details
                      </Link>
                    </Button>
                    <Button
                      onClick={() => handleAddToCart(product, discount)}
                      size="sm"
                      className="w-10 h-10 p-0 flex items-center justify-center rounded-full shrink-0"
                      title="Add to Cart"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-3xl text-center p-6 bg-card/40">
            <Sparkles className="w-12 h-12 text-muted-foreground mb-3" />
            <h3 className="text-lg font-bold mb-1">No Active Flash Sales</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-4">
              There are no active flash sales running right now. Check back later for sweet deals!
            </p>
            <Button asChild className="rounded-full">
              <Link href="/products">Browse All Products</Link>
            </Button>
          </div>
        )}
      </div>
    </NMContainer>
  );
}
