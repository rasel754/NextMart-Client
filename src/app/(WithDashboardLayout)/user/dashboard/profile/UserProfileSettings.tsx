"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateMyProfile } from "@/services/user";
import { changePassword } from "@/services/AuthService";
import { useState } from "react";
import Image from "next/image";
import { User, KeyRound, UploadCloud } from "lucide-react";
import { cities } from "@/contants/cities";

// 1. Profile Validation Schema
const profileSchema = z.object({
  phoneNo: z
    .string()
    .regex(/^\d{11}$/, "Phone number must be exactly 11 digits long")
    .or(z.literal("")),
  gender: z.enum(["Male", "Female", "Other"]),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

// 2. Password Validation Schema
const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

interface UserProfileSettingsProps {
  userProfile: any;
}

export default function UserProfileSettings({ userProfile }: UserProfileSettingsProps) {
  const profileData = userProfile?.profile || {};
  const [photoPreview, setPhotoPreview] = useState<string | null>(profileData.photo || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Initialize Forms
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      phoneNo: profileData.phoneNo || "",
      gender: profileData.gender || "Other",
      dateOfBirth: profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toISOString().split("T")[0] : "",
      address: profileData.address || "",
      city: profileData.city || "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Handle Profile Submit
  const onProfileSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    try {
      const formData = new FormData();
      
      // Build update payload
      const payload: Record<string, any> = {
        gender: data.gender,
        address: data.address || "",
        city: data.city || "",
      };
      
      if (data.phoneNo) {
        payload.phoneNo = data.phoneNo;
      }
      if (data.dateOfBirth) {
        payload.dateOfBirth = data.dateOfBirth;
      }

      formData.append("data", JSON.stringify(payload));
      
      if (selectedFile) {
        formData.append("profilePhoto", selectedFile);
      }

      const res = await updateMyProfile(formData);
      if (res?.success) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error(res?.message || "Failed to update profile.");
      }
    } catch {
      toast.error("An error occurred while updating profile.");
    }
  };

  // Handle Password Submit
  const onPasswordSubmit: SubmitHandler<PasswordFormValues> = async (data) => {
    try {
      const res = await changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });

      if (res?.success) {
        toast.success("Password changed successfully!");
        passwordForm.reset();
      } else {
        toast.error(res?.message || "Failed to change password. Double check your current password.");
      }
    } catch {
      toast.error("An error occurred while updating password.");
    }
  };

  // File Change Helper
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Profile Details Form */}
      <div className="lg:col-span-2 bg-card border border-border/60 p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
        <div className="flex gap-2 items-center text-foreground font-black text-xl pb-2 border-b">
          <User className="w-5 h-5 text-primary" />
          <h2>Edit Customer Profile</h2>
        </div>

        <Form {...profileForm}>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
            {/* Profile photo uploader */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary bg-muted">
                {photoPreview ? (
                  <Image src={photoPreview} alt="profile preview" fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-bold text-lg text-muted-foreground uppercase">
                    {userProfile?.name?.slice(0, 2) || "US"}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-photo" className="cursor-pointer">
                  <div className="flex gap-2 items-center px-4 py-2 border rounded-full text-xs font-semibold hover:bg-muted/40 transition">
                    <UploadCloud className="w-4 h-4 text-primary" />
                    Upload Photo
                  </div>
                </Label>
                <input
                  id="profile-photo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <p className="text-[10px] text-muted-foreground">Supported formats: JPG, PNG. Max size: 2MB.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Full Name Display */}
              <div>
                <Label className="text-xs">User Full Name (Read-only)</Label>
                <Input value={userProfile?.name || ""} disabled className="mt-1.5" />
              </div>

              {/* Phone No */}
              <FormField
                control={profileForm.control}
                name="phoneNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (11 digits)</FormLabel>
                    <FormControl>
                      <Input placeholder="01712345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Gender */}
              <FormField
                control={profileForm.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* DOB */}
              <FormField
                control={profileForm.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* City selector */}
              <FormField
                control={profileForm.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select City" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address */}
              <FormField
                control={profileForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Gulshan St, Dhaka" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={profileForm.formState.isSubmitting}
              className="rounded-full px-6 font-bold"
            >
              {profileForm.formState.isSubmitting ? "Saving Changes..." : "Save Settings"}
            </Button>
          </form>
        </Form>
      </div>

      {/* Change Password Form */}
      <div className="bg-card border border-border/60 p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
        <div className="flex gap-2 items-center text-foreground font-black text-xl pb-2 border-b">
          <KeyRound className="w-5 h-5 text-indigo-500" />
          <h2>Change Password</h2>
        </div>

        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            <FormField
              control={passwordForm.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={passwordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={passwordForm.formState.isSubmitting}
              variant="outline"
              className="w-full rounded-full font-bold border-indigo-500/20 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950"
            >
              {passwordForm.formState.isSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
