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
import { Trash2, Plus, Edit, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { addFlashSale, deleteFlashSale, updateFlashSale } from "@/services/FlashSale";
import { DataTable } from "@/components/ui/core/DataTable";
import { ConfirmModal } from "@/components/ui/core/ConfirmModal";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface AdminFlashSalesContainerProps {
  initialFlashSales: any[];
  productsList: any[];
}

// Zod Validation Schema
const flashSaleSchema = z.object({
  product: z.string().min(1, "Please select a product"),
  discountPercentage: z.preprocess((val) => Number(val), z.number().min(1, "Discount must be at least 1%").max(99, "Discount cannot exceed 99%")),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
}).refine((data) => {
  const start = new Date(data.startTime).getTime();
  const end = new Date(data.endTime).getTime();
  return end > start;
}, {
  message: "End time must be after start time",
  path: ["endTime"],
});

type FlashSaleFormValues = z.infer<typeof flashSaleSchema>;

export default function AdminFlashSalesContainer({
  initialFlashSales = [],
  productsList = [],
}: AdminFlashSalesContainerProps) {
  const router = useRouter();
  const [flashSales, setFlashSales] = useState<any[]>(initialFlashSales);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editFlashSaleId, setEditFlashSaleId] = useState<string | null>(null);

  // Modal State
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [targetFlashSale, setTargetFlashSale] = useState<any>(null);
  const [loadingDeleteId, setLoadingDeleteId] = useState<string | null>(null);

  const form = useForm<FlashSaleFormValues>({
    resolver: zodResolver(flashSaleSchema),
    defaultValues: {
      product: "",
      discountPercentage: 0,
      startTime: "",
      endTime: "",
    },
  });

  const formatDatetimeLocal = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const pad = (num: number) => String(num).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const handleStartEdit = (fs: any) => {
    setEditFlashSaleId(fs._id);
    form.reset({
      product: fs.product?._id || fs.product || "",
      discountPercentage: fs.discountPercentage || 0,
      startTime: formatDatetimeLocal(fs.startTime),
      endTime: formatDatetimeLocal(fs.endTime),
    });
  };

  const handleCancelEdit = () => {
    setEditFlashSaleId(null);
    form.reset({
      product: "",
      discountPercentage: 0,
      startTime: "",
      endTime: "",
    });
  };

  const onSubmit: SubmitHandler<FlashSaleFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      let res;
      if (editFlashSaleId) {
        res = await updateFlashSale(editFlashSaleId, data);
      } else {
        res = await addFlashSale(data);
      }

      if (res?.success) {
        toast.success(res?.message || (editFlashSaleId ? "Flash sale updated successfully!" : "Flash sale scheduled successfully!"));
        handleCancelEdit();
        router.refresh();
        if (res.data) {
          if (editFlashSaleId) {
            setFlashSales((prev) =>
              prev.map((item) => (item._id === editFlashSaleId ? res.data : item))
            );
          } else {
            setFlashSales((prev) => [res.data, ...prev]);
          }
        }
      } else {
        toast.error(res?.message || "Failed to save flash sale.");
      }
    } catch {
      toast.error("An error occurred during flash sale save.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (flashSaleId: string) => {
    setLoadingDeleteId(flashSaleId);
    try {
      const res = await deleteFlashSale(flashSaleId);
      if (res?.success) {
        toast.success(res?.message || "Flash sale deleted successfully.");
        setFlashSales((prev) => prev.filter((fs) => fs._id !== flashSaleId));
        router.refresh();
      } else {
        toast.error(res?.message || "Failed to delete flash sale.");
      }
    } catch {
      toast.error("An error occurred while deleting flash sale.");
    } finally {
      setLoadingDeleteId(null);
      setDeleteOpen(false);
    }
  };

  const triggerDeleteConfirm = (flashSaleObj: any) => {
    setTargetFlashSale(flashSaleObj);
    setDeleteOpen(true);
  };

  const getStatusBadge = (startStr: string, endStr: string) => {
    const now = Date.now();
    const start = new Date(startStr).getTime();
    const end = new Date(endStr).getTime();

    if (now >= start && now <= end) {
      return (
        <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-transparent text-[10px] font-black" variant="outline">
          Active
        </Badge>
      );
    }
    if (now < start) {
      return (
        <Badge className="bg-blue-500/15 text-blue-600 dark:text-blue-400 border-transparent text-[10px] font-black" variant="outline">
          Upcoming
        </Badge>
      );
    }
    return (
      <Badge className="bg-muted text-muted-foreground border-transparent text-[10px] font-bold" variant="outline">
        Ended
      </Badge>
    );
  };

  // Table Columns
  const columns: ColumnDef<any>[] = [
    {
      id: "product",
      header: "Product Image & Name",
      cell: ({ row }) => {
        const prod = row.original.product;
        const img = prod?.imageUrls?.[0] || "";
        return (
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden border bg-muted shrink-0">
              {img ? (
                <Image src={img} alt={prod?.name || "Product"} fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <ImageIcon className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              )}
            </div>
            <span className="font-bold text-xs text-foreground truncate max-w-[150px] block">
              {prod?.name || "Unknown Product"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "discountPercentage",
      header: "Discount %",
      cell: ({ row }) => (
        <span className="font-extrabold text-xs text-rose-600 dark:text-rose-400 bg-rose-500/5 px-2 py-0.5 rounded border border-rose-500/10">
          {row.original.discountPercentage || row.original.discount}% Off
        </span>
      ),
    },
    {
      accessorKey: "startTime",
      header: "Start",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground font-medium">
          {new Date(row.original.startTime).toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "endTime",
      header: "End",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground font-medium">
          {new Date(row.original.endTime).toLocaleString()}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.original.startTime, row.original.endTime),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const fs = row.original;
        const isDeleting = loadingDeleteId === fs._id;
        return (
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full border-primary/10 text-primary hover:bg-primary/5"
              onClick={() => handleStartEdit(fs)}
            >
              <Edit className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={isDeleting}
              className="h-8 w-8 rounded-full border-red-500/10 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
              onClick={() => triggerDeleteConfirm(fs)}
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
      <div>
        <h1 className="text-2xl font-black text-foreground">Flash Sales</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Schedule promotional flash sales: choose a product, set discount values, and define timelines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Form */}
        <div className="bg-card border border-border/60 p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="font-black text-sm text-foreground border-b pb-2 flex gap-1.5 items-center">
            {editFlashSaleId ? (
              <>
                <Edit className="w-4 h-4 text-primary" />
                Update Flash Sale
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 text-primary" />
                Schedule Flash Sale
              </>
            )}
          </h3>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Product selector */}
              <FormField
                control={form.control}
                name="product"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold">Select Product</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-9 rounded-xl text-xs">
                          <SelectValue placeholder="Choose a product..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {productsList.map((p) => (
                          <SelectItem key={p._id} value={p._id} className="text-xs">
                            {p.name} (৳{p.price})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              {/* Discount Percent */}
              <FormField
                control={form.control}
                name="discountPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold">Discount Percentage (1–99%)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="20" {...field} className="h-9 rounded-xl text-xs" />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              {/* Start Time */}
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold">Start Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} className="h-9 rounded-xl text-xs" />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              {/* End Time */}
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold">End Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} className="h-9 rounded-xl text-xs" />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 mt-2">
                {editFlashSaleId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                    className="flex-1 rounded-full font-bold h-9 text-xs"
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`${editFlashSaleId ? "flex-1" : "w-full"} rounded-full font-bold h-9 text-xs`}
                >
                  {isSubmitting
                    ? editFlashSaleId
                      ? "Updating..."
                      : "Scheduling..."
                    : editFlashSaleId
                    ? "Update Sale"
                    : "Schedule Sale"}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Right Column: Table */}
        <div className="lg:col-span-2 space-y-4">
          <DataTable
            columns={columns}
            data={flashSales}
            totalCount={flashSales.length}
            currentPage={1}
            pageSize={100}
            onPageChange={() => {}}
            searchPlaceholder="Search product name..."
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => {
          if (targetFlashSale) {
            handleDelete(targetFlashSale._id);
          }
        }}
        title="Delete Flash Sale Schedule?"
        description={`Are you sure you want to end and delete the flash sale schedule for "${targetFlashSale?.product?.name || "this product"}"?`}
        confirmLabel="Delete"
        variant="danger"
        isLoading={loadingDeleteId === targetFlashSale?._id}
      />
    </div>
  );
}
