"use client";

import UserProvider from "@/context/UserContext";
import StoreProviders from "./StoreProviders";
import { ThemeProvider } from "./theme-provider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <UserProvider>
        <StoreProviders>{children}</StoreProviders>
      </UserProvider>
    </ThemeProvider>
  );
};

export default Providers;

