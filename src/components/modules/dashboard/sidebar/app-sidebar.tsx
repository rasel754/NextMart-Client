"use client";

import * as React from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  MessageSquare,
  UserCog,
  Users,
  Store,
  Layers,
  Tag,
  Sparkles,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import Link from "next/link";
import Logo from "@/assets/svgs/Logo";
import { useUser } from "@/context/UserContext";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();
  const role = user?.role || "user";

  const adminMenu = [
    {
      title: "Overview",
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Users,
    },
    {
      title: "Products",
      url: "/admin/products",
      icon: ShoppingBag,
    },
    {
      title: "Orders",
      url: "/admin/orders",
      icon: Layers,
    },
    {
      title: "Shops",
      url: "/admin/shops",
      icon: Store,
    },
    {
      title: "Categories",
      url: "/admin/categories",
      icon: Layers,
    },
    {
      title: "Brands",
      url: "/admin/brands",
      icon: Tag,
    },
    {
      title: "Coupons",
      url: "/admin/coupons",
      icon: Tag,
    },
    {
      title: "Flash Sales",
      url: "/admin/flash-sales",
      icon: Sparkles,
    },
    {
      title: "Reviews",
      url: "/admin/reviews",
      icon: MessageSquare,
    },
  ];

  const userMenu = [
    {
      title: "Overview",
      url: "/user/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "My Orders",
      url: "/user/dashboard/orders",
      icon: ShoppingBag,
    },
    {
      title: "Wishlist",
      url: "/user/dashboard/wishlist",
      icon: Heart,
    },
    {
      title: "My Reviews",
      url: "/user/dashboard/reviews",
      icon: MessageSquare,
    },
    {
      title: "Profile Settings",
      url: "/user/dashboard/profile",
      icon: UserCog,
    },
  ];

  const menuItems = role === "admin" ? adminMenu : userMenu;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex items-center justify-center">
                  <Logo />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <h2 className="font-bold text-xl">NextMart</h2>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={menuItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
