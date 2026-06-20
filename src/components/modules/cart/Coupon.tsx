"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Trash, CheckCircle } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { toast } from "sonner";
import { validateCoupon } from "@/services/Coupon";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  applyCoupon,
  removeCoupon,
  couponCodeSelector,
  couponDiscountSelector,
} from "@/redux/featurs/cartSlice";
import { useEffect } from "react";

export default function Coupon() {
  const dispatch = useAppDispatch();
  const activeCoupon = useAppSelector(couponCodeSelector);
  const discountAmount = useAppSelector(couponDiscountSelector);

  const form = useForm({
    defaultValues: {
      coupon: activeCoupon || "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const couponInput = form.watch("coupon");

  // Keep form value in sync with redux state (e.g. if cleared from other places)
  useEffect(() => {
    form.setValue("coupon", activeCoupon || "");
  }, [activeCoupon, form]);

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    form.setValue("coupon", "");
    toast.success("Coupon removed.");
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const couponCode = data.coupon?.trim();
    if (!couponCode) return;

    try {
      const res = await validateCoupon(couponCode);
      if (res?.success && res.data) {
        const coupon = res.data;
        const type = coupon.type || coupon.discountType || "flat";
        const discount = coupon.discount || coupon.value || 0;

        dispatch(
          applyCoupon({
            code: coupon.code || couponCode,
            discount: Number(discount),
            type: type,
          })
        );
        toast.success(`Coupon applied successfully!`);
      } else {
        toast.error(res?.message || "Invalid or expired coupon code.");
      }
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || "Failed to validate coupon.");
    }
  };

  return (
    <div className="border border-border/60 bg-card rounded-2xl col-span-12 md:col-span-4 p-5 shadow-sm">
      <div className="flex flex-col justify-between h-full space-y-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Use Coupon Code</h1>
          <p className="text-xs text-muted-foreground mt-1">Enter your coupon code if you have one.</p>
        </div>

        <Form {...form}>
          <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="coupon"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        disabled={!!activeCoupon}
                        className="rounded-full pr-10 focus-visible:ring-primary"
                        placeholder="Promo / Coupon code"
                      />
                      {activeCoupon && (
                        <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                      )}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            {activeCoupon && (
              <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 p-3 rounded-xl text-xs font-semibold">
                Coupon applied! You saved ${discountAmount.toLocaleString()}
              </div>
            )}

            <div className="flex gap-2">
              {!activeCoupon ? (
                <Button
                  disabled={!couponInput || isSubmitting}
                  type="submit"
                  className="w-full rounded-full font-bold"
                >
                  {isSubmitting ? "Applying..." : "Apply Coupon"}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleRemoveCoupon}
                  className="w-full rounded-full font-bold flex gap-2 items-center justify-center"
                >
                  <Trash className="w-4 h-4" /> Remove Coupon
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}