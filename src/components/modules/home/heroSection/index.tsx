"use client";

import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useCallback, useState } from "react";
import { ArrowDown } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const intervalId = setInterval(scrollNext, 5000); // Auto-play every 5s
    emblaApi.on("select", () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });
    return () => clearInterval(intervalId);
  }, [emblaApi, scrollNext]);

  const slides = [
    {
      title: "Unbeatable Black Friday Deals!",
      subtitle: "UP TO 70% OFF",
      description: "Save big this season with premium discounts on tech, smart accessories, home essentials, and fashion. Stock is limited!",
      gradient: "from-indigo-900 via-purple-900 to-slate-900",
      ctaText: "Shop Deals",
      ctaLink: "/products?flashSale=true",
    },
    {
      title: "Next-Gen Intelligent Gadgets",
      subtitle: "CURATED COLLECTION",
      description: "Upgrade your lifestyle with state-of-the-art wearables, premium headphones, and cutting-edge home automation.",
      gradient: "from-blue-950 via-slate-900 to-indigo-950",
      ctaText: "Explore Tech",
      ctaLink: "/products?category=67c2cd850257e84cc6603a11", // example Category ID or general
    },
    {
      title: "Elevated Home & Essentials",
      subtitle: "PREMIUM COMFORT",
      description: "Experience premium quality and sleek aesthetics with our top-rated home decor, kitchen gadgets, and organizers.",
      gradient: "from-emerald-950 via-slate-900 to-teal-950",
      ctaText: "Discover More",
      ctaLink: "/products",
    },
  ];

  return (
    <div className="relative w-full h-[60vh] md:h-[65vh] overflow-hidden bg-slate-950 text-white rounded-3xl mt-6 border border-white/10 shadow-xl">
      {/* Embla Viewport */}
      <div className="w-full h-full overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`flex-none w-full h-full bg-gradient-to-br ${slide.gradient} flex items-center px-8 md:px-20 relative`}
            >
              <div className="max-w-2xl space-y-6">
                <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest bg-primary text-primary-foreground rounded-full animate-pulse">
                  {slide.subtitle}
                </span>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight drop-shadow-md animate-in fade-in slide-in-from-bottom-5 duration-700">
                  {slide.title}
                </h1>
                <p className="text-sm md:text-lg text-slate-200/90 leading-relaxed font-light drop-shadow-sm max-w-xl">
                  {slide.description}
                </p>
                <div className="flex gap-4 pt-2">
                  <Link href={slide.ctaLink}>
                    <Button className="rounded-full px-6 py-5 bg-primary text-primary-foreground hover:bg-primary/95 text-base font-bold shadow-lg">
                      {slide.ctaText}
                    </Button>
                  </Link>
                  <Link href="/products">
                    <Button className="rounded-full px-6 py-5 border-white/20 text-white hover:bg-white/10 text-base font-semibold" variant="outline">
                      All Products
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => emblaApi && emblaApi.scrollTo(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              selectedIndex === idx ? "bg-white w-6" : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Scroll Down Flow Indicator */}
      <div className="absolute bottom-6 right-8 hidden md:flex items-center gap-2 text-xs text-white/60 font-semibold uppercase tracking-wider animate-bounce">
        <span>Scroll</span>
        <ArrowDown className="w-4 h-4" />
      </div>
    </div>
  );
}