"use client";

import { Button } from "../ui/button";
import { Heart, LogOut, ShoppingBag, Sun, Moon, Menu, X } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logout } from "@/services/AuthService";
import { useUser } from "@/context/UserContext";
import { usePathname, useRouter } from "next/navigation";
import { protectedRoutes } from "@/contants";
import Logo from "@/assets/svgs/Logo";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import { orderedProductsSelector } from "@/redux/featurs/cartSlice";
import { useWishlist } from "@/hooks/useWishlist";
import NotificationDropdown from "@/components/shared/NotificationDropdown";
import { getMyProfile } from "@/services/user";

export default function Navbar() {
  const { user, setIsLoading } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Cart item count
  const cartProducts = useAppSelector(orderedProductsSelector);
  const cartCount = cartProducts.reduce((acc, p) => acc + p.orderedQuantity, 0);

  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  // Avoid hydration mismatch by waiting until mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
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
    if (user) {
      fetchProfile();
    } else {
      setProfilePhoto(null);
    }
  }, [user]);

  const handleLogOut = () => {
    logout();
    setIsLoading(true);
    if (protectedRoutes.some((route) => pathname.match(route))) {
      router.push("/");
    }
  };

  const { wishlistCount } = useWishlist();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/flash-sales", label: "Flash Sales" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  if (user) {
    navLinks.push({
      href: user.role === "admin" ? "/admin" : "/user/dashboard",
      label: "Dashboard",
    });
  }

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const loginUrl = isAuthPage ? "/login" : `/login?redirectPath=${encodeURIComponent(pathname)}`;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/85 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <h1 className="text-xl md:text-2xl font-black flex items-center gap-1.5 text-foreground">
            <Logo />
            <span className="text-[#3b49df] dark:text-[#5865f2]">Next</span>
            <span className="text-[#10b981]">Mart</span>
          </h1>
        </Link>

        {/* Middle: Desktop Links */}
        <nav className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold transition-colors duration-200 hover:text-primary ${
                isActive(link.href)
                  ? "text-primary border-b-2 border-primary pb-1"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center space-x-3">
          {/* Theme Switcher */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-slate-800" />
              )}
            </Button>
          )}

          {/* Favorites (Wishlist Link) */}
          <Link href={user ? (user.role === "admin" ? "/admin" : "/user/dashboard/wishlist") : "/login"}>
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {wishlistCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Cart with badge count */}
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Notification bell */}
          {user && <NotificationDropdown />}

          {/* Auth State Dropdown / Login */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <Avatar className="h-9 w-9 border-2 border-primary/20 hover:border-primary transition">
                  <AvatarImage src={profilePhoto || ""} alt={user.name || "User"} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {user.name ? user.name.slice(0, 2).toUpperCase() : "US"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none text-foreground">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link href={user.role === "admin" ? "/admin" : "/user/dashboard"}>Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link href={user.role === "admin" ? "/admin/orders" : "/user/dashboard/orders"}>My Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link href={user.role === "admin" ? "/admin/profile" : "/user/dashboard/profile"}>Settings</Link>
                </DropdownMenuItem>
                {user.role !== "admin" && (
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link href={user.hasShop ? "/user/shop/products" : "/create-shop"}>
                      {user.hasShop ? "Manage Shop" : "Create Shop"}
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground focus:bg-destructive focus:text-destructive-foreground font-semibold"
                  onClick={handleLogOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href={loginUrl}>
              <Button className="rounded-full" size="sm">
                Login
              </Button>
            </Link>
          )}

          {/* Mobile Hamburger toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background px-4 py-4 space-y-3 shadow-lg transition">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-base font-semibold py-2 transition-colors ${
                isActive(link.href) ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {!user && (
            <div className="pt-2">
              <Link href={loginUrl} onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full rounded-full">Login</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
