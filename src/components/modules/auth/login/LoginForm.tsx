"use client";

import ReCAPTCHA from "react-google-recaptcha";
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
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser, reCaptchaTokenVerification } from "@/services/AuthService";
import { toast } from "sonner";
import { loginSchema } from "./loginValidation";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "@/assets/svgs/Logo";
import { Eye, EyeOff, AlertTriangle } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useUser } from "@/context/UserContext";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirectPath");
  const { setIsLoading } = useUser();

  const [showPassword, setShowPassword] = useState(false);
  const [reCaptchaStatus, setReCaptchaStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const handleReCaptcha = async (value: string | null) => {
    try {
      const res = await reCaptchaTokenVerification(value!);
      if (res?.success) {
        setReCaptchaStatus(true);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setErrorMessage(null);
    try {
      const res = await loginUser(data);
      if (res?.success) {
        toast.success(res?.message || "Logged in successfully!");
        setIsLoading(true);

        let role = "user";
        try {
          const decoded = jwtDecode<any>(res.data.accessToken);
          role = decoded?.role || "user";
        } catch (err) {
          console.error("Error decoding token:", err);
        }

        if (redirect) {
          router.push(redirect);
        } else if (role === "admin") {
          router.push("/admin");
        } else {
          router.push("/user/dashboard");
        }
      } else {
        setErrorMessage(res?.message || "Invalid email or password.");
        toast.error(res?.message || "Login failed");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage("Something went wrong. Please check your credentials.");
    }
  };

  // Demo pre-fill helper
  const handleDemoLogin = (email: string, pass: string) => {
    form.setValue("email", email);
    form.setValue("password", pass);
  };

  return (
    <div className="border border-border/80 bg-card rounded-2xl flex-grow max-w-md w-full p-6 shadow-md space-y-6">
      <div className="flex items-center space-x-4">
        <Logo />
        <div>
          <h1 className="text-xl font-black text-foreground">Login</h1>
          <p className="text-xs text-muted-foreground">Welcome back! Access your workspace.</p>
        </div>
      </div>

      {errorMessage && (
        <div className="flex gap-2 items-start bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 p-4 rounded-xl text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="font-semibold leading-relaxed">{errorMessage}</p>
        </div>
      )}

      {/* Demo pre-fill buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-full text-xs font-semibold"
          onClick={() => handleDemoLogin("admin.example@gmail.com", "adminPassword@1")}
        >
          Demo Admin
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-full text-xs font-semibold"
          onClick={() => handleDemoLogin("user.example@gmail.com", "userPassword@1")}
        >
          Demo User
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Password</FormLabel>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-primary hover:underline font-semibold"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT_KEY && (
            <div className="flex mt-3 w-full justify-center">
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT_KEY}
                onChange={handleReCaptcha}
                className="mx-auto"
              />
            </div>
          )}

          <Button
            disabled={
              (!!process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT_KEY && !reCaptchaStatus) ||
              isSubmitting
            }
            type="submit"
            className="mt-2 w-full rounded-full font-bold"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Form>

      {/* Google Login Social Indicator */}
      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-border/80" />
        <span className="flex-shrink mx-4 text-muted-foreground text-xs font-semibold uppercase tracking-widest">Or Continue With</span>
        <div className="flex-grow border-t border-border/80" />
      </div>

      <Button variant="outline" className="w-full rounded-full flex gap-2 items-center justify-center font-bold">
        {/* Mock Google SVG logo */}
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.478 0-6.3-2.822-6.3-6.3s2.822-6.3 6.3-6.3c1.554 0 2.977.567 4.084 1.503l3.056-3.056C19.124 2.502 15.86 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.046 0 10.971-4.384 10.971-11.24 0-.74-.085-1.44-.24-1.955H12.24z"
          />
        </svg>
        Google Login
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-primary hover:underline font-bold">
          Register
        </Link>
      </p>
    </div>
  );
}
