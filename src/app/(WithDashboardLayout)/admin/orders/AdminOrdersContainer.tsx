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
import { changeOrderStatus } from "@/services/order";
import { DataTable } from "@/components/ui/core/DataTable";
import { IMeta } from "@/types/meta";

interface AdminOrdersContainerProps {
  orders: any[];
  meta: IMeta | null;
}

export default function AdminOrdersContainer({
  orders: initialOrders = [],
  meta,
}: AdminOrdersContainerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [orders, setOrders] = useState<any[]>(initialOrders);
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);

  // Modal view state
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setLoadingOrderId(orderId);
    try {
      const res = await changeOrderStatus(orderId, newStatus);
      if (res?.success) {
        toast.success(`Order status updated to ${newStatus} successfully!`);
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
        router.refresh();
      } else {
        toast.error(res?.message || "Failed to update order status.");
      }
    } catch {
      toast.error("An error occurred during status update.");
    } finally {
      setLoadingOrderId(null);
    }
  };

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

  // Check if transition is valid
  // Allowed:
  // Pending -> Processing, Pending -> Cancelled
  // Processing -> Completed / Delivered
  const isTransitionDisabled = (currentStatus: string, targetStatus: string) => {
    const current = currentStatus?.toLowerCase();
    const target = targetStatus?.toLowerCase();

    if (current === target) return false;
    if (current === "pending") {
      return target !== "processing" && target !== "cancelled";
    }
    if (current === "processing") {
      return target !== "completed" && target !== "delivered";
    }
    return true; // Completed or Cancelled cannot transition to anything
  };

  // Filter handlers
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

  const currentStatus = searchParams.get("status") || "all";
  const currentPage = meta?.page || 1;
  const searchVal = searchParams.get("search") || "";

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
      id: "itemsCount",
      header: "Items Count",
      cell: ({ row }) => {
        const products = row.original.products || [];
        return <span className="text-xs text-muted-foreground font-bold">{products.length} Items</span>;
      },
    },
    {
      accessorKey: "finalAmount",
      header: "Total",
      cell: ({ row }) => (
        <span className="font-black text-xs text-foreground">
          ৳{row.original.finalAmount?.toLocaleString() || row.original.totalAmount?.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
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
        const current = order.status;
        const isSelfLoading = loadingOrderId === order._id;
        const isFinished = current?.toLowerCase() === "completed" || current?.toLowerCase() === "delivered" || current?.toLowerCase() === "cancelled";

        return (
          <div className="flex gap-2 justify-start items-center">
            {/* Transition Dropdown */}
            <Select
              disabled={isSelfLoading || isFinished}
              value={current}
              onValueChange={(val) => handleUpdateStatus(order._id, val)}
            >
              <SelectTrigger className="w-[125px] h-8 rounded-full text-[10px] font-bold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending" disabled={isTransitionDisabled(current, "Pending")} className="text-[10px]">
                  Pending
                </SelectItem>
                <SelectItem value="Processing" disabled={isTransitionDisabled(current, "Processing")} className="text-[10px]">
                  Processing
                </SelectItem>
                <SelectItem value="Completed" disabled={isTransitionDisabled(current, "Completed")} className="text-[10px]">
                  Delivered
                </SelectItem>
                <SelectItem value="Cancelled" disabled={isTransitionDisabled(current, "Cancelled")} className="text-[10px]">
                  Cancelled
                </SelectItem>
              </SelectContent>
            </Select>

            {/* View Details Button */}
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
          </div>
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
      <div>
        <h1 className="text-2xl font-black text-foreground">Manage Orders</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Review buyer invoice logs, track dispatch status, and process cancellations.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={orders}
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
        searchPlaceholder="Search orders by customer email..."
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
                  Products Invoice
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
                  Transaction Summary
                </h4>
                <div className="bg-muted/30 border p-3.5 rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-semibold">Subtotal</span>
                    <span className="font-bold text-foreground">৳{selectedOrder.totalAmount?.toLocaleString()}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-red-500">
                      <span className="font-semibold">Discount Applied</span>
                      <span className="font-bold">-৳{selectedOrder.discount?.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2 text-sm">
                    <span className="font-black text-foreground">Grand Total</span>
                    <span className="font-black text-primary">৳{selectedOrder.finalAmount?.toLocaleString()}</span>
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
