"use client";

import Image from "next/image";
import emptyCart from "@/assets/empty-cart.png";
import CartProductCard from "./CartProductCard";
import { useAppSelector } from "@/redux/hooks";
import { ICartProduct, orderedProductsSelector } from "@/redux/featurs/cartSlice";

export default function CartProducts() {
  const products = useAppSelector(orderedProductsSelector);

  return (
    <div className="border border-border/60 bg-card rounded-3xl col-span-12 lg:col-span-8 p-6 md:p-8 space-y-6 shadow-sm">
      {products.length === 0 ? (
        <div className="text-center text-muted-foreground py-10 space-y-4">
          <p className="text-lg font-bold text-foreground">Your cart is empty</p>
          <p className="text-xs max-w-sm mx-auto leading-relaxed">
            Looks like your cart is on vacation—bring it back to work by adding some items!
          </p>
          <div className="flex justify-center items-center pt-4">
            <Image src={emptyCart} alt="empty cart" className="max-w-[200px]" />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product: ICartProduct) => (
            <CartProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}