"use client";

import {
  Package,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatNumber, formatCurrency } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  trend: "up" | "down" | "neutral";
}

function KpiCard({ title, value, change, icon, trend }: KpiCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            <div className="flex items-center gap-1">
              {trend === "up" ? (
                <ArrowUpRight className="h-3 w-3 text-emerald-500" />
              ) : trend === "down" ? (
                <ArrowDownRight className="h-3 w-3 text-red-500" />
              ) : null}
              <span
                className={cn(
                  "text-xs font-medium",
                  trend === "up"
                    ? "text-emerald-500"
                    : trend === "down"
                      ? "text-red-500"
                      : "text-muted-foreground"
                )}
              >
                {change > 0 ? "+" : ""}
                {change}% from last week
              </span>
            </div>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface KpiCardsProps {
  totalSKUs: number;
  totalItems: number;
  totalValue: number;
  activeAlerts: number;
  utilizationPercent: number;
}

export function KpiCards({
  totalSKUs,
  totalItems,
  totalValue,
  activeAlerts,
  utilizationPercent,
}: KpiCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        title="Total SKUs"
        value={formatNumber(totalSKUs)}
        change={2.4}
        trend="up"
        icon={<Package className="h-6 w-6 text-primary" />}
      />
      <KpiCard
        title="Items in Stock"
        value={formatNumber(totalItems)}
        change={-1.2}
        trend="down"
        icon={<TrendingUp className="h-6 w-6 text-primary" />}
      />
      <KpiCard
        title="Inventory Value"
        value={formatCurrency(totalValue)}
        change={3.8}
        trend="up"
        icon={<BarChart3 className="h-6 w-6 text-primary" />}
      />
      <KpiCard
        title="Active Alerts"
        value={activeAlerts.toString()}
        change={activeAlerts > 3 ? 15 : -10}
        trend={activeAlerts > 3 ? "up" : "down"}
        icon={<AlertTriangle className="h-6 w-6 text-orange-500" />}
      />
    </div>
  );
}
