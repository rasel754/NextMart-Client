"use client";

import React, { useState } from "react";
import { Bell, CheckCheck, Trash2, Sparkles, ShoppingBag, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  type: "info" | "promo" | "order";
}

const mockNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "Welcome to NextMart! 🚀",
    description: "Thank you for joining us. Complete your profile to get a personalized shopping experience.",
    time: "2 mins ago",
    unread: true,
    type: "info",
  },
  {
    id: "2",
    title: "Flash Sales are Live! ⚡",
    description: "Get up to 50% discount on featured electronic categories. Limited time offer!",
    time: "1 hour ago",
    unread: true,
    type: "promo",
  },
  {
    id: "3",
    title: "Order Placed Successfully 🎉",
    description: "Your order #NM-9824 for Wireless Headphones has been verified and is ready to ship.",
    time: "Yesterday",
    unread: false,
    type: "order",
  },
];

export default function NotificationDropdown({ triggerClass = "", iconSizeClass = "h-5 w-5" }: { triggerClass?: string, iconSizeClass?: string }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const markAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const clearNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "promo":
        return (
          <div className="bg-yellow-100 text-yellow-600 dark:bg-yellow-950/40 dark:text-yellow-400 p-2 rounded-full shrink-0">
            <Sparkles className="h-4 w-4" />
          </div>
        );
      case "order":
        return (
          <div className="bg-green-100 text-green-600 dark:bg-green-950/40 dark:text-green-400 p-2 rounded-full shrink-0">
            <ShoppingBag className="h-4 w-4" />
          </div>
        );
      default:
        return (
          <div className="bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 p-2 rounded-full shrink-0">
            <Info className="h-4 w-4" />
          </div>
        );
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={`rounded-full relative ${triggerClass}`}>
          <Bell className={iconSizeClass} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-background animate-pulse" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 sm:w-96 rounded-2xl p-0.5 mt-2" align="end" forceMount>
        <DropdownMenuLabel className="font-normal px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-base text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-black tracking-wide bg-primary/10 text-primary rounded-full">
                {unreadCount} New
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 transition"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              <span>Mark all as read</span>
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="m-0" />
        
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-8 text-center flex flex-col items-center justify-center text-muted-foreground">
              <Bell className="h-8 w-8 opacity-40 mb-2 animate-bounce" />
              <p className="text-sm font-semibold">All caught up!</p>
              <p className="text-xs text-muted-foreground/80">No new notifications at this time.</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={(e) => {
                  if (item.unread) markAsRead(item.id, e);
                }}
                className={`flex gap-3 items-start p-3.5 border-b border-border/40 hover:bg-muted/40 transition cursor-pointer relative group ${
                  item.unread ? "bg-primary/5 dark:bg-primary/5 font-medium" : ""
                }`}
              >
                {getIcon(item.type)}
                <div className="flex-grow space-y-1 pr-6">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-foreground line-clamp-1">{item.title}</p>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">{item.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Right actions overlay */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-background/90 dark:bg-card/90 p-1 rounded-lg border shadow-sm">
                  {item.unread && (
                    <button
                      onClick={(e) => markAsRead(item.id, e)}
                      title="Mark as read"
                      className="text-muted-foreground hover:text-primary p-1 rounded transition"
                    >
                      <CheckCheck className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    onClick={(e) => clearNotification(item.id, e)}
                    title="Dismiss"
                    className="text-muted-foreground hover:text-red-500 p-1 rounded transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Unread dot indicator */}
                {item.unread && (
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary group-hover:hidden" />
                )}
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
