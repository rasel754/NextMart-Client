"use client";

import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import MyShopHeader from "./MyShopHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import NMImageUploader from "@/components/ui/core/NMImageUploader";
import ImagePreviewer from "@/components/ui/core/NMImageUploader/ImagePreviewer";
import { updateMyShop } from "@/services/Shop";
import { toast } from "sonner";
import Logo from "@/assets/svgs/Logo";

export default function MyShopSettingsContainer() {
  const { shopInfo, isShopLoading, refetchShop } = useUser();
  const [imageFiles, setImageFiles] = useState<File[] | []>([]);
  const [imagePreview, setImagePreview] = useState<string[] | []>([]);

  const form = useForm({
    defaultValues: {
      shopName: "",
      businessLicenseNumber: "",
      taxIdentificationNumber: "",
      address: "",
      contactNumber: "",
      establishedYear: "",
      website: "",
    },
  });

  const { formState: { isSubmitting }, reset } = form;

  useEffect(() => {
    if (shopInfo) {
      reset({
        shopName: shopInfo.shopName || "",
        businessLicenseNumber: shopInfo.businessLicenseNumber || "",
        taxIdentificationNumber: shopInfo.taxIdentificationNumber || "",
        address: shopInfo.address || "",
        contactNumber: shopInfo.contactNumber || "",
        establishedYear: shopInfo.establishedYear?.toString() || "",
        website: shopInfo.website || "",
      });
      setImagePreview(shopInfo.logo ? [shopInfo.logo] : []);
    }
  }, [shopInfo, reset]);

  if (isShopLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <MyShopHeader />
        <div className="h-96 bg-muted/40 rounded-3xl" />
      </div>
    );
  }

  if (!shopInfo) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No shop details found.
      </div>
    );
  }

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const modifiedData = {
        ...data,
        establishedYear: parseInt(data.establishedYear) || new Date().getFullYear(),
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(modifiedData));

      if (imageFiles.length > 0) {
        formData.append("logo", imageFiles[0]);
      }

      const res = await updateMyShop(formData);
      if (res?.success) {
        toast.success("Shop settings updated successfully!");
        await refetchShop();
      } else {
        toast.error(res?.message || "Failed to update shop settings.");
      }
    } catch {
      toast.error("Failed to update shop settings.");
    }
  };

  return (
    <div className="space-y-6">
      <MyShopHeader />

      <div className="border border-border/60 bg-card/30 backdrop-blur-md rounded-3xl max-w-2xl p-6 shadow-sm">
        <div className="flex items-center space-x-4 mb-5">
          <Logo />
          <h1 className="text-xl font-black">Shop Settings</h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="shopName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shop Name</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessLicenseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business License Number</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taxIdentificationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Identification Number</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="establishedYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Established Year</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value || ""} className="rounded-xl h-20 resize-none" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel className="block mb-2">Shop Logo</FormLabel>
              <div className="flex gap-4">
                <NMImageUploader
                  setImageFiles={setImageFiles}
                  setImagePreview={setImagePreview}
                  label="Upload Logo"
                  className="w-fit mt-0"
                />
                <ImagePreviewer
                  className="flex flex-wrap gap-4"
                  setImageFiles={setImageFiles}
                  imagePreview={imagePreview}
                  setImagePreview={setImagePreview}
                />
              </div>
            </div>

            <Button type="submit" className="w-full rounded-xl py-5 font-bold" disabled={isSubmitting}>
              {isSubmitting ? "Saving Changes..." : "Save Settings"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
