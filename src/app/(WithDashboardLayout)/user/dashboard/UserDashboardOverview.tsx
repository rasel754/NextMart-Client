"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Clock, CheckCircle2, DollarSign } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";

interface UserDashboardOverviewProps {
  orders: any[];
}

export default function UserDashboardOverview({ orders = [] }: UserDashboardOverviewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute Metrics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const deliveredOrders = orders.filter((o) => o.status === "Completed" || o.status === "Delivered").length;
  const totalSpent = orders
    .filter((o) => o.paymentStatus === "Paid")
    .reduce((acc, o) => acc + (o.finalAmount || 0), 0);

  // Recent 5 Orders
  const recentOrders = orders.slice(0, 5);

  // Compute last 6 months activity chart data
  const getMonthlyChartData = () => {
    const months = [];
    const date = new Date();
    // Initialize map for last 6 months
    const monthMap: Record<string, number> = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
      const key = d.toLocaleString("en-US", { month: "short", year: "2-digit" });
      monthMap[key] = 0;
      months.push(key);
    }

    // Accumulate order finalAmount per month
    orders.forEach((o) => {
      const orderDate = new Date(o.createdAt);
      const key = orderDate.toLocaleString("en-US", { month: "short", year: "2-digit" });
      if (key in monthMap) {
        monthMap[key] += o.finalAmount || 0;
      }
    });

    return months.map((m) => ({
      month: m,
      spent: monthMap[m],
    }));
  };

  const chartData = getMonthlyChartData();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <Badge className="bg-yellow-500/15 text-yellow-600 dark:text-yellow-400" variant="outline">{status}</Badge>;
      case "Processing":
        return <Badge className="bg-blue-500/15 text-blue-600 dark:text-blue-400" variant="outline">{status}</Badge>;
      case "Completed":
      case "Delivered":
        return <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" variant="outline">{status}</Badge>;
      case "Cancelled":
        return <Badge className="bg-red-500/15 text-red-600 dark:text-red-400" variant="outline">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">User Overview</h1>
        <p className="text-xs text-muted-foreground">Monitor your orders, spent history, and shopping activity.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="rounded-2xl border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{totalOrders}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Orders placed all-time</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{pendingOrders}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Awaiting processing</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Delivered Items</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{deliveredOrders}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Successfully completed</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">${totalSpent.toLocaleString()}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Total paid order invoices</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart & Table Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Line Chart */}
        <Card className="rounded-2xl border/60">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider">Purchase History (6 Months)</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      fontSize: 12,
                    }}
                  />
                  <Line type="monotone" dataKey="spent" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted/20 rounded-xl" />
            )}
          </CardContent>
        </Card>

        {/* Recent Orders Table */}
        <Card className="rounded-2xl border/60">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Order ID</TableHead>
                      <TableHead className="text-xs">Date</TableHead>
                      <TableHead className="text-xs text-right">Total</TableHead>
                      <TableHead className="text-xs text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className="font-bold text-xs truncate max-w-[100px]" title={order._id}>
                          {order._id}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-bold text-xs text-right">
                          ${order.finalAmount}
                        </TableCell>
                        <TableCell className="text-center text-xs">
                          {getStatusBadge(order.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-8">
                No orders placed yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
