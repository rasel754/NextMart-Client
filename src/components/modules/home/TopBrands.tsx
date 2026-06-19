"use client";

import { useEffect, useState } from "react";
import NMContainer from "@/components/ui/core/NMContainer";
import { getAllBrands } from "@/services/Brand";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";

export default function TopBrands() {
  const [brands, setBrands] = useState<{ _id: string; name: string; logo?: string }[]>([]);
  const [emblaRef] = useEmblaCarousel({ align: "start", dragFree: true });

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await getAllBrands();
        if (res?.success && res.data) {
          setBrands(res.data);
        }
      } catch (err) {
        console.error("Failed to load brands:", err);
      }
    };
    fetchBrands();
  }, []);

  const fallbackBrands = [
    { _id: "", name: "Apex", logo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&h=60&fit=crop&q=60" },
    { _id: "", name: "Samsung", logo: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=120&h=60&fit=crop&q=60" },
    { _id: "", name: "Apple", logo: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=120&h=60&fit=crop&q=60" },
    { _id: "", name: "Sony", logo: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=120&h=60&fit=crop&q=60" },
    { _id: "", name: "Dell", logo: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=120&h=60&fit=crop&q=60" },
    { _id: "", name: "HP", logo: "https://images.unsplash.com/photo-1589561084283-930aa7b1ce50?w=120&h=60&fit=crop&q=60" },
  ];

  const brandList = brands.length > 0 ? brands : fallbackBrands;

  return (
    <NMContainer>
      <div className="my-16">
        <h2 className="font-bold text-2xl mb-8">Top Brands</h2>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {brandList.map((brand, idx) => (
              <div
                key={brand._id || idx}
                className="flex-none w-[180px] p-6 bg-card border border-border/60 rounded-2xl flex flex-col items-center justify-center text-center hover:shadow-md transition"
              >
                {brand.logo ? (
                  <div className="relative w-24 h-12 mb-2">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      className="object-contain filter grayscale hover:grayscale-0 transition duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-12 flex items-center justify-center bg-muted/50 rounded-lg mb-2">
                    <span className="font-bold text-muted-foreground">{brand.name}</span>
                  </div>
                )}
                <Link
                  href={`/products?brand=${brand._id || ""}`}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  View Products
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </NMContainer>
  );
}
