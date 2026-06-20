"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Trash2, Tag, Plus, Edit } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createBrand, deleteBrand, updateBrand } from "@/services/Brand";
import { DataTable } from "@/components/ui/core/DataTable";
import { ConfirmModal } from "@/components/ui/core/ConfirmModal";
import NMImageUploader from "@/components/ui/core/NMImageUploader";
import ImagePreviewer from "@/components/ui/core/NMImageUploader/ImagePreviewer";
import Image from "next/image";

interface AdminBrandsContainerProps {
  initialBrands: any[];
}

// Zod Validation Schema
const brandSchema = z.object({
  name: z.string().min(2, "Brand name must be at least 2 characters long"),
});

type BrandFormValues = z.infer<typeof brandSchema>;

export default function AdminBrandsContainer({
  initialBrands = [],
}: AdminBrandsContainerProps) {
  const router = useRouter();
  const [brands, setBrands] = useState<any[]>(initialBrands);
  // Form State
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editBrandId, setEditBrandId] = useState<string | null>(null);

  // Modal State
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [targetBrand, setTargetBrand] = useState<any>(null);
  const [loadingDeleteId, setLoadingDeleteId] = useState<string | null>(null);

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit: SubmitHandler<BrandFormValues> = async (data) => {
    if (imagePreview.length === 0 && imageFiles.length === 0) {
      toast.error("Please upload a brand logo.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(data));
      if (imageFiles.length > 0) {
        formData.append("logo", imageFiles[0]);
      }

      let res;
      if (editBrandId) {
        res = await updateBrand(editBrandId, formData);
      } else {
        res = await createBrand(formData);
      }

      if (res?.success) {
        toast.success(res?.message || (editBrandId ? "Brand updated successfully." : "Brand created successfully."));
        form.reset();
        setImageFiles([]);
        setImagePreview([]);
        setEditBrandId(null);
        
        router.refresh();
        if (res.data) {
          if (editBrandId) {
            setBrands((prev) =>
              prev.map((b) => (b._id === editBrandId ? res.data : b))
            );
          } else {
            setBrands((prev) => [res.data, ...prev]);
          }
        }
      } else {
        toast.error(res?.message || "Failed to save brand.");
      }
    } catch {
      toast.error("An error occurred while saving the brand.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (brandObj: any) => {
    setEditBrandId(brandObj._id);
    form.reset({
      name: brandObj.name,
    });
    setImageFiles([]);
    setImagePreview(brandObj.logo ? [brandObj.logo] : []);
  };

  const handleCancelEdit = () => {
    setEditBrandId(null);
    form.reset({
      name: "",
    });
    setImageFiles([]);
    setImagePreview([]);
  };

  const handleDelete = async (brandId: string) => {
    setLoadingDeleteId(brandId);
    try {
      const res = await deleteBrand(brandId);
      if (res?.success) {
        toast.success(res?.message || "Brand deleted successfully.");
        setBrands((prev) => prev.filter((b) => b._id !== brandId));
        router.refresh();
      } else {
        toast.error(res?.message || "Failed to delete brand.");
      }
    } catch {
      toast.error("An error occurred while deleting brand.");
    } finally {
      setLoadingDeleteId(null);
      setDeleteOpen(false);
    }
  };

  const triggerDeleteConfirm = (brandObj: any) => {
    setTargetBrand(brandObj);
    setDeleteOpen(true);
  };
  // Table Columns
  const columns: ColumnDef<any>[] = [
    {
      id: "logo",
      header: "Logo",
      cell: ({ row }) => {
        const logoUrl = row.original.logo || "";
        return (
          <div className="relative w-8 h-8 rounded-lg overflow-hidden border bg-muted">
            {logoUrl ? (
              <Image src={logoUrl} alt={row.original.name} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Tag className="w-3 h-3 text-muted-foreground" />
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Brand Name",
      cell: ({ row }) => <span className="font-bold text-xs text-foreground">{row.original.name}</span>,
    },
    {
      id: "productsCount",
      header: "Products Count",
      cell: ({ row }) => {
        const count = row.original.productsCount || 0;
        return <span className="text-xs text-muted-foreground font-semibold">{count} products</span>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const b = row.original;
        const isDeleting = loadingDeleteId === b._id;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full border-primary/10 text-primary hover:bg-primary/5"
              onClick={() => handleStartEdit(b)}
            >
              <Edit className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={isDeleting}
              className="h-8 w-8 rounded-full border-red-500/10 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
              onClick={() => triggerDeleteConfirm(b)}
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
        <h1 className="text-2xl font-black text-foreground">Manage Brands</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Organize platform manufacturers: create product brands or remove unused ones.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Create Form */}
        <div className="bg-card border border-border/60 p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="font-black text-sm text-foreground border-b pb-2 flex gap-1.5 items-center">
            {editBrandId ? (
              <>
                <Edit className="w-4 h-4 text-primary" />
                Update Product Brand
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 text-primary" />
                Create Product Brand
              </>
            )}
          </h3>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Brand Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold">Brand Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Nike, Samsung, Apple..." {...field} className="h-9 rounded-xl text-xs" />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              {/* Logo Uploader */}
              <div className="space-y-2">
                <FormLabel className="text-xs font-bold">Brand Logo</FormLabel>
                {imagePreview.length > 0 ? (
                  <ImagePreviewer
                    setImageFiles={setImageFiles}
                    imagePreview={imagePreview}
                    setImagePreview={setImagePreview}
                    className="h-24 w-24 object-cover border rounded-xl"
                  />
                ) : (
                  <NMImageUploader
                    setImageFiles={setImageFiles}
                    setImagePreview={setImagePreview}
                    label="Upload Logo"
                    className="h-24 w-full"
                  />
                )}
              </div>

              <div className="flex gap-2 mt-2">
                {editBrandId && (
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
                  className={`${editBrandId ? "flex-1" : "w-full"} rounded-full font-bold h-9 text-xs`}
                >
                  {isSubmitting
                    ? editBrandId
                      ? "Updating..."
                      : "Creating..."
                    : editBrandId
                    ? "Update Brand"
                    : "Create Brand"}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Right Column: Listing Table */}
        <div className="lg:col-span-2 space-y-4">
          <DataTable
            columns={columns}
            data={brands}
            totalCount={brands.length}
            currentPage={1}
            pageSize={100}
            onPageChange={() => {}}
            searchPlaceholder="Search brand..."
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => {
          if (targetBrand) {
            handleDelete(targetBrand._id);
          }
        }}
        title="Delete Brand?"
        description={`Are you sure you want to delete "${targetBrand?.name}"? Deleting a brand will affect product assignments.`}
        confirmLabel="Delete"
        variant="danger"
        isLoading={loadingDeleteId === targetBrand?._id}
      />
    </div>
  );
}
