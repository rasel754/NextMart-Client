"use client";

import { useEffect, useState } from "react";
import MyShopHeader from "./MyShopHeader";
import { getVendorMeta } from "@/services/meta";
import { getMyShopOrders } from "@/services/order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, ShoppingBag, BarChart3, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useUser } from "@/context/UserContext";

interface IMetaData {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  monthlySales: { month: string; revenue: number }[];
  todaySales: number;
}

export default function MyShopOverviewContainer() {
  const { shopInfo, isShopLoading } = useUser();
  const [mounted, setMounted] = useState(false);
  const [metaData, setMetaData] = useState<IMetaData | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (shopInfo) {
      setLoading(true);
      Promise.all([getVendorMeta(), getMyShopOrders({ limit: 5 })])
        .then(([metaRes, ordersRes]) => {
          if (metaRes?.success) {
            setMetaData(metaRes.data);
          }
          if (ordersRes?.success) {
            setRecentOrders(ordersRes.data.slice(0, 5));
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [shopInfo]);

  if (isShopLoading || (shopInfo && loading)) {
    return (
      <div className="space-y-6 animate-pulse">
        <MyShopHeader />
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-muted/40 rounded-2xl" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-80 bg-muted/40 rounded-3xl" />
          <div className="h-80 bg-muted/40 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!shopInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center bg-card/45 backdrop-blur-md border border-border/60 rounded-3xl">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold">You don&apos;t have a shop yet</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm">
          Please create a shop from the dashboard overview page to start selling.
        </p>
        <Link
          href="/user/dashboard"
          className="mt-6 py-2 px-6 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/95 transition-all"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  // If shop has 0 products
  const hasNoProducts = metaData?.totalProducts === 0;

  const kpis = [
    {
      title: "Total Revenue",
      value: `৳${metaData?.totalRevenue.toLocaleString() || "0"}`,
      desc: "All-time earnings",
      icon: DollarSign,
      color: "text-emerald-500",
    },
    {
      title: "Today's Sales",
      value: `৳${metaData?.todaySales.toLocaleString() || "0"}`,
      desc: "Today's earnings",
      icon: TrendingUp,
      color: "text-primary",
    },
    {
      title: "Total Orders",
      value: metaData?.totalOrders.toString() || "0",
      desc: "Orders containing your items",
      icon: ShoppingBag,
      color: "text-indigo-500",
    },
    {
      title: "Total Products",
      value: metaData?.totalProducts.toString() || "0",
      desc: "Active catalog listings",
      icon: BarChart3,
      color: "text-amber-500",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <Badge className="bg-yellow-500/15 text-yellow-600 dark:text-yellow-400" variant="outline">{status}</Badge>;
      case "Processing":
        return <Badge className="bg-blue-500/15 text-blue-600 dark:text-blue-400" variant="outline">{status}</Badge>;
      case "Completed":
      case "Delivered":
        return <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" variant="outline">Delivered</Badge>;
      case "Cancelled":
        return <Badge className="bg-red-500/15 text-red-600 dark:text-red-400" variant="outline">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <MyShopHeader />

      {hasNoProducts ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-amber-500/5 border border-amber-500/15 rounded-3xl">
          <ShoppingBag className="h-12 w-12 text-amber-500 mb-4 animate-bounce" />
          <h2 className="text-lg font-bold text-foreground">You haven&apos;t added any products yet</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm">
            Add products to your shop catalog to start making sales!
          </p>
          <Link
            href="/user/my-shop/products"
            className="mt-6 py-2 px-6 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/95 transition-all shadow-sm shadow-primary/10"
          >
            Add Your First Product
          </Link>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            {kpis.map((kpi) => {
              const Icon = kpi.icon;
              return (
                <Card key={kpi.title} className="rounded-3xl border border-border/60 shadow-sm bg-card/30 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {kpi.title}
                    </CardTitle>
                    <Icon className={`h-4 w-4 ${kpi.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black">{kpi.value}</div>
                    <p className="text-[10px] text-muted-foreground mt-1">{kpi.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Charts & Recent Orders */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Sales Chart */}
            <Card className="rounded-3xl border border-border/60 shadow-sm bg-card/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-wider">
                  Monthly Sales (6 Months)
                </CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                {mounted && metaData?.monthlySales ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metaData.monthlySales}>
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
                  <div className="flex h-full w-full items-center justify-center bg-muted/20 rounded-2xl" />
                )}
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card className="rounded-3xl border border-border/60 shadow-sm bg-card/30 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold uppercase tracking-wider">
                  Recent Shop Orders
                </CardTitle>
                <Link
                  href="/user/my-shop/orders"
                  className="text-xs text-primary font-bold hover:underline"
                >
                  View All
                </Link>
              </CardHeader>
              <CardContent>
                {recentOrders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Order ID</TableHead>
                          <TableHead className="text-xs">Date</TableHead>
                          <TableHead className="text-xs text-center">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentOrders.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell
                              className="font-bold text-xs truncate max-w-[120px]"
                              title={order._id}
                            >
                              {order._id}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
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
                  <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                    <Clock className="h-8 w-8 mb-2 opacity-40" />
                    <p className="text-xs">No orders received yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
