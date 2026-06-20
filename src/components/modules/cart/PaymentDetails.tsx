"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { curencyFormatter } from "@/lib/currencyFormatter";
import {
  citySelector,
  couponDiscountSelector,
  grandTotalSelector,
  orderedProductsSelector,
  shippingCostSelector,
  subTotalSelector,
} from "@/redux/featurs/cartSlice";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function PaymentDetails() {
  const subTotal = useAppSelector(subTotalSelector);
  const shippingCost = useAppSelector(shippingCostSelector);
  const discount = useAppSelector(couponDiscountSelector);
  const grandTotal = useAppSelector(grandTotalSelector);
  const city = useAppSelector(citySelector);
  const cartProduct = useAppSelector(orderedProductsSelector);
  const { user } = useUser();
  const router = useRouter();

  const handleProceedToCheckout = () => {
    if (cartProduct.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (!user) {
      toast.error("Please login to proceed to checkout");
      router.push("/login?redirectPath=/checkout");
      return;
    }
    if (!city) {
      toast.error("Please select a shipping city");
      return;
    }
    router.push("/checkout");
  };

  return (
    <div className="border border-border/60 bg-card rounded-2xl col-span-12 md:col-span-4 h-fit p-5 shadow-sm space-y-4">
      <h1 className="text-xl font-bold text-foreground">Payment Details</h1>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">Subtotal</p>
          <p className="font-semibold text-foreground">{curencyFormatter(subTotal)}</p>
        </div>
        <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400">
          <p className="font-medium">Coupon Discount</p>
          <p className="font-bold">-{curencyFormatter(discount)}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">Shipment Cost</p>
          <p className="font-semibold text-foreground">{curencyFormatter(shippingCost)}</p>
        </div>
      </div>

      <hr className="border-border/40" />

      <div className="flex justify-between items-center py-2">
        <p className="text-sm font-bold text-foreground">Grand Total</p>
        <p className="text-lg font-black text-primary">{curencyFormatter(grandTotal)}</p>
      </div>

      <Button
        onClick={handleProceedToCheckout}
        disabled={cartProduct.length === 0}
        className="w-full rounded-full font-bold py-6 text-sm"
      >
        Proceed to Checkout
      </Button>
    </div>
  );
}
