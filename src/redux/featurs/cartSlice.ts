import { IProduct } from "@/types/product";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface ICartProduct extends IProduct {
  orderedQuantity: number;
}

interface InitialState {
  products: ICartProduct[];
  city: string;
  shippingAddress: string;
}

const initialState: InitialState = {
  products: [],
  city: "",
  shippingAddress: "",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProduct: (state, action) => {
      // Support both direct product payload and wrapper payload with quantity
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
    incrementOrderedQuantity: (state, action) => {
      const productToIncrement = state.products.find(
        (product) => product._id === action.payload
      );

      if (productToIncrement) {
        productToIncrement.orderedQuantity += 1;
        return;
      }
    },
    decrementOrderedQuantity: (state, action) => {
      const productToDecrement = state.products.find(
        (product) => product._id === action.payload
      );

      if (productToDecrement && productToDecrement.orderedQuantity > 1) {
        productToDecrement.orderedQuantity -= 1;
        return;
      }
    },
    removeProduct: (state, action) => {
      state.products = state.products.filter(
        (product) => product._id !== action.payload
      );
    },
    updateCity: (state, action) => {
      state.city = action.payload;
    },
    updateShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
    },
    clearCart:(state) =>{
      state.products = [];
      state.city = "";
      state.shippingAddress = "";
    }
  },
});

// product related selectors
export const orderedProductsSelector = (state: RootState) => {
  return state.cart.products;
};

export const orderSelector = (state: RootState) => {
  return {
    products: state.cart.products.map((product) => ({
      product: product._id,
      quantity: product.orderedQuantity,
      color:"white"
    })),
    shippingAddress: `${state.cart.shippingAddress} - ${state.cart.city}`,
    paymentMethod: "Online",
  };
};

//payment related selectors
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


export const grandTotalSelector = (state: RootState) => {
  const subTotal = subTotalSelector(state);
  const shippingCost = shippingCostSelector(state);
  return subTotal + shippingCost;

}

// address related selectors

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
  clearCart
} = cartSlice.actions;
export default cartSlice.reducer;
