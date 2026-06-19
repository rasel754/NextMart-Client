"use client";

import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getAllCategories } from "@/services/Category";
import { getAllBrands } from "@/services/Brand";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FilterSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [price, setPrice] = useState([500000]);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [brands, setBrands] = useState<{ _id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [{ data: categoriesData }, { data: brandsData }] =
          await Promise.all([getAllCategories(), getAllBrands()]);
        setCategories(categoriesData || []);
        setBrands(brandsData || []);
      } catch (error: any) {
        console.error(error);
        toast.error("Failed to fetch filters");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sync state with URL params
  useEffect(() => {
    const maxPrice = searchParams.get("maxPrice");
    if (maxPrice) {
      setPrice([Number(maxPrice)]);
    } else {
      setPrice([500000]);
    }
  }, [searchParams]);

  const handleSearchQuery = (query: string, value: string | number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(query, value.toString());
    params.set("page", "1"); // Reset to page 1 on filter change
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const removeSearchQuery = (query: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(query);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearAllFilters = () => {
    router.push(`${pathname}`, { scroll: false });
  };

  const currentCategory = searchParams.get("category") || "";
  const currentBrand = searchParams.get("brand") || "";
  const currentRating = searchParams.get("rating") || "";
  const isInStock = searchParams.get("inStock") === "true";

  return (
    <div className="p-6 bg-card border border-border/60 rounded-3xl shadow-sm space-y-6">
      <div className="flex justify-between items-center pb-4 border-b">
        <h2 className="text-lg font-bold text-foreground">Filters</h2>
        {searchParams.toString().length > 0 && (
          <Button
            onClick={clearAllFilters}
            size="sm"
            variant="ghost"
            className="text-xs font-semibold text-primary hover:text-primary/80 p-0"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Filter by Price */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Price Limit</h3>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>$0</span>
          <span>$500,000</span>
        </div>
        <Slider
          max={500000}
          step={100}
          value={price}
          onValueChange={(value) => {
            setPrice(value);
            handleSearchQuery("maxPrice", value[0]);
          }}
          className="w-full"
        />
        <p className="text-xs font-semibold">Max Price: ${price[0].toLocaleString()}</p>
      </div>

      {/* In Stock Toggle */}
      <div className="flex items-center space-x-2 pt-2 pb-2 border-y border-border/40">
        <Checkbox
          id="in-stock-filter"
          checked={isInStock}
          onCheckedChange={(checked) => {
            if (checked) {
              handleSearchQuery("inStock", "true");
            } else {
              removeSearchQuery("inStock");
            }
          }}
        />
        <Label htmlFor="in-stock-filter" className="text-sm font-semibold cursor-pointer">
          Show In Stock Only
        </Label>
      </div>

      {/* Product Category Checkboxes */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Category</h3>
        {isLoading ? (
          <p className="text-xs text-muted-foreground">Loading categories...</p>
        ) : (
          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
            {categories.map((category) => (
              <div key={category._id} className="flex items-center space-x-2.5">
                <Checkbox
                  id={`cat-${category._id}`}
                  checked={currentCategory === category._id}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleSearchQuery("category", category._id);
                    } else {
                      removeSearchQuery("category");
                    }
                  }}
                />
                <Label
                  htmlFor={`cat-${category._id}`}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer leading-none"
                >
                  {category.name}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Brand Dropdown Filter */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Brand</h3>
        {isLoading ? (
          <p className="text-xs text-muted-foreground">Loading brands...</p>
        ) : (
          <Select
            value={currentBrand}
            onValueChange={(val) => {
              if (val === "all_brands") {
                removeSearchQuery("brand");
              } else {
                handleSearchQuery("brand", val);
              }
            }}
          >
            <SelectTrigger className="w-full rounded-xl">
              <SelectValue placeholder="Select a Brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_brands">All Brands</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand._id} value={brand._id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Rating Star Selector */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Minimum Rating</h3>
        <div className="space-y-2.5">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2.5">
              <Checkbox
                id={`rating-${rating}`}
                checked={currentRating === rating.toString()}
                onCheckedChange={(checked) => {
                  if (checked) {
                    handleSearchQuery("rating", rating);
                  } else {
                    removeSearchQuery("rating");
                  }
                }}
              />
              <Label
                htmlFor={`rating-${rating}`}
                className="flex items-center gap-1 cursor-pointer"
              >
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    size={16}
                    key={i}
                    className={`${
                      i < rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-slate-200 dark:text-slate-700"
                    }`}
                  />
                ))}
                <span className="text-xs font-semibold text-muted-foreground ml-1">
                  {rating === 5 ? "" : "& Up"}
                </span>
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}