"use client";

import { Button } from "@/components/ui/button";
import { curencyFormatter } from "@/lib/currencyFormatter";
import {
  decrementOrderedQuantity,
  ICartProduct,
  incrementOrderedQuantity,
  removeProduct,
} from "@/redux/featurs/cartSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Minus, Plus, Trash } from "lucide-react";
import Image from "next/image";

export default function CartProductCard({ product }: { product: ICartProduct }) {
  const dispatch = useAppDispatch();

  const handleIncrementQuantity = (id: string) => {
    dispatch(incrementOrderedQuantity(id));
  };

  const handleDecrementQuantity = (id: string) => {
    dispatch(decrementOrderedQuantity(id));
  };

  const handleRemoveProduct = (id: string) => {
    dispatch(removeProduct(id));
  };

  return (
    <div className="bg-card/50 border border-border/60 rounded-2xl flex flex-col sm:flex-row p-4 gap-4 shadow-sm">
      {/* Product Image */}
      <div className="relative h-28 w-28 mx-auto sm:mx-0 rounded-xl overflow-hidden border shrink-0">
        <Image
          src={product?.imageUrls?.[0] || "https://psediting.websites.co.in/obaju-turquoise/img/product-placeholder.png"}
          height={150}
          width={150}
          alt="product"
          className="aspect-square object-cover"
        />
      </div>

      {/* Details info */}
      <div className="flex flex-col justify-between flex-grow text-sm">
        <div>
          <h3 className="text-base font-bold text-foreground line-clamp-1">{product?.name}</h3>
          <div className="flex gap-4 my-1.5 text-xs text-muted-foreground">
            <p>
              <span>Color:</span> <span className="font-bold text-foreground">White</span>
            </p>
            <p>
              <span>Stock:</span> <span className="font-bold text-foreground">{product?.stock}</span>
            </p>
          </div>
        </div>

        <hr className="border-border/40 my-2" />

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h4 className="font-extrabold text-foreground">
            Price: {product.offerPrice ? curencyFormatter(product.offerPrice) : curencyFormatter(product.price)}
          </h4>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-semibold">Quantity</span>
            <Button
              onClick={() => handleDecrementQuantity(product._id)}
              variant="outline"
              disabled={product.orderedQuantity <= 1}
              className="w-7 h-7 p-0 rounded-full"
            >
              <Minus className="w-3.5 h-3.5" />
            </Button>
            <span className="font-bold text-sm min-w-[20px] text-center">
              {product?.orderedQuantity}
            </span>
            <Button
              onClick={() => handleIncrementQuantity(product._id)}
              variant="outline"
              disabled={product.orderedQuantity >= product.stock}
              className="w-7 h-7 p-0 rounded-full"
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
            <Button
              onClick={() => handleRemoveProduct(product._id)}
              variant="ghost"
              size="icon"
              className="w-7 h-7 rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
            >
              <Trash className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}