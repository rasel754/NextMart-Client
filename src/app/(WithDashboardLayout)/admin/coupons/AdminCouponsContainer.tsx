"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createCoupon, deleteCoupon } from "@/services/Coupon";
import { DataTable } from "@/components/ui/core/DataTable";
import { ConfirmModal } from "@/components/ui/core/ConfirmModal";
import { Badge } from "@/components/ui/badge";

interface AdminCouponsContainerProps {
  initialCoupons: any[];
}

// Zod Validation Schema
const couponSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters").max(15, "Code is too long"),
  discountType: z.enum(["Flat", "Percentage"]),
  discountValue: z.preprocess((val) => Number(val), z.number().min(1, "Discount value must be at least 1")),
  minOrderAmount: z.preprocess((val) => (val === "" ? 0 : Number(val)), z.number().nonnegative().optional()),
  limit: z.preprocess((val) => (val === "" ? 1 : Number(val)), z.number().int().positive("Limit must be positive")),
  expiresAt: z.string().min(1, "Expiry date is required"),
});

type CouponFormValues = z.infer<typeof couponSchema>;

export default function AdminCouponsContainer({
  initialCoupons = [],
}: AdminCouponsContainerProps) {
  const router = useRouter();
  const [coupons, setCoupons] = useState<any[]>(initialCoupons);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal State
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [targetCoupon, setTargetCoupon] = useState<any>(null);
  const [loadingDeleteId, setLoadingDeleteId] = useState<string | null>(null);

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: "",
      discountType: "Flat",
      discountValue: 0,
      minOrderAmount: 0,
      limit: 1,
      expiresAt: "",
    },
  });

  const onSubmit: SubmitHandler<CouponFormValues> = async (data) => {
    setIsSubmitting(true);
    // Format payload
    const payload = {
      ...data,
      code: data.code.toUpperCase(), // Double ensure uppercase
    };

    try {
      const res = await createCoupon(payload);
      if (res?.success) {
        toast.success(res?.message || "Coupon created successfully.");
        form.reset();
        router.refresh();
        if (res.data) {
          setCoupons((prev) => [res.data, ...prev]);
        }
      } else {
        toast.error(res?.message || "Failed to create coupon.");
      }
    } catch {
      toast.error("An error occurred during coupon creation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (couponId: string) => {
    setLoadingDeleteId(couponId);
    try {
      const res = await deleteCoupon(couponId);
      if (res?.success) {
        toast.success(res?.message || "Coupon deleted successfully.");
        setCoupons((prev) => prev.filter((c) => c._id !== couponId));
        router.refresh();
      } else {
        toast.error(res?.message || "Failed to delete coupon.");
      }
    } catch {
      toast.error("An error occurred while deleting coupon.");
    } finally {
      setLoadingDeleteId(null);
      setDeleteOpen(false);
    }
  };

  const triggerDeleteConfirm = (couponObj: any) => {
    setTargetCoupon(couponObj);
    setDeleteOpen(true);
  };

  // Table Columns
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => (
        <span className="font-extrabold text-xs font-mono text-primary bg-primary/5 px-2 py-1 rounded-md border border-primary/10">
          {row.original.code}
        </span>
      ),
    },
    {
      accessorKey: "discountType",
      header: "Type",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground font-semibold">
          {row.original.discountType}
        </span>
      ),
    },
    {
      accessorKey: "discountValue",
      header: "Value",
      cell: ({ row }) => {
        const val = row.original.discountValue;
        const type = row.original.discountType;
        return (
          <span className="font-bold text-xs text-foreground">
            {type === "Percentage" ? `${val}%` : `৳${val.toLocaleString()}`}
          </span>
        );
      },
    },
    {
      accessorKey: "minOrderAmount",
      header: "Min Order",
      cell: ({ row }) => {
        const amt = row.original.minOrderAmount || 0;
        return (
          <span className="text-xs text-muted-foreground">
            ৳{amt.toLocaleString()}
          </span>
        );
      },
    },
    {
      id: "limit",
      header: "Used / Limit",
      cell: ({ row }) => {
        const limit = row.original.limit || 0;
        const used = row.original.used || 0;
        return (
          <span className="text-xs text-muted-foreground font-bold">
            {used} / {limit}
          </span>
        );
      },
    },
    {
      accessorKey: "expiresAt",
      header: "Expires",
      cell: ({ row }) => {
        const date = row.original.expiresAt ? new Date(row.original.expiresAt) : null;
        return (
          <span className="text-xs text-muted-foreground font-medium">
            {date ? date.toLocaleDateString() : "N/A"}
          </span>
        );
      },
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const expiresAt = row.original.expiresAt;
        const isExpired = expiresAt && new Date(expiresAt).getTime() < Date.now();

        return (
          <Badge
            className={
              !isExpired
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-transparent text-[10px] font-black"
                : "bg-red-500/15 text-red-600 dark:text-red-400 border-transparent text-[10px] font-black"
            }
            variant="outline"
          >
            {isExpired ? "Expired" : "Active"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const c = row.original;
        const isDeleting = loadingDeleteId === c._id;
        return (
          <Button
            variant="outline"
            size="icon"
            disabled={isDeleting}
            className="h-8 w-8 rounded-full border-red-500/10 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
            onClick={() => triggerDeleteConfirm(c)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Manage Coupons</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Configure platform promotional coupons: adjust values, minimum spends, limits and dates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Create Form */}
        <div className="bg-card border border-border/60 p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="font-black text-sm text-foreground border-b pb-2 flex gap-1.5 items-center">
            <Plus className="w-4 h-4 text-primary" />
            Create Promotional Coupon
          </h3>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Code */}
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold">Coupon Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="WINTER50, OFF20..."
                        {...field}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                        className="h-9 rounded-xl text-xs uppercase"
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                {/* Discount Type */}
                <FormField
                  control={form.control}
                  name="discountType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold">Type</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="h-9 rounded-xl text-xs">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Flat" className="text-xs">Flat (৳)</SelectItem>
                          <SelectItem value="Percentage" className="text-xs">Percentage (%)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                {/* Discount Value */}
                <FormField
                  control={form.control}
                  name="discountValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold">Discount Value</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="h-9 rounded-xl text-xs" />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Min Order Amount */}
                <FormField
                  control={form.control}
                  name="minOrderAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold">Min Order (৳)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="h-9 rounded-xl text-xs" />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                {/* Limit */}
                <FormField
                  control={form.control}
                  name="limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold">Usage Limit</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="h-9 rounded-xl text-xs" />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Expiry Date */}
              <FormField
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold">Expiry Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="h-9 rounded-xl text-xs" />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full font-bold h-9 text-xs mt-2"
              >
                {isSubmitting ? "Creating..." : "Create Coupon"}
              </Button>
            </form>
          </Form>
        </div>

        {/* Right Column: Listing Table */}
        <div className="lg:col-span-2 space-y-4">
          <DataTable
            columns={columns}
            data={coupons}
            totalCount={coupons.length}
            currentPage={1}
            pageSize={100}
            onPageChange={() => {}}
            searchPlaceholder="Search coupon code..."
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => {
          if (targetCoupon) {
            handleDelete(targetCoupon._id);
          }
        }}
        title="Delete Coupon?"
        description={`Are you sure you want to delete coupon "${targetCoupon?.code}"? Deleting a coupon will disable it for checkout.`}
        confirmLabel="Delete"
        variant="danger"
        isLoading={loadingDeleteId === targetCoupon?._id}
      />
    </div>
  );
}
