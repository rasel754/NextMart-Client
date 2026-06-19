"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Bell, Sun, Moon, LogOut, User as UserIcon, Home } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { getMyProfile } from "@/services/user";
import { logout as authLogout } from "@/services/AuthService";
import Link from "next/link";
import { toast } from "sonner";

export default function DashboardNavbar() {
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();
  const { user, setIsLoading } = useUser();
  const [mounted, setMounted] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);

    const fetchProfile = async () => {
      try {
        const res = await getMyProfile();
        if (res?.success && res.data?.profile?.photo) {
          setProfilePhoto(res.data.profile.photo);
        }
      } catch (err) {
        console.error("Failed to load profile photo in navbar:", err);
      }
    };

    fetchProfile();
  }, []);

  const getPageTitle = (path: string) => {
    if (path === "/admin") return "Overview";
    if (path.startsWith("/admin/users")) return "Manage Users";
    if (path.startsWith("/admin/products")) return "Manage Products";
    if (path.startsWith("/admin/orders")) return "Manage Orders";
    if (path.startsWith("/admin/shops")) return "Manage Shops";
    if (path.startsWith("/admin/categories")) return "Manage Categories";
    if (path.startsWith("/admin/brands")) return "Manage Brands";
    if (path.startsWith("/admin/coupons")) return "Manage Coupons";
    if (path.startsWith("/admin/flash-sales")) return "Flash Sales";
    if (path.startsWith("/admin/reviews")) return "Reviews";
    if (path.startsWith("/admin/profile")) return "Profile Settings";

    if (path === "/user/dashboard") return "Overview";
    if (path.startsWith("/user/dashboard/orders")) return "My Orders";
    if (path.startsWith("/user/dashboard/wishlist")) return "Wishlist";
    if (path.startsWith("/user/dashboard/reviews")) return "My Reviews";
    if (path.startsWith("/user/dashboard/profile")) return "Profile Settings";

    return "Dashboard";
  };

  const handleLogout = async () => {
    try {
      await authLogout();
      setIsLoading(true);
      toast.success("Logged out successfully");
      window.location.href = "/login";
    } catch {
      toast.error("Failed to log out");
    }
  };

  return (
    <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border/40 px-6 bg-card sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
      {/* Left side: Hamburger + Dynamic Title */}
      <div className="flex items-center gap-4">
        <SidebarTrigger className="h-9 w-9 rounded-full border hover:bg-muted/50" />
        <h2 className="text-lg font-black tracking-tight text-foreground hidden sm:block">
          {getPageTitle(pathname)}
        </h2>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-3">
        {/* Dark Mode Toggle */}
        {mounted && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="h-9 w-9 rounded-full border hover:bg-muted/50 text-foreground"
          >
            {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        )}

        {/* Notifications Icon (static badge) */}
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-full border hover:bg-muted/50 relative text-foreground"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-card" />
        </Button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-muted/50">
              <Avatar className="h-9 w-9 rounded-full border border-primary/20">
                <AvatarImage src={profilePhoto || ""} alt={user?.name || "User"} />
                <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold uppercase">
                  {user?.role?.slice(0, 2) || "US"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 rounded-2xl p-1.5" align="end" forceMount>
            <DropdownMenuLabel className="font-normal px-2.5 py-2">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-black text-foreground truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
              <Link href={user?.role === "admin" ? "/admin/profile" : "/user/dashboard/profile"} className="flex items-center gap-2 w-full">
                <UserIcon className="h-4 w-4 text-primary" />
                <span>My Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
              <Link href="/" className="flex items-center gap-2 w-full">
                <Home className="h-4 w-4 text-indigo-500" />
                <span>View Site</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="rounded-xl cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
