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
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPassword } from "@/services/AuthService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Logo from "@/assets/svgs/Logo";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<ForgotPasswordValues> = async (data) => {
    try {
      const res = await forgotPassword(data.email);
      if (res?.success) {
        toast.success(res?.message || "OTP sent to your email.");
        router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
      } else {
        toast.error(res?.message || "Failed to send OTP.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to submit. Please try again.");
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-background px-4">
      <div className="border border-border/80 bg-card rounded-2xl flex-grow max-w-md w-full p-6 shadow-md space-y-6">
        <div className="flex items-center space-x-4">
          <Logo />
          <div>
            <h1 className="text-xl font-black text-foreground">Forgot Password</h1>
            <p className="text-xs text-muted-foreground">Enter email to receive code.</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={isSubmitting}
              type="submit"
              className="mt-2 w-full rounded-full font-bold"
            >
              {isSubmitting ? "Sending OTP..." : "Send OTP"}
            </Button>
          </form>
        </Form>

        <p className="text-xs text-muted-foreground text-center">
          Remember your password?{" "}
          <Link href="/login" className="text-primary hover:underline font-bold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
