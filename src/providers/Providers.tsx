"use client";

import UserProvider from "@/context/UserContext";
import { WishlistProvider } from "@/context/WishlistContext";
import StoreProviders from "./StoreProviders";
import { ThemeProvider } from "./theme-provider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <UserProvider>
        <WishlistProvider>
          <StoreProviders>{children}</StoreProviders>
        </WishlistProvider>
      </UserProvider>
    </ThemeProvider>
  );
};

export default Providers;

