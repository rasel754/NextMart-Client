"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Trash2, ShoppingBag, Plus, Edit } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createCategory, deleteCategory, updateCategory } from "@/services/Category";
import { DataTable } from "@/components/ui/core/DataTable";
import { ConfirmModal } from "@/components/ui/core/ConfirmModal";
import NMImageUploader from "@/components/ui/core/NMImageUploader";
import ImagePreviewer from "@/components/ui/core/NMImageUploader/ImagePreviewer";
import Image from "next/image";

interface AdminCategoriesContainerProps {
  initialCategories: any[];
}

// Zod Validation Schema
const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  description: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function AdminCategoriesContainer({
  initialCategories = [],
}: AdminCategoriesContainerProps) {
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>(initialCategories);

  // Form State
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);

  // Modal State
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [targetCategory, setTargetCategory] = useState<any>(null);
  const [loadingDeleteId, setLoadingDeleteId] = useState<string | null>(null);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit: SubmitHandler<CategoryFormValues> = async (data) => {
    if (imagePreview.length === 0 && imageFiles.length === 0) {
      toast.error("Please upload a category icon.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(data));
      if (imageFiles.length > 0) {
        formData.append("icon", imageFiles[0]);
      }

      let res;
      if (editCategoryId) {
        res = await updateCategory(editCategoryId, formData);
      } else {
        res = await createCategory(formData);
      }

      if (res?.success) {
        toast.success(res?.message || (editCategoryId ? "Category updated successfully." : "Category created successfully."));
        form.reset();
        setImageFiles([]);
        setImagePreview([]);
        setEditCategoryId(null);
        
        router.refresh();
        if (res.data) {
          if (editCategoryId) {
            setCategories((prev) =>
              prev.map((c) => (c._id === editCategoryId ? res.data : c))
            );
          } else {
            setCategories((prev) => [res.data, ...prev]);
          }
        }
      } else {
        toast.error(res?.message || "Failed to save category.");
      }
    } catch {
      toast.error("An error occurred while saving the category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (categoryObj: any) => {
    setEditCategoryId(categoryObj._id);
    form.reset({
      name: categoryObj.name,
      description: categoryObj.description || "",
    });
    setImageFiles([]);
    setImagePreview(categoryObj.icon ? [categoryObj.icon] : []);
  };

  const handleCancelEdit = () => {
    setEditCategoryId(null);
    form.reset({
      name: "",
      description: "",
    });
    setImageFiles([]);
    setImagePreview([]);
  };

  const handleDelete = async (categoryId: string) => {
    setLoadingDeleteId(categoryId);
    try {
      const res = await deleteCategory(categoryId);
      if (res?.success) {
        toast.success(res?.message || "Category deleted successfully.");
        setCategories((prev) => prev.filter((c) => c._id !== categoryId));
        router.refresh();
      } else {
        toast.error(res?.message || "Failed to delete category.");
      }
    } catch {
      toast.error("An error occurred while deleting category.");
    } finally {
      setLoadingDeleteId(null);
      setDeleteOpen(false);
    }
  };

  const triggerDeleteConfirm = (categoryObj: any) => {
    setTargetCategory(categoryObj);
    setDeleteOpen(true);
  };
  // Table Columns
  const columns: ColumnDef<any>[] = [
    {
      id: "icon",
      header: "Icon",
      cell: ({ row }) => {
        const iconUrl = row.original.icon || "";
        return (
          <div className="relative w-8 h-8 rounded-lg overflow-hidden border bg-muted">
            {iconUrl ? (
              <Image src={iconUrl} alt={row.original.name} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ShoppingBag className="w-3 h-3 text-muted-foreground" />
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
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
        const c = row.original;
        const isDeleting = loadingDeleteId === c._id;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full border-primary/10 text-primary hover:bg-primary/5"
              onClick={() => handleStartEdit(c)}
            >
              <Edit className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={isDeleting}
              className="h-8 w-8 rounded-full border-red-500/10 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
              onClick={() => triggerDeleteConfirm(c)}
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
        <h1 className="text-2xl font-black text-foreground">Manage Categories</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Organize platform listings: create product categories or remove unused ones.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Create Form */}
        <div className="bg-card border border-border/60 p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="font-black text-sm text-foreground border-b pb-2 flex gap-1.5 items-center">
            {editCategoryId ? (
              <>
                <Edit className="w-4 h-4 text-primary" />
                Update Product Category
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 text-primary" />
                Create Product Category
              </>
            )}
          </h3>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Category Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold">Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Electronics, Accessories..." {...field} className="h-9 rounded-xl text-xs" />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold">Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Category description..." {...field} className="h-20 rounded-xl text-xs resize-none" />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              {/* Image Uploader */}
              <div className="space-y-2">
                <FormLabel className="text-xs font-bold">Category Icon</FormLabel>
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
                    label="Upload Icon"
                    className="h-24 w-full"
                  />
                )}
              </div>
              <div className="flex gap-2 mt-2">
                {editCategoryId && (
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
                  className={`${editCategoryId ? "flex-1" : "w-full"} rounded-full font-bold h-9 text-xs`}
                >
                  {isSubmitting
                    ? editCategoryId
                      ? "Updating..."
                      : "Creating..."
                    : editCategoryId
                    ? "Update Category"
                    : "Create Category"}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Right Column: Listing Table */}
        <div className="lg:col-span-2 space-y-4">
          <DataTable
            columns={columns}
            data={categories}
            totalCount={categories.length}
            currentPage={1}
            pageSize={100} // Large size since categories aren't heavily paginated in API list
            onPageChange={() => {}}
            searchPlaceholder="Search category..."
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => {
          if (targetCategory) {
            handleDelete(targetCategory._id);
          }
        }}
        title="Delete Category?"
        description={`Are you sure you want to delete "${targetCategory?.name}"? Deleting a category will affect product assignments.`}
        confirmLabel="Delete"
        variant="danger"
        isLoading={loadingDeleteId === targetCategory?._id}
      />
    </div>
  );
}
