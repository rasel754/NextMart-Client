"use client";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IMeta } from "@/types/meta";

interface UserOrdersContainerProps {
  orders: any[];
  meta: IMeta | null;
}

export default function UserOrdersContainer({ orders = [], meta }: UserOrdersContainerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
          <h1 className="text-2xl font-black text-foreground">My Orders</h1>
          <p className="text-xs text-muted-foreground">List and filter all your order transactions.</p>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status:</span>
          <Select value={currentStatus} onValueChange={handleStatusFilter}>
            <SelectTrigger className="w-[160px] rounded-full">
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

      {/* Table container */}
      <div className="bg-card border border-border/60 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items Count</TableHead>
                <TableHead className="text-right">Total Amount</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-bold font-mono text-xs">{order._id}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-xs font-semibold">
                      {order.products?.length || 0} product(s)
                    </TableCell>
                    <TableCell className="font-bold text-right text-xs">
                      ${order.finalAmount}
                    </TableCell>
                    <TableCell className="text-center text-xs">
                      {getStatusBadge(order.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="rounded-full" title="View Details">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-xs">
                    No orders found matching the criteria.
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
