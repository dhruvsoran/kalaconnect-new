"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, Cell } from "recharts"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { BrandLoading } from "@/components/brand-loading"
import { DollarSign, Package, Loader2 } from "lucide-react"
import type { Order } from "@/lib/db"

const PIE_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
]

function getMonthLabel(date: Date): string {
  return date.toLocaleString("en-US", { month: "short" })
}

function getLastSixMonths(): { key: string; label: string }[] {
  const months: { key: string; label: string }[] = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    months.push({ key, label: getMonthLabel(d) })
  }
  return months
}

function computeAnalytics(orders: Order[]) {
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)

  const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {}
  for (const order of orders) {
    for (const item of order.items || []) {
      const existing = productSales[item.productName]
      if (existing) {
        existing.quantity += item.quantity
        existing.revenue += item.price * item.quantity
      } else {
        productSales[item.productName] = {
          name: item.productName,
          quantity: item.quantity,
          revenue: item.price * item.quantity,
        }
      }
    }
  }

  const topProduct = Object.values(productSales).sort((a, b) => b.revenue - a.revenue)[0] || null

  const monthData = getLastSixMonths()
  const revenueByMonth: Record<string, number> = {}
  for (const m of monthData) revenueByMonth[m.key] = 0

  for (const order of orders) {
    const d = new Date(order.createdAt)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    if (key in revenueByMonth) {
      revenueByMonth[key] += order.total || 0
    }
  }

  const barData = monthData.map((m) => ({
    month: m.label,
    sales: revenueByMonth[m.key] || 0,
  }))

  const categorySales: Record<string, number> = {}
  for (const order of orders) {
    for (const item of order.items || []) {
      const cat = (item as any).category || (item as any).tags?.[0] || "Other"
      categorySales[cat] = (categorySales[cat] || 0) + item.quantity * item.price
    }
  }

  const pieData = Object.entries(categorySales)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  return { totalRevenue, topProduct, barData, pieData }
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    try {
      const res = await fetch("/api/db/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      setOrders(json.data || [])
    } catch (e) {
      console.error("Failed to load orders", e)
      setError("Failed to load analytics data.")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  if (isLoading) {
    return <BrandLoading />
  }

  const hasOrders = orders.length > 0
  const { totalRevenue, topProduct, barData, pieData } = computeAnalytics(orders)

  const pieChartData = pieData.map((entry, i) => ({
    ...entry,
    fill: PIE_COLORS[i % PIE_COLORS.length],
  }))

  const chartConfig: Record<string, { label: string; color: string }> = {
    sales: {
      label: "Sales",
      color: "hsl(var(--chart-1))",
    },
  }
  for (const entry of pieChartData) {
    chartConfig[entry.name] = {
      label: entry.name,
      color: entry.fill,
    }
  }

  return (
    <div className="grid flex-1 auto-rows-max gap-4">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Analytics</h1>
      </div>

      {!hasOrders ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg font-medium">No data yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Analytics will appear once you have orders.
            </p>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-destructive text-lg font-medium">{error}</p>
            <p className="text-sm text-muted-foreground mt-1">Please try again later.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">Across all orders</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Performing Product</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold truncate">
                  {topProduct ? topProduct.name : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {topProduct
                    ? `${topProduct.quantity} units sold · ₹${topProduct.revenue.toLocaleString("en-IN")}`
                    : "No products sold yet"}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Sales Overview (Last 6 Months)</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                  <BarChart accessibilityLayer data={barData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>A breakdown of your product categories.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-0">
                <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                    <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                      {pieChartData.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
