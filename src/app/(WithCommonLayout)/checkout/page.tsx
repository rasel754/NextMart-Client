"use client";

import { useEffect, useState, Suspense } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useUser } from "@/context/UserContext";
import { useCart } from "@/hooks/useCart";
import { createOrder } from "@/services/cart";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  clearCart,
  citySelector,
  couponCodeSelector,
  couponDiscountSelector,
  shippingCostSelector,
  subTotalSelector,
  updateCity,
  updateShippingAddress,
} from "@/redux/featurs/cartSlice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import NMContainer from "@/components/ui/core/NMContainer";
import ProductBanner from "@/components/modules/products/banner";
import { cities } from "@/contants/cities";
import { curencyFormatter } from "@/lib/currencyFormatter";
import Image from "next/image";
import { ShieldCheck, Truck, Loader2 } from "lucide-react";

// Checkout Validation Schema
const checkoutSchema = z.object({
  name: z.string().min(2, "Full Name is required"),
  phone: z.string().regex(/^\d{11}$/, "Phone number must be exactly 11 digits long"),
  address: z.string().min(5, "Address Line must be at least 5 characters long"),
  city: z.string().min(1, "Please select a city"),
  postalCode: z.string().min(4, "Postal code must be at least 4 digits"),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

function CheckoutFormContent() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isLoading: userLoading } = useUser();
  const { products, cartTotal } = useCart();

  const subTotal = useAppSelector(subTotalSelector);
  const shippingCost = useAppSelector(shippingCostSelector);
  const discount = useAppSelector(couponDiscountSelector);
  const couponCode = useAppSelector(couponCodeSelector);
  const defaultCity = useAppSelector(citySelector);

  const [loading, setLoading] = useState(false);

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: user?.name || "",
      phone: "",
      address: "",
      city: defaultCity || "",
      postalCode: "",
    },
  });

  // Keep form in sync when user loads
  useEffect(() => {
    if (user) {
      form.setValue("name", user.name);
    }
  }, [user, form]);

  // Protect page on mount
  useEffect(() => {
    if (!userLoading && !user) {
      toast.error("Please login to access checkout");
      router.push("/login?redirectPath=/checkout");
    }
  }, [user, userLoading, router]);

  const handleCityChange = (city: string) => {
    form.setValue("city", city);
    dispatch(updateCity(city));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("address", e.target.value);
    dispatch(updateShippingAddress(e.target.value));
  };

  const onSubmit: SubmitHandler<CheckoutValues> = async (data) => {
    if (products.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);
    const orderLoading = toast.loading("Initiating payment session...");

    try {
      const orderPayload = {
        products: products.map((p) => ({
          product: p._id,
          quantity: p.orderedQuantity,
          color: "white",
        })),
        shippingAddress: `${data.address}, ${data.city} - ${data.postalCode}`,
        paymentMethod: "Online",
        coupon: couponCode || undefined,
      };

      const res = await createOrder(orderPayload);
      if (res?.success && res?.data?.paymentUrl) {
        toast.success("Order initiated! Redirecting to payment portal...", { id: orderLoading });
        dispatch(clearCart());
        router.push(res.data.paymentUrl);
      } else {
        toast.error(res?.message || "Failed to initiate checkout. Please try again.", { id: orderLoading });
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred during order submission.", { id: orderLoading });
    } finally {
      setLoading(false);
    }
  };

  if (userLoading || !user) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-10">
      {/* Shipping address form */}
      <div className="lg:col-span-7 bg-card border border-border/60 p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Shipping Address</h2>
          <p className="text-xs text-muted-foreground mt-1">Provide your delivery details below.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
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

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <Select value={field.value} onValueChange={handleCityChange}>
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
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Apartment, suite, unit, building, street, etc."
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleAddressChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input placeholder="1212" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-full font-bold py-6 text-sm flex gap-2 items-center justify-center mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Placing Order...
                </>
              ) : (
                "Place Order & Pay"
              )}
            </Button>
          </form>
        </Form>
      </div>

      {/* Order summary panel */}
      <div className="lg:col-span-5 bg-card border border-border/60 p-6 rounded-3xl shadow-sm h-fit space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Order Summary</h2>
          <p className="text-xs text-muted-foreground mt-1">Review your items and price details.</p>
        </div>

        {/* Cart items list */}
        <div className="divide-y divide-border/40 max-h-60 overflow-y-auto pr-1">
          {products.map((p) => (
            <div key={p._id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-muted/40 border">
                <Image src={p.imageUrls?.[0]} alt={p.name} fill className="object-cover" />
              </div>
              <div className="flex-grow min-w-0">
                <h4 className="text-xs font-bold text-foreground truncate">{p.name}</h4>
                <p className="text-[10px] text-muted-foreground">Qty: {p.orderedQuantity}</p>
              </div>
              <p className="text-xs font-bold text-foreground shrink-0 text-right">
                {curencyFormatter((p.offerPrice || p.price) * p.orderedQuantity)}
              </p>
            </div>
          ))}
        </div>

        <hr className="border-border/40" />

        {/* Price layout details */}
        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between items-center text-muted-foreground">
            <span>Subtotal</span>
            <span className="font-semibold text-foreground">{curencyFormatter(subTotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400">
              <span>Discount</span>
              <span className="font-bold">-{curencyFormatter(discount)}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-muted-foreground">
            <span>Shipping</span>
            <span className="font-semibold text-foreground">{curencyFormatter(shippingCost)}</span>
          </div>
          <hr className="border-border/40 my-1" />
          <div className="flex justify-between items-center text-sm font-bold text-foreground">
            <span>Total</span>
            <span className="text-base font-black text-primary">{curencyFormatter(cartTotal)}</span>
          </div>
        </div>

        {/* Trust elements */}
        <div className="bg-muted/30 border border-border/40 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Secure Transactions</span>
          </div>
          <div className="flex items-center gap-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            <Truck className="w-4 h-4 text-primary" />
            <span>On-Time Delivery Guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <NMContainer>
      <ProductBanner title="Checkout" path="Home - Checkout" />
      <Suspense fallback={
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }>
        <CheckoutFormContent />
      </Suspense>
    </NMContainer>
  );
}
