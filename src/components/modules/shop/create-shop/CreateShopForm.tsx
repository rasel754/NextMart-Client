"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import NMImageUploader from "@/components/ui/core/NMImageUploader";
import { useState } from "react";
import ImagePreviewer from "@/components/ui/core/NMImageUploader/ImagePreviewer";
import { createShop } from "@/services/Shop";
import { toast } from "sonner";
import Logo from "@/assets/svgs/Logo";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const shopSchema = z.object({
  shopName: z.string().min(3, "Shop Name must be at least 3 characters"),
  businessLicenseNumber: z.string().min(1, "Business License Number is required"),
  address: z.string().min(1, "Address is required"),
  contactNumber: z.string().min(1, "Contact Number is required"),
  website: z.string().url("Please enter a valid website URL").or(z.literal("")),
  establishedYear: z.string().regex(/^\d{4}$/, "Established Year must be a 4-digit number"),
  taxIdentificationNumber: z.string().min(1, "Tax Identification Number is required"),
  servicesOffered: z.string().min(10, "Services Offered description must be at least 10 characters long"),
  socialMediaLinks: z.object({
    facebook: z.string().url("Please enter a valid URL").or(z.literal("")),
    twitter: z.string().url("Please enter a valid URL").or(z.literal("")),
    instagram: z.string().url("Please enter a valid URL").or(z.literal("")),
  }).optional(),
});

type ShopFormValues = z.infer<typeof shopSchema>;

export default function CreateShopForm() {
  const [imageFiles, setImageFiles] = useState<File[] | []>([]);
  const [imagePreview, setImagePreview] = useState<string[] | []>([]);

  const form = useForm<ShopFormValues>({
    resolver: zodResolver(shopSchema),
    defaultValues: {
      shopName: "",
      businessLicenseNumber: "",
      address: "",
      contactNumber: "",
      website: "",
      establishedYear: "",
      taxIdentificationNumber: "",
      servicesOffered: "",
      socialMediaLinks: {
        facebook: "",
        twitter: "",
        instagram: "",
      },
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<ShopFormValues> = async (data) => {
    if (imageFiles.length === 0) {
      toast.error("Please upload a shop logo");
      return;
    }

    const servicesOffered = data?.servicesOffered
      .split(",")
      .map((service: string) => service.trim())
      .filter((service: string) => service !== "");

    const modifiedData = {
      ...data,
      servicesOffered: servicesOffered,
      establishedYear: Number(data?.establishedYear),
    };

    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(modifiedData));
      formData.append("logo", imageFiles[0] as File);

      const res = await createShop(formData);

      if (res.success) {
        toast.success(res.message || "Shop created successfully!");
        form.reset();
        setImageFiles([]);
        setImagePreview([]);
      } else {
        toast.error(res?.message || "Failed to create shop");
      }
    } catch (err: any) {
      toast.error("An error occurred. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="border border-border/60 bg-card rounded-3xl flex-grow max-w-2xl p-6 md:p-8 my-5 shadow-sm">
      <div className="flex items-center space-x-4 mb-6">
        <Logo />
        <div>
          <h1 className="text-xl font-black text-foreground">Create Your Shop</h1>
          <p className="text-xs text-muted-foreground">
            Join us today and start your journey!
          </p>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="shopName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shop Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input {...field} />
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
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Established Year (e.g. 2024)</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="socialMediaLinks.facebook"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="socialMediaLinks.twitter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="socialMediaLinks.instagram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 items-center">
            <div className="col-span-4 md:col-span-3">
              <FormField
                control={form.control}
                name="servicesOffered"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Services Offered (Comma separated description)</FormLabel>
                    <FormControl>
                      <Textarea
                        className="h-36 rounded-2xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {imagePreview.length > 0 ? (
              <ImagePreviewer
                setImageFiles={setImageFiles}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
                className="mt-8"
              />
            ) : (
              <div className="mt-8">
                <NMImageUploader
                  setImageFiles={setImageFiles}
                  setImagePreview={setImagePreview}
                  label="Upload Logo"
                />
              </div>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="mt-5 w-full rounded-full font-bold">
            {isSubmitting ? "Creating...." : "Create Shop"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
