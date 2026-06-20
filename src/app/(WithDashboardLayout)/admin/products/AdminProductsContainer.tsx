"use client";

import React, { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Eye, ShoppingBag, Plus, Edit } from "lucide-react";
import { toast } from "sonner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { deleteProduct } from "@/services/product";
import { DataTable } from "@/components/ui/core/DataTable";
import { ConfirmModal } from "@/components/ui/core/ConfirmModal";
import { IMeta } from "@/types/meta";
import Image from "next/image";
import ProductFormDialog from "./ProductFormDialog";

interface AdminProductsContainerProps {
  initialProducts: any[];
  meta: IMeta | null;
  categories: any[];
  brands: any[];
  shops: any[];
}

export default function AdminProductsContainer({
  initialProducts = [],
  meta,
  categories = [],
  brands = [],
  shops = [],
}: AdminProductsContainerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [targetProduct, setTargetProduct] = useState<any | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any | null>(null);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  const handleDelete = async (productId: string) => {
    setLoadingProductId(productId);
    try {
      const res = await deleteProduct(productId);
      if (res?.success) {
        toast.success(res?.message || "Product deleted successfully.");
        setProducts((prev) => prev.filter((p) => p._id !== productId));
        router.refresh();
      } else {
        toast.error(res?.message || "Failed to delete product.");
      }
    } catch {
      toast.error("An error occurred while deleting product.");
    } finally {
      setLoadingProductId(null);
      setDeleteOpen(false);
    }
  };

  const triggerDeleteConfirm = (productObj: any) => {
    setTargetProduct(productObj);
    setDeleteOpen(true);
  };

  const setFilterParam = (key: string, val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val && val !== "all") {
      params.set(key, val);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const currentCategory = searchParams.get("category") || "all";
  const currentBrand = searchParams.get("brand") || "all";
  const currentPage = meta?.page || 1;

  // Table Columns
  const columns: ColumnDef<any>[] = [
    {
      id: "image",
      header: "Image",
      cell: ({ row }) => {
        const imageUrl = row.original.imageUrls?.[0] || "";
        return (
          <div className="relative w-10 h-10 rounded-xl overflow-hidden border bg-muted">
            {imageUrl ? (
              <Image src={imageUrl} alt={row.original.name} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Title",
      cell: ({ row }) => (
        <span className="font-bold text-xs text-foreground truncate max-w-[200px] block">
          {row.original.name}
        </span>
      ),
    },
    {
      accessorKey: "category.name",
      header: "Category",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground font-semibold">
          {row.original.category?.name || "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "brand.name",
      header: "Brand",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground font-semibold">
          {row.original.brand?.name || "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <span className="font-black text-xs text-foreground">
          ৳{row.original.price?.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => {
        const stock = row.original.stock;
        const isOutOfStock = stock === 0;
        return (
          <span className={`text-xs font-bold ${isOutOfStock ? "text-red-500 font-extrabold" : "text-muted-foreground"}`}>
            {stock} left
          </span>
        );
      },
    },
    {
      id: "flashSale",
      header: "Flash Sale",
      cell: ({ row }) => {
        const isFlash = row.original.isFlashSale || row.original.flashSale;
        return (
          <Badge
            variant="outline"
            className={
              isFlash
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-transparent text-[10px] font-black"
                : "bg-muted text-muted-foreground border-transparent text-[10px] font-bold"
            }
          >
            {isFlash ? "Yes" : "No"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const p = row.original;
        const isSelfLoading = loadingProductId === p._id;

        return (
          <div className="flex gap-1.5 justify-start">
            {/* View Product Details */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full border-primary/10 text-primary hover:bg-primary/5"
              onClick={() => window.open(`/products/${p.slug || p._id}`, "_blank")}
            >
              <Eye className="w-3.5 h-3.5" />
            </Button>

            {/* Edit Product */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full border-primary/10 text-primary hover:bg-primary/5"
              onClick={() => {
                setEditProduct(p);
                setFormOpen(true);
              }}
            >
              <Edit className="w-3.5 h-3.5" />
            </Button>

            {/* Delete Product */}
            <Button
              variant="outline"
              size="icon"
              disabled={isSelfLoading}
              className="h-8 w-8 rounded-full border-red-500/10 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
              onClick={() => triggerDeleteConfirm(p)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        );
      },
    },
  ];

  // Filters dropdown slot
  const filters = (
    <>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        <span>Category:</span>
        <Select value={currentCategory} onValueChange={(val) => setFilterParam("category", val)}>
          <SelectTrigger className="w-[130px] h-8 rounded-full">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c._id} value={c._id} className="text-xs">
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        <span>Brand:</span>
        <Select value={currentBrand} onValueChange={(val) => setFilterParam("brand", val)}>
          <SelectTrigger className="w-[120px] h-8 rounded-full">
            <SelectValue placeholder="All Brands" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            {brands.map((b) => (
              <SelectItem key={b._id} value={b._id} className="text-xs">
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">Manage Products</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            View platform inventory items list, verify catalog details, or remove products.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditProduct(null);
            setFormOpen(true);
          }}
          className="rounded-full font-bold text-xs h-9 flex gap-1.5 items-center"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={products}
        totalCount={meta?.total || products.length}
        currentPage={currentPage}
        pageSize={meta?.limit || 10}
        onPageChange={(page) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set("page", page.toString());
          router.push(`${pathname}?${params.toString()}`);
        }}
        onSearch={(searchVal) => {
          const params = new URLSearchParams(searchParams.toString());
          if (searchVal) {
            params.set("search", searchVal);
          } else {
            params.delete("search");
          }
          params.set("page", "1");
          router.push(`${pathname}?${params.toString()}`, { scroll: false });
        }}
        searchPlaceholder="Search products by title..."
        filterSlot={filters}
      />

      <ConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => {
          if (targetProduct) {
            handleDelete(targetProduct._id);
          }
        }}
        title="Delete Product?"
        description={`Are you sure you want to delete ${targetProduct?.name || "this product"}? This action is permanent and cannot be undone.`}
        confirmLabel="Delete Product"
        variant="danger"
        isLoading={loadingProductId === targetProduct?._id}
      />

      <ProductFormDialog
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditProduct(null);
        }}
        categories={categories}
        brands={brands}
        shops={shops}
        productToEdit={editProduct}
        onSuccess={() => {
          router.refresh();
        }}
      />
    </div>
  );
}
