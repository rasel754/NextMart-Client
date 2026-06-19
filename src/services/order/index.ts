"use server";

import { cookies } from "next/headers";

// Get logged-in user's orders
export const getMyOrders = async (query?: Record<string, any>) => {
  try {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== "") {
          params.append(key, val.toString());
        }
      });
    }
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/order/my-orders?${params.toString()}`,
      {
        headers: {
          Authorization: (await cookies()).get("accessToken")?.value || "",
        },
        next: {
          tags: ["ORDER"],
        },
      }
    );
    return await res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};

// Get shop orders (for vendor)
export const getMyShopOrders = async (query?: Record<string, any>) => {
  try {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== "") {
          params.append(key, val.toString());
        }
      });
    }
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/order/my-shop-orders?${params.toString()}`,
      {
        headers: {
          Authorization: (await cookies()).get("accessToken")?.value || "",
        },
        next: {
          tags: ["ORDER"],
        },
      }
    );
    return await res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};

// Get all orders (for admin)
export const getAllOrders = async (query?: Record<string, any>) => {
  try {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== "") {
          params.append(key, val.toString());
        }
      });
    }
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/order?${params.toString()}`,
      {
        headers: {
          Authorization: (await cookies()).get("accessToken")?.value || "",
        },
        next: {
          tags: ["ORDER"],
        },
      }
    );
    return await res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};

// Get order details
export const getOrderDetails = async (orderId: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/order/${orderId}`,
      {
        headers: {
          Authorization: (await cookies()).get("accessToken")?.value || "",
        },
      }
    );
    return await res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};

// Change order status (for admin)
export const changeOrderStatus = async (orderId: string, status: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/order/${orderId}/status`,
      {
        method: "PATCH",
        headers: {
          Authorization: (await cookies()).get("accessToken")?.value || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );
    return await res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};
