"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Store, ShoppingBag, Layers, Settings } from "lucide-react";
import Image from "next/image";

export default function MyShopHeader() {
  const { shopInfo, isShopLoading } = useUser();
  const pathname = usePathname();

  if (isShopLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-20 bg-muted/40 rounded-2xl" />
        <div className="h-10 bg-muted/40 rounded-xl w-96" />
      </div>
    );
  }

  if (!shopInfo) {
    return null;
  }

  const tabs = [
    { name: "Overview", href: "/user/my-shop", icon: Store },
    { name: "Products", href: "/user/my-shop/products", icon: ShoppingBag },
    { name: "Orders", href: "/user/my-shop/orders", icon: Layers },
    { name: "Settings", href: "/user/my-shop/settings", icon: Settings },
  ];

  return (
    <div className="space-y-6">
      {/* Red Alert Banner if Suspended */}
      {!shopInfo.isActive && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl">
          <AlertCircle className="h-5 w-5 flex-shrink-0 animate-bounce" />
          <div className="text-sm font-semibold">
            Your shop is suspended. Please contact support to reactivate.
          </div>
        </div>
      )}

      {/* Shop Info Card */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 bg-card/45 backdrop-blur-md border border-border/60 rounded-3xl shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
          {shopInfo.logo ? (
            <div className="relative h-16 w-16 rounded-2xl overflow-hidden border border-border/80">
              <Image
                src={shopInfo.logo}
                alt={shopInfo.shopName}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
              <Store className="h-8 w-8" />
            </div>
          )}
          <div>
            <div className="flex flex-col md:flex-row items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight">{shopInfo.shopName}</h1>
              <Badge
                className={
                  shopInfo.isActive
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 border-emerald-500/20"
                    : "bg-red-500/15 text-red-600 dark:text-red-400 hover:bg-red-500/25 border-red-500/20"
                }
                variant="outline"
              >
                {shopInfo.isActive ? "Active" : "Suspended"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              {shopInfo.address} • Est. {shopInfo.establishedYear}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 p-1 bg-muted/40 border border-border/40 rounded-2xl max-w-md">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? "bg-card text-foreground shadow-sm border border-border/60 scale-[1.02]"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
