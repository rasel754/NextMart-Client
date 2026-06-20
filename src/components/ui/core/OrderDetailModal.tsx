"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, CreditCard, User, Truck } from "lucide-react";
import Image from "next/image";
import { curencyFormatter } from "@/lib/currencyFormatter";

interface OrderDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  order: any;
}

export default function OrderDetailModal({ isOpen, onOpenChange, order }: OrderDetailModalProps) {
  if (!order) return null;

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

  const handleDownloadInvoice = () => {
    // Mocks PDF download or triggers API if backend serves it
    const downloadUrl = `${process.env.NEXT_PUBLIC_BASE_API}/order/${order._id}/invoice`;
    window.open(downloadUrl, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl p-6">
        <DialogHeader className="border-b pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <DialogTitle className="text-xl font-black">Order Details</DialogTitle>
              <p className="text-[10px] font-mono text-muted-foreground mt-1">ID: {order._id}</p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(order.status)}
              <Button size="sm" variant="outline" className="rounded-full gap-1.5 text-xs" onClick={handleDownloadInvoice}>
                <Download className="w-3.5 h-3.5" /> Invoice
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Metadata Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/30 border border-border/40 p-4 rounded-2xl flex gap-3 text-xs">
              <User className="w-5 h-5 text-primary shrink-0" />
              <div className="space-y-1">
                <h4 className="font-bold text-foreground">Customer</h4>
                <p className="text-muted-foreground">{order.user?.name || "Customer"}</p>
                <p className="text-muted-foreground text-[10px]">{order.user?.email}</p>
              </div>
            </div>

            <div className="bg-muted/30 border border-border/40 p-4 rounded-2xl flex gap-3 text-xs">
              <Truck className="w-5 h-5 text-indigo-500 shrink-0" />
              <div className="space-y-1">
                <h4 className="font-bold text-foreground">Delivery Address</h4>
                <p className="text-muted-foreground leading-relaxed truncate max-w-[180px] block" title={order.shippingAddress}>
                  {order.shippingAddress}
                </p>
              </div>
            </div>

            <div className="bg-muted/30 border border-border/40 p-4 rounded-2xl flex gap-3 text-xs">
              <CreditCard className="w-5 h-5 text-emerald-500 shrink-0" />
              <div className="space-y-1">
                <h4 className="font-bold text-foreground">Payment Details</h4>
                <p className="text-muted-foreground">Method: {order.paymentMethod || "Online"}</p>
                <p className="text-muted-foreground text-[10px]">Status: {order.paymentStatus || "Pending"}</p>
                {order.transactionId && (
                  <p className="text-[10px] font-mono text-muted-foreground truncate max-w-[150px]" title={order.transactionId}>
                    TXN: {order.transactionId}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-border/60 rounded-2xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Product</TableHead>
                  <TableHead className="text-xs text-center">Quantity</TableHead>
                  <TableHead className="text-xs text-right">Unit Price</TableHead>
                  <TableHead className="text-xs text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.products?.map((item: any, idx: number) => {
                  const product = item.product || {};
                  return (
                    <TableRow key={product._id || idx}>
                      <TableCell className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden border shrink-0 bg-muted/40">
                          <Image
                            src={product.imageUrls?.[0] || "https://psediting.websites.co.in/obaju-turquoise/img/product-placeholder.png"}
                            alt={product.name || "item"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-xs font-bold truncate max-w-[200px]" title={product.name}>
                          {product.name || "Product Item"}
                        </span>
                      </TableCell>
                      <TableCell className="text-center text-xs font-bold">{item.quantity}</TableCell>
                      <TableCell className="text-right text-xs font-semibold">
                        {curencyFormatter(product.offerPrice || product.price || 0)}
                      </TableCell>
                      <TableCell className="text-right text-xs font-bold">
                        {curencyFormatter((product.offerPrice || product.price || 0) * item.quantity)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Totals Summary */}
          <div className="flex justify-end pt-2">
            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Items Subtotal</span>
                <span className="font-semibold text-foreground">
                  {curencyFormatter(order.totalAmount || 0)}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400">
                  <span>Coupon Discount</span>
                  <span className="font-bold">-{curencyFormatter(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Shipping Cost</span>
                <span className="font-semibold text-foreground">
                  {curencyFormatter(order.shippingCost || 0)}
                </span>
              </div>
              <hr className="border-border/40" />
              <div className="flex justify-between items-center text-sm font-bold text-foreground">
                <span>Total Paid</span>
                <span className="text-base font-black text-primary">
                  {curencyFormatter(order.finalAmount || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
