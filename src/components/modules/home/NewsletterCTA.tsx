"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import NMContainer from "@/components/ui/core/NMContainer";
import { Send, CheckCircle2 } from "lucide-react";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type EmailFormValues = z.infer<typeof emailSchema>;

export default function NewsletterCTA() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const onSubmit: SubmitHandler<EmailFormValues> = async () => {
    try {
      // Mock API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Subscribed successfully! Welcome to NextMart updates.");
      setIsSubscribed(true);
      form.reset();
    } catch {
      toast.error("Subscription failed. Please try again.");
    }
  };

  return (
    <NMContainer>
      <div className="my-16 bg-gradient-to-r from-primary/90 to-indigo-800 rounded-3xl p-8 md:p-12 text-white shadow-lg relative overflow-hidden">
        {/* Background glow overlay */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl mx-auto text-center space-y-6 relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Stay in the Loop
          </h2>
          <p className="text-sm md:text-base text-slate-100/80 max-w-lg mx-auto">
            Subscribe to our weekly newsletter and be the first to receive notifications on trending products, exclusive vouchers, and seasonal flash sales!
          </p>

          {isSubscribed ? (
            <div className="flex flex-col items-center gap-2 py-4 animate-in fade-in zoom-in-95 duration-300">
              <CheckCircle2 className="w-12 h-12 text-emerald-400" />
              <p className="text-lg font-bold">You are subscribed!</p>
              <p className="text-xs text-slate-200">Check your inbox for a verification email shortly.</p>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col sm:flex-row gap-3 items-start justify-center max-w-md mx-auto"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          className="bg-white/10 border-white/20 text-white placeholder-white/50 rounded-full py-5 px-6 focus:border-white focus:ring-0 focus-visible:ring-0 w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-300 mt-1 text-xs text-left pl-4" />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="rounded-full bg-white text-primary hover:bg-slate-100 font-bold px-6 py-5 shrink-0 w-full sm:w-auto"
                >
                  {form.formState.isSubmitting ? (
                    "Joining..."
                  ) : (
                    <span className="flex gap-2 items-center justify-center">
                      Subscribe <Send className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>
            </Form>
          )}
        </div>
      </div>
    </NMContainer>
  );
}
