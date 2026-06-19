"use client";

import useEmblaCarousel from "embla-carousel-react";
import ProductCard from "@/components/ui/core/ProductCard";
import { IProduct } from "@/types/product";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback } from "react";

export default function FlashSaleCarousel({ products }: { products: IProduct[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (!products || products.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No flash sale products available.
      </p>
    );
  }

  return (
    <div className="relative">
      {/* Embla Viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {products.map((product: IProduct, idx: number) => (
            <div
              key={product._id || idx}
              className="flex-none w-[280px] sm:w-[300px] md:w-[240px] lg:w-[230px]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={scrollPrev}
        className="absolute top-1/2 -left-4 md:-left-6 transform -translate-y-1/2 p-2 rounded-full bg-card border border-border/80 text-foreground shadow-md hover:bg-muted transition"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute top-1/2 -right-4 md:-right-6 transform -translate-y-1/2 p-2 rounded-full bg-card border border-border/80 text-foreground shadow-md hover:bg-muted transition"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
