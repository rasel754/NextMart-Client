"use server";

import { cookies } from "next/headers";

export const getAdminMeta = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/meta/admin`, {
      headers: {
        Authorization: (await cookies()).get("accessToken")?.value || "",
      },
      next: {
        tags: ["META_ADMIN"],
      },
    });
    return await res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};

export const getVendorMeta = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/meta/vendor`, {
      headers: {
        Authorization: (await cookies()).get("accessToken")?.value || "",
      },
      next: {
        tags: ["META_VENDOR"],
      },
    });
    return await res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};
