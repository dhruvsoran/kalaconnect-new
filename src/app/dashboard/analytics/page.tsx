
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, Cell } from "recharts"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { DollarSign, Package } from "lucide-react"

const chartData = [
  { month: "January", sales: 186 },
  { month: "February", sales: 305 },
  { month: "March", sales: 237 },
  { month: "April", sales: 273 },
  { month: "May", sales: 209 },
  { month: "June", sales: 250 },
]

const pieChartData = [
    { name: "Sarees", value: 400, fill: "var(--color-sarees)" },
    { name: "Statues", value: 300, fill: "var(--color-statues)" },
    { name: "Coasters", value: 200, fill: "var(--color-coasters)" },
    { name: "Shawls", value: 278, fill: "var(--color-shawls)" },
]
const chartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
  sarees: {
      label: "Sarees",
      color: "hsl(var(--chart-1))",
  },
  statues: {
      label: "Statues",
      color: "hsl(var(--chart-2))",
  },
  coasters: {
      label: "Coasters",
      color: "hsl(var(--chart-3))",
  },
  shawls: {
      label: "Shawls",
      color: "hsl(var(--chart-4))",
  }
}

export default function AnalyticsPage() {
    return (
        <div className="grid flex-1 auto-rows-max gap-4">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl font-headline">Analytics</h1>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹45,231.89</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Top Performing Product</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold">Madhubani Saree</div>
                        <p className="text-xs text-muted-foreground">50 units sold this month</p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Sales Overview (Last 6 Months)</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                         <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                            <BarChart accessibilityLayer data={chartData}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                dataKey="month"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 3)}
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
        </div>
    );
}

