import { useWishlistContext } from "@/context/WishlistContext";

export const useWishlist = () => {
  const { isWishlisted, toggleWishlist, wishlistCount, wishlist, refreshWishlist } = useWishlistContext();
  return {
    isWishlisted,
    toggleWishlist,
    wishlistCount,
    wishlist,
    refreshWishlist,
  };
};
