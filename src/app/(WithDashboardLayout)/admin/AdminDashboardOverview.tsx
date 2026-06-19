"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingBag, Users, Store, Box } from "lucide-react";
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
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";

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
}

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AdminDashboardOverview({ metaData }: AdminDashboardOverviewProps) {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Admin Analytics Overview</h1>
        <p className="text-xs text-muted-foreground">Monitor platform performance, growth metrics, and order distributions.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="rounded-2xl border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">${totalRevenue.toLocaleString()}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Gross paid order values</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{totalOrders}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Platform transactions count</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{totalUsers}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Registered customers</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Shops</CardTitle>
            <Store className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{totalShops}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Onboarded vendor shops</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Products</CardTitle>
            <Box className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{totalProducts}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Active items catalog</p>
          </CardContent>
        </Card>
      </div>

      {/* Recharts Graphics */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Monthly Revenue Bar Chart */}
        <Card className="rounded-2xl border/60">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider">Monthly Revenue (6 Months)</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenue}>
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
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted/20 rounded-xl" />
            )}
          </CardContent>
        </Card>

        {/* User Registrations Line Chart */}
        <Card className="rounded-2xl border/60">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider">New User registrations</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={newUsersPerMonth}>
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
                  <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted/20 rounded-xl" />
            )}
          </CardContent>
        </Card>

        {/* Order Status Distribution Pie Chart */}
        <Card className="rounded-2xl border/60 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider">Order Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex flex-col md:flex-row items-center justify-around gap-6">
            {mounted ? (
              <>
                <div className="w-full md:w-1/2 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={orderStatusDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="count"
                        nameKey="status"
                      >
                        {orderStatusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Stats Table representation */}
                <div className="w-full md:w-1/2 space-y-3">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground border-b pb-2">Status Breakdown</h3>
                  <div className="space-y-2">
                    {orderStatusDistribution.map((entry, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                          />
                          <span className="capitalize font-medium text-muted-foreground">{entry.status}</span>
                        </div>
                        <span className="font-bold text-foreground">{entry.count} orders</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted/20 rounded-xl" />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
