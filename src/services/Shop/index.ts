"use server";

import { cookies } from "next/headers";

import { revalidateTag } from "next/cache";

export const createShop = async (data: FormData) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/shop`, {
      method: "POST",
      headers: {
        Authorization: (await cookies()).get("accessToken")!.value,
      },
      body: data,
    });

    revalidateTag("SHOP");
    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};

export const getAllShops = async (query?: Record<string, any>) => {
  try {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== "") {
          params.append(key, val.toString());
        }
      });
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/shop?${params.toString()}`, {
      headers: {
        Authorization: (await cookies()).get("accessToken")?.value || "",
      },
      next: {
        tags: ["SHOP"],
      },
    });
    return await res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};

export const toggleShopStatus = async (shopId: string, status: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/shop/${shopId}/status`, {
      method: "PATCH",
      headers: {
        Authorization: (await cookies()).get("accessToken")?.value || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    revalidateTag("SHOP");
    return await res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};

export const deleteShop = async (shopId: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/shop/${shopId}`, {
      method: "DELETE",
      headers: {
        Authorization: (await cookies()).get("accessToken")?.value || "",
      },
    });
    revalidateTag("SHOP");
    return await res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};

export const getMyShop = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/shop/my-shop`, {
      headers: {
        Authorization: (await cookies()).get("accessToken")?.value || "",
      },
      next: {
        tags: ["SHOP"],
      },
    });
    if (res.status === 404) return { success: false, data: null };
    return await res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};

export const updateMyShop = async (data: FormData) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/shop/my-shop`, {
      method: "PATCH",
      headers: {
        Authorization: (await cookies()).get("accessToken")?.value || "",
      },
      body: data,
    });
    revalidateTag("SHOP");
    return await res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};
