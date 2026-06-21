"use client";

import React, { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Eye, User, ShoppingBag, MapPin, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getMyShopOrders } from "@/services/order";
import { DataTable } from "@/components/ui/core/DataTable";
import { IMeta } from "@/types/meta";
import MyShopHeader from "./MyShopHeader";
import { useUser } from "@/context/UserContext";

export default function MyShopOrdersContainer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { shopInfo } = useUser();

  const [orders, setOrders] = useState<any[]>([]);
  const [meta, setMeta] = useState<IMeta | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal view state
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const currentPage = Number(searchParams.get("page")) || 1;
  const currentStatus = searchParams.get("status") || "all";
  const searchVal = searchParams.get("search") || "";

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const query: Record<string, string> = {
        page: currentPage.toString(),
        limit: "10",
      };
      if (currentStatus !== "all") {
        query.status = currentStatus;
      }
      if (searchVal) {
        query.search = searchVal;
      }
      const res = await getMyShopOrders(query);
      if (res?.success) {
        setOrders(res.data || []);
        setMeta(res.meta || null);
      } else {
        toast.error(res?.message || "Failed to fetch orders.");
      }
    } catch {
      toast.error("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shopInfo) {
      fetchOrders();
    }
  }, [shopInfo, currentPage, currentStatus, searchVal]);

  const getStatusBadge = (status: string) => {
    const norm = status?.toLowerCase();
    switch (norm) {
      case "pending":
        return <Badge className="bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-transparent text-[10px] font-black" variant="outline">Pending</Badge>;
      case "processing":
        return <Badge className="bg-blue-500/15 text-blue-600 dark:text-blue-400 border-transparent text-[10px] font-black" variant="outline">Processing</Badge>;
      case "completed":
      case "delivered":
        return <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-transparent text-[10px] font-black" variant="outline">Delivered</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500/15 text-red-600 dark:text-red-400 border-transparent text-[10px] font-black" variant="outline">Cancelled</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px] font-semibold">{status}</Badge>;
    }
  };

  // Filter handler
  const setStatusFilter = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val && val !== "all") {
      params.set("status", val);
    } else {
      params.delete("status");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Columns definition for DataTable
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "_id",
      header: "Order ID",
      cell: ({ row }) => (
        <span className="font-bold text-xs font-mono text-foreground truncate max-w-[120px] block">
          {row.original._id}
        </span>
      ),
    },
    {
      accessorKey: "user.email",
      header: "Customer",
      cell: ({ row }) => {
        const u = row.original.user;
        return (
          <div className="flex flex-col">
            <span className="font-bold text-xs text-foreground">{u?.name || "Anonymous"}</span>
            <span className="text-[10px] text-muted-foreground font-mono">{u?.email || "anonymous"}</span>
          </div>
        );
      },
    },
    {
      id: "items",
      header: "Items",
      cell: ({ row }) => {
        const products = row.original.products || [];
        return (
          <div className="flex flex-col gap-0.5">
            {products.map((item: any, idx: number) => (
              <span key={idx} className="text-xs text-muted-foreground">
                {item.product?.name} (x{item.quantity})
              </span>
            ))}
          </div>
        );
      },
    },
    {
      id: "subtotal",
      header: "Subtotal",
      cell: ({ row }) => {
        const products = row.original.products || [];
        const subtotal = products.reduce(
          (sum: number, item: any) => sum + (item.price || item.unitPrice || 0) * (item.quantity || 0),
          0
        );
        return (
          <span className="font-black text-xs text-foreground">
            ৳{subtotal.toLocaleString()}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Order Status",
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground font-medium">
          {new Date(row.original.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full border-primary/10 text-primary hover:bg-primary/5"
            onClick={() => {
              setSelectedOrder(order);
              setDetailsOpen(true);
            }}
          >
            <Eye className="w-3.5 h-3.5" />
          </Button>
        );
      },
    },
  ];

  // Filters slot
  const filters = (
    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
      <span>Status:</span>
      <Select value={currentStatus} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[130px] h-8 rounded-full">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Orders</SelectItem>
          <SelectItem value="Pending">Pending</SelectItem>
          <SelectItem value="Processing">Processing</SelectItem>
          <SelectItem value="Completed">Delivered</SelectItem>
          <SelectItem value="Cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="space-y-6">
      <MyShopHeader />

      <div>
        <h1 className="text-xl font-black text-foreground">Shop Orders</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Track customer purchases, view order line items, and monitor shipping statuses.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={orders}
        isLoading={loading}
        totalCount={meta?.total || orders.length}
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
        searchPlaceholder="Search by Order ID..."
        filterSlot={filters}
        defaultSearchValue={searchVal}
      />

      {/* Details View Modal */}
      {selectedOrder && (
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="sm:max-w-[600px] rounded-3xl p-6 overflow-y-auto max-h-[85vh]">
            <DialogHeader className="border-b pb-4 mb-4">
              <DialogTitle className="text-base font-black flex justify-between items-center pr-6">
                <span>Order Invoices Details</span>
                {getStatusBadge(selectedOrder.status)}
              </DialogTitle>
              <DialogDescription className="text-xs font-mono pt-1 text-muted-foreground">
                Order ID: {selectedOrder._id}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 text-sm">
              {/* Section 1: Customer Details */}
              <div className="space-y-2.5">
                <h4 className="font-black text-xs uppercase tracking-wider text-muted-foreground flex gap-1.5 items-center">
                  <User className="w-3.5 h-3.5 text-primary" />
                  Buyer Information
                </h4>
                <div className="bg-muted/30 border p-3 rounded-2xl grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-muted-foreground font-semibold">Name</p>
                    <p className="font-bold text-foreground mt-0.5">{selectedOrder.user?.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground font-semibold">Email</p>
                    <p className="font-bold text-foreground mt-0.5 font-mono">{selectedOrder.user?.email || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Section 2: Items List */}
              <div className="space-y-2.5">
                <h4 className="font-black text-xs uppercase tracking-wider text-muted-foreground flex gap-1.5 items-center">
                  <ShoppingBag className="w-3.5 h-3.5 text-indigo-500" />
                  Products Invoice (Your Shop Only)
                </h4>
                <div className="bg-muted/30 border rounded-2xl overflow-hidden text-xs">
                  <div className="divide-y">
                    {(selectedOrder.products || []).map((item: any, idx: number) => {
                      const prodObj = item.product;
                      return (
                        <div key={idx} className="p-3 flex justify-between items-center gap-3">
                          <div className="flex flex-col">
                            <span className="font-bold text-foreground">{prodObj?.name || "Product Item"}</span>
                            <span className="text-[10px] text-muted-foreground font-mono mt-0.5">ID: {prodObj?._id || "N/A"}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-muted-foreground text-[10px] block">Qty: {item.quantity || 1}</span>
                            <span className="font-black text-foreground">
                              ৳{item.price?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Section 3: Shipping Details */}
              <div className="space-y-2.5">
                <h4 className="font-black text-xs uppercase tracking-wider text-muted-foreground flex gap-1.5 items-center">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  Shipping Destination
                </h4>
                <div className="bg-muted/30 border p-3 rounded-2xl text-xs space-y-1">
                  <p className="font-bold text-foreground">{selectedOrder.shippingAddress || "No delivery address supplied."}</p>
                </div>
              </div>

              {/* Section 4: Total & Payment */}
              <div className="space-y-2.5">
                <h4 className="font-black text-xs uppercase tracking-wider text-muted-foreground flex gap-1.5 items-center">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
                  Transaction Summary (Your Shop Subtotal)
                </h4>
                <div className="bg-muted/30 border p-3.5 rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-semibold">Subtotal</span>
                    <span className="font-bold text-foreground">
                      ৳{selectedOrder.products.reduce((sum: number, item: any) => sum + (item.price || item.unitPrice || 0) * (item.quantity || 0), 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
