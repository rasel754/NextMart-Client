"use client";

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, X } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NMImageUploader from "@/components/ui/core/NMImageUploader";
import ImagePreviewer from "@/components/ui/core/NMImageUploader/ImagePreviewer";
import { addProduct, updateProduct } from "@/services/product";

// Zod Validation Schema
const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  price: z.preprocess((val) => Number(val), z.number().min(0, "Price must be at least 0")),
  stock: z.preprocess((val) => Number(val), z.number().int().min(0, "Stock must be at least 0")),
  weight: z.preprocess((val) => (val === "" ? null : Number(val)), z.number().min(0).nullable().optional()),
  category: z.string().min(1, "Please select a category"),
  brand: z.string().min(1, "Please select a brand"),
  shop: z.string().min(1, "Please select a shop"),
  availableColors: z.array(z.object({ value: z.string() })).optional(),
  keyFeatures: z.array(z.object({ value: z.string() })).optional(),
  specification: z.array(z.object({ key: z.string(), value: z.string() })).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  categories: any[];
  brands: any[];
  shops: any[];
  productToEdit?: any | null;
  onSuccess: () => void;
}

export default function ProductFormDialog({
  isOpen,
  onClose,
  categories = [],
  brands = [],
  shops = [],
  productToEdit = null,
  onSuccess,
}: ProductFormDialogProps) {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const isEditMode = !!productToEdit;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      weight: null,
      category: "",
      brand: "",
      shop: "",
      availableColors: [{ value: "" }],
      keyFeatures: [{ value: "" }],
      specification: [{ key: "", value: "" }],
    },
  });

  const { append: appendColor, remove: removeColor, fields: colorFields } = useFieldArray({
    control: form.control,
    name: "availableColors",
  });

  const { append: appendFeature, remove: removeFeature, fields: featureFields } = useFieldArray({
    control: form.control,
    name: "keyFeatures",
  });

  const { append: appendSpec, remove: removeSpec, fields: specFields } = useFieldArray({
    control: form.control,
    name: "specification",
  });

  // Pre-fill form in edit mode
  useEffect(() => {
    if (productToEdit) {
      form.reset({
        name: productToEdit.name || "",
        description: productToEdit.description || "",
        price: productToEdit.price || 0,
        stock: productToEdit.stock || 0,
        weight: productToEdit.weight || null,
        category: productToEdit.category?._id || productToEdit.category || "",
        brand: productToEdit.brand?._id || productToEdit.brand || "",
        shop: productToEdit.shop?._id || productToEdit.shop || "",
        availableColors: productToEdit.availableColors?.map((c: string) => ({ value: c })) || [{ value: "" }],
        keyFeatures: productToEdit.keyFeatures?.map((f: string) => ({ value: f })) || [{ value: "" }],
        specification: Object.entries(productToEdit.specification || {}).map(([key, value]) => ({
          key,
          value: String(value),
        })) || [{ key: "", value: "" }],
      });
      setImagePreview(productToEdit.imageUrls || []);
      setImageFiles([]);
    } else {
      form.reset({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        weight: null,
        category: "",
        brand: "",
        shop: "",
        availableColors: [{ value: "" }],
        keyFeatures: [{ value: "" }],
        specification: [{ key: "", value: "" }],
      });
      setImagePreview([]);
      setImageFiles([]);
    }
  }, [productToEdit, isOpen, form]);

  const onSubmit: SubmitHandler<ProductFormValues> = async (data) => {
    if (imagePreview.length === 0 && imageFiles.length === 0) {
      toast.error("Please upload at least one product image.");
      return;
    }

    setIsSaving(true);
    try {
      const colors = (data.availableColors || [])
        .map((c) => c.value.trim())
        .filter(Boolean);

      const features = (data.keyFeatures || [])
        .map((f) => f.value.trim())
        .filter(Boolean);

      const specObj: Record<string, string> = {};
      (data.specification || []).forEach((item) => {
        if (item.key.trim() && item.value.trim()) {
          specObj[item.key.trim()] = item.value.trim();
        }
      });

      const modifiedData = {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        weight: data.weight,
        category: data.category,
        brand: data.brand,
        shop: data.shop,
        availableColors: colors,
        keyFeatures: features,
        specification: specObj,
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(modifiedData));

      for (const file of imageFiles) {
        formData.append("images", file);
      }

      // If in edit mode and no new files, retain existing images path on server if possible.
      // Note: server replaces productData.imageUrls only if files are uploaded.
      // So if no new files are uploaded, server doesn't mutate imageUrls, keeping the current ones.
      
      let res;
      if (isEditMode) {
        res = await updateProduct(formData, productToEdit._id);
      } else {
        res = await addProduct(formData);
      }

      if (res?.success) {
        toast.success(res?.message || (isEditMode ? "Product updated successfully." : "Product created successfully."));
        onSuccess();
        onClose();
      } else {
        toast.error(res?.message || "Failed to save product.");
      }
    } catch {
      toast.error("An error occurred during saving product.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] rounded-3xl p-6 overflow-y-auto max-h-[90vh]">
        <DialogHeader className="border-b pb-3 mb-4">
          <DialogTitle className="text-lg font-black text-foreground">
            {isEditMode ? "Edit Platform Product" : "Add Catalog Product"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Product Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold">Product Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nike Running Shoes..." {...field} className="h-9 rounded-xl text-xs" />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold">Price (৳) *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="299.99" {...field} className="h-9 rounded-xl text-xs" />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              {/* Stock */}
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold">Stock Count *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="50" {...field} className="h-9 rounded-xl text-xs" />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              {/* Weight */}
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold">Weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1.2" {...field} value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value === "" ? "" : e.target.value)} className="h-9 rounded-xl text-xs" />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold">Category *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-9 rounded-xl text-xs">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c._id} value={c._id} className="text-xs">
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              {/* Brand */}
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold">Brand *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-9 rounded-xl text-xs">
                          <SelectValue placeholder="Select Brand" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {brands.map((b) => (
                          <SelectItem key={b._id} value={b._id} className="text-xs">
                            {b.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              {/* Shop selection (Required for Admin to allocate product) */}
              <FormField
                control={form.control}
                name="shop"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-xs font-bold">Assign to Shop *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-9 rounded-xl text-xs">
                          <SelectValue placeholder="Select Merchant Shop" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {shops.map((s) => (
                          <SelectItem key={s._id} value={s._id} className="text-xs">
                            {s.shopName || s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold">Description *</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the item's materials, sizing, fit..." {...field} className="h-24 rounded-xl text-xs resize-none" />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            {/* Image Upload previews */}
            <div className="space-y-2 border-t pt-4">
              <FormLabel className="text-xs font-bold">Product Catalog Images *</FormLabel>
              <div className="flex flex-wrap gap-4 mt-1">
                <NMImageUploader
                  setImageFiles={setImageFiles}
                  setImagePreview={setImagePreview}
                  label="Upload Image"
                  className="w-24 h-24 mt-0 shrink-0"
                />
                <ImagePreviewer
                  className="flex flex-wrap gap-4"
                  setImageFiles={setImageFiles}
                  imagePreview={imagePreview}
                  setImagePreview={setImagePreview}
                />
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-4 border-t pt-4">
              <div className="flex justify-between items-center">
                <FormLabel className="text-xs font-bold">Available Colors</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendColor({ value: "" })}
                  className="h-7 rounded-full text-[10px] font-bold px-2.5"
                >
                  <Plus className="w-3 h-3 mr-1" /> Add Color
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {colorFields.map((field, index) => (
                  <div key={field.id} className="flex gap-1.5 items-center">
                    <FormField
                      control={form.control}
                      name={`availableColors.${index}.value`}
                      render={({ field }) => (
                        <FormItem className="flex-grow">
                          <FormControl>
                            <Input placeholder="Red, Black..." {...field} className="h-8 rounded-lg text-xs" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeColor(index)}
                      className="h-8 w-8 text-red-500 hover:bg-red-50"
                    >
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Features */}
            <div className="space-y-4 border-t pt-4">
              <div className="flex justify-between items-center">
                <FormLabel className="text-xs font-bold">Key Features</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendFeature({ value: "" })}
                  className="h-7 rounded-full text-[10px] font-bold px-2.5"
                >
                  <Plus className="w-3 h-3 mr-1" /> Add Feature
                </Button>
              </div>
              <div className="space-y-2">
                {featureFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-center">
                    <FormField
                      control={form.control}
                      name={`keyFeatures.${index}.value`}
                      render={({ field }) => (
                        <FormItem className="flex-grow">
                          <FormControl>
                            <Input placeholder="100% Breathable cotton..." {...field} className="h-8 rounded-lg text-xs" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFeature(index)}
                      className="h-8 w-8 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div className="space-y-4 border-t pt-4">
              <div className="flex justify-between items-center">
                <FormLabel className="text-xs font-bold">Specifications</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendSpec({ key: "", value: "" })}
                  className="h-7 rounded-full text-[10px] font-bold px-2.5"
                >
                  <Plus className="w-3 h-3 mr-1" /> Add Spec
                </Button>
              </div>
              <div className="space-y-2">
                {specFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-5 gap-3 items-center">
                    <FormField
                      control={form.control}
                      name={`specification.${index}.key`}
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormControl>
                            <Input placeholder="Material, Origin..." {...field} className="h-8 rounded-lg text-xs" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`specification.${index}.value`}
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormControl>
                            <Input placeholder="Leather, USA..." {...field} className="h-8 rounded-lg text-xs" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSpec(index)}
                      className="h-8 w-8 text-red-500 hover:bg-red-50 justify-self-center"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Actions */}
            <div className="flex justify-end gap-2 border-t pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="rounded-full font-bold h-9 text-xs px-5">
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving} className="rounded-full font-bold h-9 text-xs px-5 flex gap-1.5 items-center">
                {isSaving && <Loader2 className="w-3 h-3 animate-spin" />}
                {isSaving ? "Saving..." : isEditMode ? "Update Product" : "Create Product"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
