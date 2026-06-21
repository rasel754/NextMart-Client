"use client";

import React, { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Eye, ShoppingBag, Plus, Edit } from "lucide-react";
import { toast } from "sonner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { deleteProduct, getMyProducts } from "@/services/product";
import { DataTable } from "@/components/ui/core/DataTable";
import { ConfirmModal } from "@/components/ui/core/ConfirmModal";
import { IMeta } from "@/types/meta";
import Image from "next/image";
import MyShopHeader from "../MyShopHeader";
import { useUser } from "@/context/UserContext";

export default function MyShopProductsContainer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { shopInfo } = useUser();

  const [products, setProducts] = useState<any[]>([]);
  const [meta, setMeta] = useState<IMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [targetProduct, setTargetProduct] = useState<any | null>(null);

  const currentPage = Number(searchParams.get("page")) || 1;
  const searchVal = searchParams.get("search") || "";

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const query: Record<string, string> = {
        page: currentPage.toString(),
        limit: "10",
      };
      if (searchVal) {
        query.search = searchVal;
      }
      const res = await getMyProducts(query);
      if (res?.success) {
        setProducts(res.data || []);
        setMeta(res.meta || null);
      } else {
        toast.error(res?.message || "Failed to fetch products.");
      }
    } catch {
      toast.error("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shopInfo) {
      fetchProducts();
    }
  }, [shopInfo, currentPage, searchVal]);

  const handleDelete = async (productId: string) => {
    setLoadingProductId(productId);
    try {
      const res = await deleteProduct(productId);
      if (res?.success) {
        toast.success(res?.message || "Product deleted successfully.");
        fetchProducts();
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
        const isFlash = row.original.isOnFlashSale || row.original.flashSale;
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
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full border-primary/10 text-primary hover:bg-primary/5"
              onClick={() => window.open(`/products/${p.slug || p._id}`, "_blank")}
            >
              <Eye className="w-3.5 h-3.5" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full border-primary/10 text-primary hover:bg-primary/5"
              onClick={() => router.push(`/user/my-shop/products/${p._id}/edit`)}
            >
              <Edit className="w-3.5 h-3.5" />
            </Button>

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

  return (
    <div className="space-y-6">
      <MyShopHeader />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-black text-foreground">Products Catalog</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Add new items, modify pricing, update stock, or remove products from your shop.
          </p>
        </div>
        <Button
          onClick={() => router.push("/user/my-shop/products/create")}
          disabled={shopInfo ? !shopInfo.isActive : true}
          className="rounded-full font-bold text-xs h-9 flex gap-1.5 items-center"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={products}
        isLoading={loading}
        totalCount={meta?.total || products.length}
        currentPage={currentPage}
        pageSize={meta?.limit || 10}
        onPageChange={(page) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set("page", page.toString());
          router.push(`${pathname}?${params.toString()}`);
        }}
        onSearch={(val) => {
          const params = new URLSearchParams(searchParams.toString());
          if (val) {
            params.set("search", val);
          } else {
            params.delete("search");
          }
          params.set("page", "1");
          router.push(`${pathname}?${params.toString()}`, { scroll: false });
        }}
        searchPlaceholder="Search products by title..."
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
        description={`Are you sure you want to delete "${targetProduct?.name || "this product"}"? This action is permanent and cannot be undone.`}
        confirmLabel="Delete Product"
        variant="danger"
        isLoading={loadingProductId === targetProduct?._id}
      />
    </div>
  );
}
