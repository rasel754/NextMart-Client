import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addProduct,
  removeProduct,
  orderedProductsSelector,
  grandTotalSelector,
} from "@/redux/featurs/cartSlice";
import { IProduct } from "@/types/product";

export const useCart = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(orderedProductsSelector);
  const cartTotal = useAppSelector(grandTotalSelector);

  const cartCount = products.reduce((acc, p) => acc + p.orderedQuantity, 0);

  const addToCart = (product: IProduct, quantity: number = 1) => {
    dispatch(addProduct({ product, quantity }));
  };

  const removeFromCart = (id: string) => {
    dispatch(removeProduct(id));
  };

  const isInCart = (id: string) => {
    return products.some((p) => p._id === id);
  };

  return {
    addToCart,
    removeFromCart,
    cartCount,
    cartTotal,
    isInCart,
    products,
  };
};
