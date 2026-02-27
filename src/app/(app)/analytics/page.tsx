"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  mockSnapshotData,
  mockInventoryOverview,
  mockMovements,
  mockZoneUtilization,
  mockCategories,
} from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

const COLORS = [
  "hsl(217, 91%, 60%)",
  "hsl(160, 60%, 45%)",
  "hsl(30, 80%, 55%)",
  "hsl(280, 65%, 60%)",
  "hsl(340, 75%, 55%)",
  "hsl(190, 70%, 50%)",
  "hsl(45, 80%, 50%)",
  "hsl(0, 65%, 55%)",
];

export default function AnalyticsPage() {
  const categoryData = mockCategories.map((cat) => {
    const products = mockInventoryOverview.filter(
      (p) => p.category_name === cat.name
    );
    return {
      name: cat.name,
      products: products.length,
      totalQuantity: products.reduce((s, p) => s + p.total_quantity, 0),
      totalValue: products.reduce((s, p) => s + p.total_value, 0),
    };
  });

  const movementsByType = [
    {
      name: "Receive",
      count: mockMovements.filter((m) => m.movement_type === "receive").length,
    },
    {
      name: "Pick",
      count: mockMovements.filter((m) => m.movement_type === "pick").length,
    },
    {
      name: "Transfer",
      count: mockMovements.filter((m) => m.movement_type === "transfer").length,
    },
    {
      name: "Adjust",
      count: mockMovements.filter((m) => m.movement_type === "adjust").length,
    },
  ];

  const topMovers = [...mockInventoryOverview]
    .sort((a, b) => b.total_quantity - a.total_quantity)
    .slice(0, 8)
    .map((p) => ({
      name: p.product_name.length > 20 ? p.product_name.slice(0, 20) + "..." : p.product_name,
      quantity: p.total_quantity,
      value: p.total_value,
    }));

  const movementsPerDay = mockSnapshotData.map((d) => ({
    date: d.date,
    movements: d.movements,
    value: d.totalValue,
  }));

  const stockStatusData = [
    { name: "Normal", value: mockInventoryOverview.filter((i) => i.stock_status === "normal").length, color: "hsl(160, 60%, 45%)" },
    { name: "Low", value: mockInventoryOverview.filter((i) => i.stock_status === "low").length, color: "hsl(30, 80%, 55%)" },
    { name: "Critical", value: mockInventoryOverview.filter((i) => i.stock_status === "critical").length, color: "hsl(0, 65%, 55%)" },
    { name: "Overstock", value: mockInventoryOverview.filter((i) => i.stock_status === "overstock").length, color: "hsl(217, 91%, 60%)" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Inventory Value Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockSnapshotData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(160, 60%, 45%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(160, 60%, 45%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(215, 20%, 65%)" }} tickFormatter={(v) => { const d = new Date(v); return `${d.getMonth() + 1}/${d.getDate()}`; }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(215, 20%, 65%)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(222, 84%, 5%)", border: "1px solid hsl(217, 33%, 17%)", borderRadius: "8px", fontSize: 12 }} formatter={(value: number) => [formatCurrency(value), "Value"]} />
                  <Area type="monotone" dataKey="totalValue" stroke="hsl(160, 60%, 45%)" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" name="Value" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Daily Movements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={movementsPerDay} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(215, 20%, 65%)" }} tickFormatter={(v) => { const d = new Date(v); return `${d.getMonth() + 1}/${d.getDate()}`; }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(215, 20%, 65%)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(222, 84%, 5%)", border: "1px solid hsl(217, 33%, 17%)", borderRadius: "8px", fontSize: 12 }} />
                  <Bar dataKey="movements" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} name="Movements" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Stock Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stockStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {stockStatusData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "hsl(222, 84%, 5%)", border: "1px solid hsl(217, 33%, 17%)", borderRadius: "8px", fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {stockStatusData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5 text-xs">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Movement Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={movementsByType}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {movementsByType.map((_, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "hsl(222, 84%, 5%)", border: "1px solid hsl(217, 33%, 17%)", borderRadius: "8px", fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {movementsByType.map((item, i) => (
                <div key={item.name} className="flex items-center gap-1.5 text-xs">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Zone Utilization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockZoneUtilization.map((zone) => (
              <div key={zone.zone_id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="truncate">{zone.zone_name.split(" - ")[0]}</span>
                  <Badge
                    variant={
                      zone.utilization_percent >= 90
                        ? "critical"
                        : zone.utilization_percent >= 70
                          ? "warning"
                          : "success"
                    }
                  >
                    {zone.utilization_percent}%
                  </Badge>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${zone.utilization_percent}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Top Products by Quantity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topMovers} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(215, 20%, 65%)" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "hsl(215, 20%, 65%)" }} axisLine={false} tickLine={false} width={100} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(222, 84%, 5%)", border: "1px solid hsl(217, 33%, 17%)", borderRadius: "8px", fontSize: 12 }} />
                <Bar dataKey="quantity" fill="hsl(217, 91%, 60%)" radius={[0, 4, 4, 0]} name="Quantity" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Value by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 5, right: 10, left: 0, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(215, 20%, 65%)" }} axisLine={false} tickLine={false} interval={0} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(215, 20%, 65%)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(222, 84%, 5%)", border: "1px solid hsl(217, 33%, 17%)", borderRadius: "8px", fontSize: 12 }} formatter={(value: number) => [formatCurrency(value), "Value"]} />
                <Bar dataKey="totalValue" fill="hsl(160, 60%, 45%)" radius={[4, 4, 0, 0]} name="Total Value" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
