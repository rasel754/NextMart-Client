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
import { SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyOtp } from "@/services/AuthService";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "@/assets/svgs/Logo";
import { z } from "zod";
import OtpInput from "@/components/ui/core/OtpInput";
import { Suspense } from "react";

const verifyOtpSchema = z.object({
  otp: z.string().length(6, "Verification code must be exactly 6 digits"),
});

type VerifyOtpValues = z.infer<typeof verifyOtpSchema>;

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const form = useForm<VerifyOtpValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<VerifyOtpValues> = async (data) => {
    if (!email) {
      toast.error("Email is missing. Please start over.");
      return;
    }

    try {
      const res = await verifyOtp(email, data.otp);
      if (res?.success) {
        toast.success(res?.message || "OTP verified successfully!");
        router.push(
          `/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(data.otp)}`
        );
      } else {
        toast.error(res?.message || "Invalid or expired OTP.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to verify. Please try again.");
    }
  };

  return (
    <div className="border border-border/80 bg-card rounded-2xl flex-grow max-w-md w-full p-6 shadow-md space-y-6">
      <div className="flex items-center space-x-4">
        <Logo />
        <div>
          <h1 className="text-xl font-black text-foreground">Verify Code</h1>
          <p className="text-xs text-muted-foreground">Enter 6-digit OTP code sent to: <span className="font-semibold text-primary">{email}</span></p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">One-Time Password</FormLabel>
                <FormControl>
                  <OtpInput value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage className="text-center" />
              </FormItem>
            )}
          />

          <Button
            disabled={isSubmitting}
            type="submit"
            className="w-full rounded-full font-bold"
          >
            {isSubmitting ? "Verifying..." : "Verify Code"}
          </Button>
        </form>
      </Form>

      <p className="text-xs text-muted-foreground text-center">
        Didn&apos;t get code?{" "}
        <Link href="/forgot-password" className="text-primary hover:underline font-bold">
          Resend OTP
        </Link>
      </p>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <div className="h-screen w-screen flex justify-center items-center bg-background px-4">
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyOtpForm />
      </Suspense>
    </div>
  );
}
