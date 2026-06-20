"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { getWishlist, toggleWishlist as toggleWishlistApi } from "@/services/product";
import { useUser } from "./UserContext";
import { toast } from "sonner";

interface WishlistContextType {
  wishlist: any[];
  wishlistCount: number;
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  const [wishlist, setWishlist] = useState<any[]>([]);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlist([]);
      return;
    }
    try {
      const res = await getWishlist();
      if (res?.success) {
        setWishlist(res.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch wishlist", err);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isWishlisted = (productId: string) => {
    return wishlist.some((item) => item._id === productId);
  };

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      toast.error("Please login to add items to your wishlist");
      return;
    }

    const currentlyWishlisted = isWishlisted(productId);

    try {
      const res = await toggleWishlistApi(productId);
      if (res?.success) {
        if (currentlyWishlisted) {
          toast("Removed from wishlist");
        } else {
          toast.success("Added to wishlist!");
        }
        await fetchWishlist();
      } else {
        toast.error(res?.message || "Failed to update wishlist");
      }
    } catch (err: any) {
      console.error("Error toggling wishlist", err);
      toast.error("Failed to update wishlist. Please try again.");
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isWishlisted,
        toggleWishlist,
        refreshWishlist: fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlistContext = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlistContext must be used within a WishlistProvider");
  }
  return context;
};
