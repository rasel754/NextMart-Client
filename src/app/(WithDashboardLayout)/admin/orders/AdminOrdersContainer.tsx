"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Check, X, Search } from "lucide-react";
import { toast } from "sonner";
import { changeOrderStatus } from "@/services/order";
import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import { IMeta } from "@/types/meta";

interface AdminOrdersContainerProps {
  orders: any[];
  meta: IMeta | null;
}

export default function AdminOrdersContainer({ orders: initialOrders = [], meta }: AdminOrdersContainerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [orders, setOrders] = useState<any[]>(initialOrders);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Search input state
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [debouncedSearch, pathname, router, searchParams]);

  const handleStatusFilter = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val && val !== "all") {
      params.set("status", val);
    } else {
      params.delete("status");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || (meta && newPage > meta.totalPage)) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: true });
  };

  const handleUpdateStatus = async (orderId: string, currentStatus: string, actionType: "process" | "complete" | "cancel") => {
    setLoadingId(orderId);
    let targetStatus = "";
    if (actionType === "process") targetStatus = "Processing";
    else if (actionType === "complete") targetStatus = "Completed";
    else if (actionType === "cancel") targetStatus = "Cancelled";

    try {
      const res = await changeOrderStatus(orderId, targetStatus);
      if (res?.success) {
        toast.success(`Order status updated to ${targetStatus} successfully!`);
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: targetStatus } : o))
        );
      } else {
        toast.error(res?.message || "Failed to update order status. Ensure status transition is valid (Pending -> Processing -> Completed).");
      }
    } catch {
      toast.error("An error occurred during updating status.");
    } finally {
      setLoadingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <Badge className="bg-yellow-500/15 text-yellow-600 dark:text-yellow-400" variant="outline">{status}</Badge>;
      case "Processing":
        return <Badge className="bg-blue-500/15 text-blue-600 dark:text-blue-400" variant="outline">{status}</Badge>;
      case "Completed":
      case "Delivered":
        return <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" variant="outline">{status}</Badge>;
      case "Cancelled":
        return <Badge className="bg-red-500/15 text-red-600 dark:text-red-400" variant="outline">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const currentStatus = searchParams.get("status") || "all";
  const currentPage = meta?.page || 1;
  const totalPages = meta?.totalPage || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">Manage Orders</h1>
          <p className="text-xs text-muted-foreground">Monitor platform orders, adjust status, and track invoices.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center w-full sm:w-auto">
          {/* Search bar */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by User Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 rounded-full focus-visible:ring-primary h-9"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status:</span>
            <Select value={currentStatus} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-[150px] rounded-full h-9">
                <SelectValue placeholder="All Orders" />
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
        </div>
      </div>

      <div className="bg-card border border-border/60 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer Email</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-bold text-xs font-mono">{order._id}</TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {order.user?.email || "anonymous"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-bold text-right text-xs">
                      ${order.finalAmount}
                    </TableCell>
                    <TableCell className="text-center text-xs">
                      {getStatusBadge(order.status)}
                    </TableCell>
                    <TableCell className="text-right flex justify-end gap-1.5">
                      {order.status === "Pending" && (
                        <Button
                          disabled={loadingId === order._id}
                          variant="ghost"
                          size="icon"
                          className="rounded-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          title="Process Order"
                          onClick={() => handleUpdateStatus(order._id, order.status, "process")}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      {order.status === "Processing" && (
                        <Button
                          disabled={loadingId === order._id}
                          variant="ghost"
                          size="icon"
                          className="rounded-full text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          title="Deliver Order"
                          onClick={() => handleUpdateStatus(order._id, order.status, "complete")}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      {(order.status === "Pending" || order.status === "Processing") && (
                        <Button
                          disabled={loadingId === order._id}
                          variant="ghost"
                          size="icon"
                          className="rounded-full text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Cancel Order"
                          onClick={() => handleUpdateStatus(order._id, order.status, "cancel")}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                      {order.status === "Completed" && (
                        <span className="text-xs font-semibold text-muted-foreground pr-2">Delivered</span>
                      )}
                      {order.status === "Cancelled" && (
                        <span className="text-xs font-semibold text-red-500 pr-2">Cancelled</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-xs">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {meta && meta.totalPage > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
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
  );
}
