"use client";

import React, { useState } from "react";
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
import { updateMyProfile } from "@/services/user";
import { changePassword } from "@/services/AuthService";
import Image from "next/image";
import { User, KeyRound, UploadCloud, Eye, EyeOff } from "lucide-react";

// 1. Profile Validation Schema
const profileSchema = z.object({
  phoneNo: z
    .string()
    .regex(/^\d{11}$/, "Phone number must be exactly 11 digits long")
    .or(z.literal("")),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

// 2. Password Validation Schema
const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

interface AdminProfileContainerProps {
  userProfile: any;
}

export default function AdminProfileContainer({
  userProfile,
}: AdminProfileContainerProps) {
  const profileData = userProfile?.profile || {};
  const [photoPreview, setPhotoPreview] = useState<string | null>(profileData.photo || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Password visibility states
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Initialize Forms
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      phoneNo: profileData.phoneNo || "",
      dateOfBirth: profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toISOString().split("T")[0] : "",
      address: profileData.address || "",
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
      
      const payload: Record<string, any> = {
        address: data.address || "",
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
        toast.error(res?.message || "Failed to change password. Ensure your current password is correct.");
      }
    } catch {
      toast.error("An error occurred while updating password.");
    }
  };

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
      {/* Profile Details Form (Left Column, span 2) */}
      <div className="lg:col-span-2 bg-card border border-border/60 p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
        <div className="flex gap-2 items-center text-foreground font-black text-lg pb-2 border-b">
          <User className="w-5 h-5 text-primary" />
          <h2>Edit Admin Profile Info</h2>
        </div>

        <Form {...profileForm}>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
            {/* Profile photo uploader */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary bg-muted shrink-0">
                {photoPreview ? (
                  <Image src={photoPreview} alt="profile preview" fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-bold text-lg text-muted-foreground uppercase">
                    {userProfile?.name?.slice(0, 2) || "AD"}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-photo" className="cursor-pointer">
                  <div className="flex gap-2 items-center px-4 py-2 border rounded-full text-xs font-semibold hover:bg-muted/40 transition bg-card">
                    <UploadCloud className="w-4 h-4 text-primary" />
                    Change Photo
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
                <Label className="text-xs font-bold">Admin Full Name (Read-only)</Label>
                <Input value={userProfile?.name || ""} disabled className="mt-1.5 h-9 rounded-xl text-xs bg-muted/50" />
              </div>

              {/* Email Display */}
              <div>
                <Label className="text-xs font-bold">Email Address (Read-only)</Label>
                <Input value={userProfile?.email || ""} disabled className="mt-1.5 h-9 rounded-xl text-xs bg-muted/50 font-mono" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Phone No */}
              <FormField
                control={profileForm.control}
                name="phoneNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold">Phone Number (11 digits)</FormLabel>
                    <FormControl>
                      <Input placeholder="01712345678" {...field} className="h-9 rounded-xl text-xs" />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              {/* DOB */}
              <FormField
                control={profileForm.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold">Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="h-9 rounded-xl text-xs" />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>

            {/* Address */}
            <FormField
              control={profileForm.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold">Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Admin Lane, Dhaka" {...field} className="h-9 rounded-xl text-xs" />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={profileForm.formState.isSubmitting}
              className="rounded-full px-6 font-bold text-xs h-9"
            >
              {profileForm.formState.isSubmitting ? "Saving Changes..." : "Save Profile Settings"}
            </Button>
          </form>
        </Form>
      </div>

      {/* Change Password Form (Right Column) */}
      <div className="bg-card border border-border/60 p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
        <div className="flex gap-2 items-center text-foreground font-black text-lg pb-2 border-b">
          <KeyRound className="w-5 h-5 text-indigo-500" />
          <h2>Change Password</h2>
        </div>

        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            {/* Current Password */}
            <FormField
              control={passwordForm.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold">Current Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showOldPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                        className="h-9 rounded-xl text-xs pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowOldPassword((prev) => !prev)}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full text-muted-foreground hover:bg-transparent"
                      >
                        {showOldPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            {/* New Password */}
            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold">New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                        className="h-9 rounded-xl text-xs pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full text-muted-foreground hover:bg-transparent"
                      >
                        {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            {/* Confirm New Password */}
            <FormField
              control={passwordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold">Confirm New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                        className="h-9 rounded-xl text-xs pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full text-muted-foreground hover:bg-transparent"
                      >
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={passwordForm.formState.isSubmitting}
              className="w-full rounded-full font-bold h-9 text-xs mt-2 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {passwordForm.formState.isSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
