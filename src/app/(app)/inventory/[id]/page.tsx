"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  MapPin,
  TrendingUp,
  DollarSign,
  Scale,
  Ruler,
  BarChart3,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
  mockProducts,
  mockMovements,
  mockInventoryOverview,
} from "@/lib/mock-data";

export default function ProductDetailPage() {
  const params = useParams();
  const product = mockProducts.find((p) => p.id === params.id);
  const overview = mockInventoryOverview.find(
    (o) => o.product_id === params.id
  );

  if (!product || !overview) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-lg font-semibold">Product Not Found</h2>
        <Link href="/inventory">
          <Button variant="link">Back to Inventory</Button>
        </Link>
      </div>
    );
  }

  const productMovements = mockMovements
    .filter((m) => m.product_id === product.id)
    .slice(0, 20);

  const stockHistory = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (13 - i));
    return {
      date: date.toISOString().split("T")[0],
      quantity:
        overview.total_quantity + Math.floor(Math.random() * 50 - 25),
    };
  });

  const statusVariant =
    overview.stock_status === "normal"
      ? "success"
      : overview.stock_status === "low"
        ? "warning"
        : overview.stock_status === "critical"
          ? "critical"
          : overview.stock_status === "overstock"
            ? "info"
            : ("secondary" as const);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/inventory">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">{product.name}</h2>
            <Badge variant={statusVariant}>
              {overview.stock_status.replace("_", " ")}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {product.sku} &middot; {product.category_name} &middot; Barcode:{" "}
            {product.barcode}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Package className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">In Stock</p>
                <p className="text-lg font-bold">
                  {overview.total_quantity.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <DollarSign className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Value</p>
                <p className="text-lg font-bold">
                  {formatCurrency(overview.total_value)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                <MapPin className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Locations</p>
                <p className="text-lg font-bold">{overview.total_locations}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                <TrendingUp className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Unit Price</p>
                <p className="text-lg font-bold">
                  {formatCurrency(product.unit_price)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Stock Level History (14 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stockHistory} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorQty" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "hsl(215, 20%, 65%)" }}
                    tickFormatter={(v) => { const d = new Date(v); return `${d.getMonth() + 1}/${d.getDate()}`; }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(215, 20%, 65%)" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(222, 84%, 5%)", border: "1px solid hsl(217, 33%, 17%)", borderRadius: "8px", fontSize: 12 }}
                  />
                  <Area type="monotone" dataKey="quantity" stroke="hsl(217, 91%, 60%)" strokeWidth={2} fillOpacity={1} fill="url(#colorQty)" name="Quantity" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Product Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <DetailRow label="Description" value={product.description} />
            <DetailRow label="Min Stock" value={product.min_stock_level.toString()} />
            <DetailRow label="Max Stock" value={product.max_stock_level.toString()} />
            <DetailRow label="Reorder Point" value={product.reorder_point.toString()} />
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                <Ruler className="h-3 w-3" /> Dimensions
              </p>
              <p className="text-sm">
                {product.width_cm} x {product.height_cm} x {product.depth_cm} cm
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <Scale className="h-3 w-3" /> Weight
              </p>
              <p className="text-sm">{product.weight_kg} kg</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Recent Movements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {productMovements.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No recent movements for this product.
            </p>
          ) : (
            <div className="space-y-2">
              {productMovements.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-md p-2 hover:bg-muted/50 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        m.movement_type === "receive"
                          ? "success"
                          : m.movement_type === "pick"
                            ? "info"
                            : "secondary"
                      }
                    >
                      {m.movement_type}
                    </Badge>
                    <span>
                      {m.quantity} units by {m.performed_by}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(m.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
