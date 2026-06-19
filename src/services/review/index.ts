"use server";

import { cookies } from "next/headers";
import { getCurrentUser } from "../AuthService";

export const getMyReviews = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, data: [] };

    // Fetch all reviews and filter by the current logged-in user
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/review?user=${user.userId}`, {
      headers: {
        Authorization: (await cookies()).get("accessToken")?.value || "",
      },
      next: {
        tags: ["REVIEW"],
      },
    });
    const result = await res.json();
    
    // Safety check: Filter by user ID just in case
    if (result?.success && result.data) {
      result.data = result.data.filter((r: any) => r.user?._id === user.userId || r.user === user.userId);
    }
    
    return result;
  } catch (error: any) {
    return Error(error.message);
  }
};

export const createReview = async (reviewData: { product: string; rating: number; comment: string }) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/review`, {
      method: "POST",
      headers: {
        Authorization: (await cookies()).get("accessToken")?.value || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    });
    return await res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};

export const deleteReview = async (reviewId: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/review/${reviewId}`, {
      method: "DELETE",
      headers: {
        Authorization: (await cookies()).get("accessToken")?.value || "",
      },
    });
    return await res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};
