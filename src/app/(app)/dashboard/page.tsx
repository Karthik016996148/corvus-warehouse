"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Radio, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { ZoneUtilization } from "@/components/dashboard/zone-utilization";
import { StockChart } from "@/components/dashboard/stock-chart";
import { useToast } from "@/components/ui/toast";
import { useScanSound } from "@/lib/hooks/use-sound";
import {
  mockInventoryOverview,
  mockMovements,
  mockAlerts,
  mockZoneUtilization,
  mockSnapshotData,
  mockProducts,
} from "@/lib/mock-data";
import type { Tables } from "@/types/database";

const performers = ["Alex Rivera", "Sam Chen", "Jordan Patel", "Taylor Kim"];
const movementTypes: Tables<"stock_movements">["movement_type"][] = [
  "receive",
  "pick",
  "transfer",
  "adjust",
];
const typeLabels: Record<string, string> = {
  receive: "Received",
  pick: "Picked",
  transfer: "Transferred",
  adjust: "Adjusted",
};

export default function DashboardPage() {
  const [liveMovements, setLiveMovements] = useState(mockMovements);
  const [simulating, setSimulating] = useState(false);
  const simInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const { toast } = useToast();
  const { playNotification } = useScanSound();

  const totalSKUs = mockInventoryOverview.length;
  const totalItems = mockInventoryOverview.reduce(
    (sum, item) => sum + item.total_quantity,
    0
  );
  const totalValue = mockInventoryOverview.reduce(
    (sum, item) => sum + item.total_value,
    0
  );
  const activeAlerts = mockAlerts.filter((a) => a.status === "open").length;

  const generateMovement = useCallback((): Tables<"stock_movements"> => {
    const type = movementTypes[Math.floor(Math.random() * movementTypes.length)];
    const product = mockProducts[Math.floor(Math.random() * mockProducts.length)];
    const qty = Math.floor(Math.random() * 30) + 1;
    return {
      id: `sim-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      product_id: product.id,
      from_bin_id: type === "pick" || type === "transfer" ? `bin-${Math.floor(Math.random() * 200)}` : null,
      to_bin_id: type === "receive" || type === "transfer" ? `bin-${Math.floor(Math.random() * 200)}` : null,
      quantity: qty,
      movement_type: type,
      reference_number: type === "receive" ? `PO-${30000 + Math.floor(Math.random() * 1000)}` : type === "pick" ? `SO-${40000 + Math.floor(Math.random() * 1000)}` : null,
      notes: null,
      performed_by: performers[Math.floor(Math.random() * performers.length)],
      created_at: new Date().toISOString(),
    };
  }, []);

  const startSimulation = useCallback(() => {
    setSimulating(true);
    toast({ type: "info", title: "Live Simulation Started", message: "Generating real-time stock movements..." });
  }, [toast]);

  const stopSimulation = useCallback(() => {
    setSimulating(false);
    if (simInterval.current) {
      clearInterval(simInterval.current);
      simInterval.current = null;
    }
    toast({ type: "info", title: "Simulation Stopped" });
  }, [toast]);

  useEffect(() => {
    if (!simulating) return;

    simInterval.current = setInterval(() => {
      const movement = generateMovement();
      const product = mockProducts.find((p) => p.id === movement.product_id);

      setLiveMovements((prev) => [movement, ...prev].slice(0, 50));

      playNotification();
      toast({
        type: movement.movement_type === "receive" ? "receive" : movement.movement_type === "pick" ? "pick" : "info",
        title: `${typeLabels[movement.movement_type]}: ${product?.name || "Unknown"}`,
        message: `${movement.quantity} units by ${movement.performed_by}`,
        duration: 3000,
      });
    }, 3000 + Math.floor(Math.random() * 2000));

    return () => {
      if (simInterval.current) {
        clearInterval(simInterval.current);
        simInterval.current = null;
      }
    };
  }, [simulating, generateMovement, toast, playNotification]);

  return (
    <div className="space-y-6">
      <KpiCards
        totalSKUs={totalSKUs}
        totalItems={totalItems}
        totalValue={totalValue}
        activeAlerts={activeAlerts}
        utilizationPercent={78.5}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <StockChart data={mockSnapshotData} />
        </div>
        <ZoneUtilization zones={mockZoneUtilization} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold">Live Activity</h3>
            {!simulating ? (
              <Button size="sm" variant="outline" onClick={startSimulation} className="border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10">
                <Radio className="mr-1.5 h-3.5 w-3.5" />
                Simulate Live
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={stopSimulation} className="border-red-500/50 text-red-500 hover:bg-red-500/10">
                <Square className="mr-1.5 h-3 w-3" />
                Stop
              </Button>
            )}
          </div>
          <ActivityFeed movements={liveMovements} />
        </div>
        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-base font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <QuickAction
                href="/scan"
                label="Scan Items"
                description="Receive or pick"
                shortcut="S"
              />
              <QuickAction
                href="/inventory"
                label="View Inventory"
                description="Search & manage"
                shortcut="I"
              />
              <QuickAction
                href="/warehouse/map"
                label="Warehouse Map"
                description="Spatial overview"
                shortcut="M"
              />
              <QuickAction
                href="/alerts"
                label="View Alerts"
                description={`${activeAlerts} active`}
                shortcut="A"
              />
            </div>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-base font-semibold mb-3">
              Stock Level Summary
            </h3>
            <div className="space-y-2">
              {[
                {
                  label: "Normal",
                  count: mockInventoryOverview.filter((i) => i.stock_status === "normal").length,
                  color: "bg-emerald-500",
                },
                {
                  label: "Low",
                  count: mockInventoryOverview.filter((i) => i.stock_status === "low").length,
                  color: "bg-orange-500",
                },
                {
                  label: "Critical",
                  count: mockInventoryOverview.filter((i) => i.stock_status === "critical").length,
                  color: "bg-red-500",
                },
                {
                  label: "Overstock",
                  count: mockInventoryOverview.filter((i) => i.stock_status === "overstock").length,
                  color: "bg-blue-500",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                    <span className="text-muted-foreground">{item.label}</span>
                  </div>
                  <span className="font-medium">{item.count} SKUs</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  label,
  description,
  shortcut,
}: {
  href: string;
  label: string;
  description: string;
  shortcut: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-1 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <kbd className="text-[10px] text-muted-foreground/50 font-mono border rounded px-1">
          {shortcut}
        </kbd>
      </div>
      <span className="text-xs text-muted-foreground">{description}</span>
    </Link>
  );
}
