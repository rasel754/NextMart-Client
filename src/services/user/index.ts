"use server";

import { cookies } from "next/headers";

// Retrieve current logged-in user profile details
export const getMyProfile = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/user/me`, {
      headers: {
        Authorization: (await cookies()).get("accessToken")?.value || "",
      },
      next: {
        tags: ["USER_PROFILE"],
      },
    });
    return await res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};

// Update profile details (accepts FormData for file uploading)
export const updateMyProfile = async (formData: FormData) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/user/update-profile`, {
      method: "PATCH",
      headers: {
        Authorization: (await cookies()).get("accessToken")?.value || "",
      },
      body: formData,
    });
    return await res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};

// Retrieve all users (for Admin dashboard management)
export const getAllUsers = async (query?: Record<string, any>) => {
  try {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== "") {
          params.append(key, val.toString());
        }
      });
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/user?${params.toString()}`, {
      headers: {
        Authorization: (await cookies()).get("accessToken")?.value || "",
      },
      next: {
        tags: ["USER_MANAGEMENT"],
      },
    });
    return await res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};

// Update user active status (active / banned)
export const updateUserStatus = async (userId: string, status: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/user/${userId}/status`, {
      method: "PATCH",
      headers: {
        Authorization: (await cookies()).get("accessToken")?.value || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    return await res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};

// Update user role (user / admin)
export const updateUserRole = async (userId: string, role: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/user/${userId}/role`, {
      method: "PATCH",
      headers: {
        Authorization: (await cookies()).get("accessToken")?.value || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    });
    return await res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};
