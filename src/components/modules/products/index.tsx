"use client";

import ProductCard from "@/components/ui/core/ProductCard";
import { IProduct } from "@/types/product";
import FilterSidebar from "./filterSidebar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IMeta } from "@/types/meta";

interface AllProductsProps {
  products: IProduct[];
  meta: IMeta | null;
}

export default function AllProducts({ products, meta }: AllProductsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Search local state & debounce
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }
    params.set("page", "1"); // Reset to page 1 on search change
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [debouncedSearch, pathname, router, searchParams]);

  // Handle Sort Change
  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Handle Pagination
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || (meta && newPage > meta.totalPage)) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: true });
  };

  const currentSort = searchParams.get("sort") || "newest";
  const currentPage = meta?.page || 1;
  const totalPages = meta?.totalPage || 1;

  return (
    <div className="flex flex-col md:flex-row gap-8 my-10">
      {/* Sidebar Filter */}
      <div className="w-full md:w-64 shrink-0">
        <FilterSidebar />
      </div>

      {/* Main Product Container */}
      <div className="flex-1 space-y-6">
        {/* Controls: Search & Sort */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card border border-border/60 p-4 rounded-2xl shadow-sm">
          {/* Debounced Search */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 rounded-full focus-visible:ring-primary"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Sort By:
            </span>
            <Select value={currentSort} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px] rounded-full">
                <SelectValue placeholder="Sort Options" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest Arrival</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product: IProduct, idx: number) => (
              <ProductCard key={product._id || idx} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-3xl text-center p-6 bg-card/40">
            <h3 className="text-lg font-bold mb-1">No Products Found</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              We couldn&apos;t find any items matching your selected criteria. Try adjusting your filters or search terms.
            </p>
          </div>
        )}

        {/* Pagination Section */}
        {meta && meta.totalPage > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              const isCurrent = pageNum === currentPage;
              return (
                <Button
                  key={pageNum}
                  variant={isCurrent ? "default" : "outline"}
                  className={`rounded-full w-10 h-10 p-0 font-bold ${
                    isCurrent ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  }`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}

            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
