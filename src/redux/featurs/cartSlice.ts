import { IProduct } from "@/types/product";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface ICartProduct extends IProduct {
  orderedQuantity: number;
}

interface InitialState {
  products: ICartProduct[];
  city: string;
  shippingAddress: string;
  couponCode: string | null;
  couponDiscount: number;
  couponDiscountType: "flat" | "percentage" | null;
}

const initialState: InitialState = {
  products: [],
  city: "",
  shippingAddress: "",
  couponCode: null,
  couponDiscount: 0,
  couponDiscountType: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProduct: (state, action) => {
      const product = action.payload.product || action.payload;
      const qty = action.payload.quantity || 1;

      const productToAdd = state.products.find(
        (p) => p._id === product._id
      );

      if (productToAdd) {
        productToAdd.orderedQuantity += qty;
        return;
      }
      state.products.push({ ...product, orderedQuantity: qty });
    },
    incrementOrderedQuantity: (state, action: PayloadAction<string>) => {
      const productToIncrement = state.products.find(
        (product) => product._id === action.payload
      );

      if (productToIncrement) {
        productToIncrement.orderedQuantity += 1;
        return;
      }
    },
    decrementOrderedQuantity: (state, action: PayloadAction<string>) => {
      const productToDecrement = state.products.find(
        (product) => product._id === action.payload
      );

      if (productToDecrement && productToDecrement.orderedQuantity > 1) {
        productToDecrement.orderedQuantity -= 1;
        return;
      }
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(
        (product) => product._id !== action.payload
      );
    },
    updateCity: (state, action: PayloadAction<string>) => {
      state.city = action.payload;
    },
    updateShippingAddress: (state, action: PayloadAction<string>) => {
      state.shippingAddress = action.payload;
    },
    applyCoupon: (
      state,
      action: PayloadAction<{ code: string; discount: number; type: "flat" | "percentage" }>
    ) => {
      state.couponCode = action.payload.code;
      state.couponDiscount = action.payload.discount;
      state.couponDiscountType = action.payload.type;
    },
    removeCoupon: (state) => {
      state.couponCode = null;
      state.couponDiscount = 0;
      state.couponDiscountType = null;
    },
    clearCart: (state) => {
      state.products = [];
      state.city = "";
      state.shippingAddress = "";
      state.couponCode = null;
      state.couponDiscount = 0;
      state.couponDiscountType = null;
    },
  },
});

// selectors
export const orderedProductsSelector = (state: RootState) => {
  return state.cart.products;
};

export const orderSelector = (state: RootState) => {
  return {
    products: state.cart.products.map((product) => ({
      product: product._id,
      quantity: product.orderedQuantity,
      color: "white",
    })),
    shippingAddress: `${state.cart.shippingAddress} - ${state.cart.city}`,
    paymentMethod: "Online",
    coupon: state.cart.couponCode || undefined,
  };
};

export const subTotalSelector = (state: RootState) => {
  return state.cart.products.reduce((acc, product) => {
    if (product.offerPrice) {
      return acc + product.offerPrice * product.orderedQuantity;
    } else {
      return acc + product.price * product.orderedQuantity;
    }
  }, 0);
};

export const shippingCostSelector = (state: RootState) => {
  if (
    state.cart.city &&
    state.cart.city === "Dhaka" &&
    state.cart.products.length > 0
  ) {
    return 50;
  } else if (
    state.cart.city &&
    state.cart.city !== "Dhaka" &&
    state.cart.products.length > 0
  ) {
    return 100;
  } else {
    return 0;
  }
};

export const couponCodeSelector = (state: RootState) => {
  return state.cart.couponCode;
};

export const couponDiscountSelector = (state: RootState) => {
  const subTotal = subTotalSelector(state);
  const discount = state.cart.couponDiscount || 0;
  const type = state.cart.couponDiscountType;
  if (type === "percentage") {
    return (subTotal * discount) / 100;
  }
  return discount;
};

export const grandTotalSelector = (state: RootState) => {
  const subTotal = subTotalSelector(state);
  const shippingCost = shippingCostSelector(state);
  const discount = couponDiscountSelector(state);
  const total = subTotal + shippingCost - discount;
  return total > 0 ? total : 0;
};

export const citySelector = (state: RootState) => {
  return state.cart.city;
};

export const shippingAddressSelector = (state: RootState) => {
  return state.cart.shippingAddress;
};

export const {
  addProduct,
  incrementOrderedQuantity,
  decrementOrderedQuantity,
  removeProduct,
  updateCity,
  updateShippingAddress,
  applyCoupon,
  removeCoupon,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
