"use client";

import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [brands, setBrands] = useState<{ _id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

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
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
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

  const handlePriceChange = (type: "minPrice" | "maxPrice", val: string) => {
    if (type === "minPrice") {
      setMinPrice(val);
      if (val) {
        handleSearchQuery("minPrice", val);
      } else {
        removeSearchQuery("minPrice");
      }
    } else {
      setMaxPrice(val);
      if (val) {
        handleSearchQuery("maxPrice", val);
      } else {
        removeSearchQuery("maxPrice");
      }
    }
  };

  const clearAllFilters = () => {
    router.push(`${pathname}`, { scroll: false });
  };

  const currentCategory = searchParams.get("category") || "";
  const selectedCategories = currentCategory ? currentCategory.split(",") : [];
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

      {/* Filter by Price Range */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Price Range</h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => handlePriceChange("minPrice", e.target.value)}
            className="rounded-xl h-9"
          />
          <span className="text-muted-foreground text-xs">—</span>
          <Input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
            className="rounded-xl h-9"
          />
        </div>
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
                  checked={selectedCategories.includes(category._id)}
                  onCheckedChange={(checked) => {
                    let updated: string[];
                    if (checked) {
                      updated = [...selectedCategories, category._id];
                    } else {
                      updated = selectedCategories.filter((id) => id !== category._id);
                    }
                    if (updated.length > 0) {
                      handleSearchQuery("category", updated.join(","));
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