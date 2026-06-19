"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import {
  TrendingUp,
  ShoppingCart,
  Users,
  Store,
  Package,
  Calendar,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AdminDashboardOverviewProps {
  metaData: {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    totalShops: number;
    totalProducts: number;
    monthlyRevenue: { month: string; revenue: number }[];
    monthlyOrders: { month: string; count: number }[];
    orderStatusDistribution: { status: string; count: number }[];
    newUsersPerMonth: { month: string; count: number }[];
  };
  recentOrders: any[];
}

const PIE_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AdminDashboardOverview({
  metaData,
  recentOrders = [],
}: AdminDashboardOverviewProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    totalRevenue = 0,
    totalOrders = 0,
    totalUsers = 0,
    totalShops = 0,
    totalProducts = 0,
    monthlyRevenue = [],
    orderStatusDistribution = [],
    newUsersPerMonth = [],
  } = metaData || {};

  const isDark = mounted && (theme === "dark" || resolvedTheme === "dark");

  const gridStroke = isDark ? "#374151" : "#e5e7eb";
  const axisColor = isDark ? "#9ca3af" : "#6b7280";

  const getStatusBadge = (status: string) => {
    const norm = status?.toLowerCase();
    if (norm === "pending") {
      return <Badge className="bg-yellow-500/15 text-yellow-600 dark:text-yellow-400" variant="outline">{status}</Badge>;
    }
    if (norm === "processing" || norm === "shipped") {
      return <Badge className="bg-blue-500/15 text-blue-600 dark:text-blue-400" variant="outline">{status}</Badge>;
    }
    if (norm === "delivered" || norm === "completed" || norm === "success") {
      return <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" variant="outline">{status}</Badge>;
    }
    return <Badge className="bg-red-500/15 text-red-600 dark:text-red-400" variant="outline">{status}</Badge>;
  };

  return (
    <div className="space-y-8">
      {/* Top Welcome Title */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Admin Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor platform transactions, shops growth, catalog status and monthly earnings.
        </p>
      </div>

      {/* Row 1: KPI Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
        {/* Total Revenue */}
        <Card className="rounded-3xl border border-border/60 shadow-sm hover:shadow transition bg-card overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Total Revenue
            </CardTitle>
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">৳{totalRevenue.toLocaleString()}</div>
            <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
              <span className="text-emerald-600 font-bold">+12%</span> this month
            </p>
          </CardContent>
        </Card>

        {/* Total Orders */}
        <Card className="rounded-3xl border border-border/60 shadow-sm hover:shadow transition bg-card overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Total Orders
            </CardTitle>
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <ShoppingCart className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">{totalOrders.toLocaleString()}</div>
            <p className="text-[10px] text-muted-foreground mt-1.5">Completed transactions</p>
          </CardContent>
        </Card>

        {/* Total Users */}
        <Card className="rounded-3xl border border-border/60 shadow-sm hover:shadow transition bg-card overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Total Users
            </CardTitle>
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">{totalUsers.toLocaleString()}</div>
            <p className="text-[10px] text-muted-foreground mt-1.5">Registered accounts</p>
          </CardContent>
        </Card>

        {/* Active Shops */}
        <Card className="rounded-3xl border border-border/60 shadow-sm hover:shadow transition bg-card overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Active Shops
            </CardTitle>
            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Store className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">{totalShops.toLocaleString()}</div>
            <p className="text-[10px] text-muted-foreground mt-1.5">Onboarded merchants</p>
          </CardContent>
        </Card>

        {/* Total Products */}
        <Card className="rounded-3xl border border-border/60 shadow-sm hover:shadow transition bg-card overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Total Products
            </CardTitle>
            <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <Package className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">{totalProducts.toLocaleString()}</div>
            <p className="text-[10px] text-muted-foreground mt-1.5">Catalog list catalog items</p>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Bar Chart + Pie Chart */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {/* Monthly Revenue Bar Chart (col-span-2) */}
        <Card className="rounded-3xl border border-border/60 shadow-sm bg-card md:col-span-2 overflow-hidden">
          <CardHeader className="border-b border-border/40 pb-4">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-foreground">
              Monthly Revenue (Last 6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[320px] pt-6">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} opacity={0.5} />
                  <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 10 }} />
                  <YAxis
                    tickFormatter={(v) => `৳${v.toLocaleString()}`}
                    tick={{ fill: axisColor, fontSize: 10 }}
                  />
                  <Tooltip
                    formatter={(v) => [`৳${Number(v).toLocaleString()}`, "Revenue"]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "16px",
                      fontSize: "12px",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted/20 rounded-xl" />
            )}
          </CardContent>
        </Card>

        {/* Order Status Distribution Pie Chart (col-span-1) */}
        <Card className="rounded-3xl border border-border/60 shadow-sm bg-card overflow-hidden">
          <CardHeader className="border-b border-border/40 pb-4">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-foreground">
              Order Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[320px] pt-6 flex flex-col justify-between">
            {mounted ? (
              <>
                <div className="w-full h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={orderStatusDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="count"
                        nameKey="status"
                        labelLine={false}
                      >
                        {orderStatusDistribution.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "16px",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {orderStatusDistribution.map((entry, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                      />
                      <span className="capitalize font-bold text-muted-foreground truncate">{entry.status}</span>
                      <span className="font-extrabold text-foreground ml-auto">({entry.count})</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted/20 rounded-xl" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Line Chart (Full Width) */}
      <Card className="rounded-3xl border border-border/60 shadow-sm bg-card overflow-hidden">
        <CardHeader className="border-b border-border/40 pb-4">
          <CardTitle className="text-xs font-black uppercase tracking-wider text-foreground">
            New User Registrations (Last 6 Months)
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] pt-6">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={newUsersPerMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} opacity={0.5} />
                <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 10 }} />
                <YAxis tick={{ fill: axisColor, fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "16px",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: "hsl(var(--card))" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted/20 rounded-xl" />
          )}
        </CardContent>
      </Card>

      {/* Row 4: Recent Orders */}
      <Card className="rounded-3xl border border-border/60 shadow-sm bg-card overflow-hidden">
        <CardHeader className="border-b border-border/40 pb-4">
          <CardTitle className="text-xs font-black uppercase tracking-wider text-foreground">
            Recent Platform Orders
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-6 py-3">Order ID</TableHead>
                  <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-6 py-3">Customer</TableHead>
                  <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-6 py-3 text-right">Total</TableHead>
                  <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-6 py-3 text-center">Status</TableHead>
                  <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-6 py-3">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <TableRow key={order._id} className="hover:bg-muted/20 border-b border-border/40 transition-colors">
                      <TableCell className="px-6 py-4 font-bold text-xs font-mono text-foreground">
                        {order._id}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-xs text-foreground">
                            {order.user?.name || "Anonymous Customer"}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {order.user?.email || "N/A"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right font-black text-xs text-foreground">
                        ৳{order.finalAmount?.toLocaleString() || order.totalAmount?.toLocaleString()}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        {getStatusBadge(order.status)}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-primary/60" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground text-xs font-medium">
                      No orders found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
