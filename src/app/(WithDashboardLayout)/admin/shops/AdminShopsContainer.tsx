"use client";

import React, { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Store, Eye, ShieldAlert, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toggleShopStatus } from "@/services/Shop";
import { DataTable } from "@/components/ui/core/DataTable";
import { ConfirmModal } from "@/components/ui/core/ConfirmModal";
import { IMeta } from "@/types/meta";
import Image from "next/image";

interface AdminShopsContainerProps {
  initialShops: any[];
  meta: IMeta | null;
}

export default function AdminShopsContainer({
  initialShops = [],
  meta,
}: AdminShopsContainerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [shops, setShops] = useState<any[]>(initialShops);
  const [loadingShopId, setLoadingShopId] = useState<string | null>(null);

  // Status toggle confirmation modal
  const [modalOpen, setModalOpen] = useState(false);
  const [targetShop, setTargetShop] = useState<any>(null);
  const [targetStatus, setTargetStatus] = useState<string>("");

  useEffect(() => {
    setShops(initialShops);
  }, [initialShops]);

  const handleToggleStatus = async (shopId: string, newStatus: string) => {
    setLoadingShopId(shopId);
    try {
      const res = await toggleShopStatus(shopId, newStatus);
      if (res?.success) {
        toast.success(`Shop status updated to ${newStatus} successfully.`);
        setShops((prev) =>
          prev.map((s) => (s._id === shopId ? { ...s, status: newStatus } : s))
        );
        router.refresh();
      } else {
        toast.error(res?.message || "Failed to update shop status.");
      }
    } catch {
      toast.error("An error occurred during updating status.");
    } finally {
      setLoadingShopId(null);
      setModalOpen(false);
    }
  };

  const triggerStatusConfirm = (shopObj: any, status: string) => {
    setTargetShop(shopObj);
    setTargetStatus(status);
    setModalOpen(true);
  };

  const currentPage = meta?.page || 1;

  // Columns definition
  const columns: ColumnDef<any>[] = [
    {
      id: "logo",
      header: "Logo",
      cell: ({ row }) => {
        const logoUrl = row.original.logo || row.original.logoUrl || "";
        return (
          <div className="relative w-10 h-10 rounded-xl overflow-hidden border bg-muted">
            {logoUrl ? (
              <Image src={logoUrl} alt={row.original.shopName || "shop"} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Store className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "shopName",
      header: "Shop Name",
      cell: ({ row }) => (
        <span className="font-bold text-xs text-foreground truncate max-w-[180px] block">
          {row.original.shopName || row.original.name || "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "owner",
      header: "Owner",
      cell: ({ row }) => {
        const o = row.original.owner;
        const ownerEmail = typeof o === "object" ? o?.email : row.original.ownerEmail;
        const ownerName = typeof o === "object" ? o?.name : "Owner Account";
        return (
          <div className="flex flex-col">
            <span className="font-bold text-xs text-foreground">{ownerName}</span>
            <span className="text-[10px] text-muted-foreground font-mono">{ownerEmail || "N/A"}</span>
          </div>
        );
      },
    },
    {
      id: "productsCount",
      header: "Products Count",
      cell: ({ row }) => {
        const count = row.original.productsCount || row.original.products?.length || 0;
        return <span className="text-xs text-muted-foreground font-bold">{count} items</span>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status || "active";
        const isActive = status?.toLowerCase() === "active";
        return (
          <Badge
            className={
              isActive
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-transparent text-[10px] font-black"
                : "bg-red-500/15 text-red-600 dark:text-red-400 border-transparent text-[10px] font-black"
            }
            variant="outline"
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const date = row.original.createdAt ? new Date(row.original.createdAt) : null;
        return (
          <span className="text-xs text-muted-foreground font-medium">
            {date ? date.toLocaleDateString() : "N/A"}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const s = row.original;
        const status = s.status || "active";
        const isActive = status?.toLowerCase() === "active";
        const isSelfLoading = loadingShopId === s._id;

        return (
          <div className="flex gap-1.5 justify-start">
            {/* View Shop Page */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full border-primary/10 text-primary hover:bg-primary/5"
              onClick={() => window.open(`/shop/${s._id}`, "_blank")}
            >
              <Eye className="w-3.5 h-3.5" />
            </Button>

            {/* Suspend / Activate toggle */}
            {isActive ? (
              <Button
                variant="outline"
                size="sm"
                disabled={isSelfLoading}
                className="h-8 rounded-full px-3 text-[10px] font-black border-red-500/20 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 flex gap-1 items-center"
                onClick={() => triggerStatusConfirm(s, "suspended")}
              >
                <ShieldAlert className="w-3 h-3" />
                Suspend
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                disabled={isSelfLoading}
                className="h-8 rounded-full px-3 text-[10px] font-black border-emerald-500/20 text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/20 flex gap-1 items-center"
                onClick={() => triggerStatusConfirm(s, "active")}
              >
                <CheckCircle className="w-3 h-3" />
                Activate
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Manage Shops</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Audit onboarded merchant shops list, suspension access, or verify catalog items count.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={shops}
        totalCount={meta?.total || shops.length}
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
        searchPlaceholder="Search shops by name..."
      />

      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => {
          if (targetShop && targetStatus) {
            handleToggleStatus(targetShop._id, targetStatus);
          }
        }}
        title={targetStatus === "suspended" ? "Suspend Shop?" : "Activate Shop?"}
        description={
          targetStatus === "suspended"
            ? `Are you sure you want to suspend "${targetShop?.shopName}"? Suspending a shop will hide all of its products from buyers.`
            : `Are you sure you want to activate "${targetShop?.shopName}"? This will restore visibility for its catalog items.`
        }
        confirmLabel={targetStatus === "suspended" ? "Suspend" : "Activate"}
        variant={targetStatus === "suspended" ? "danger" : "warning"}
        isLoading={loadingShopId === targetShop?.id}
      />
    </div>
  );
}
