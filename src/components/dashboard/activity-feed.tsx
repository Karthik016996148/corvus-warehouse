"use client";

import { formatDistanceToNow } from "date-fns";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  Pencil,
  ClipboardCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { mockProducts } from "@/lib/mock-data";
import type { Tables } from "@/types/database";

const movementConfig = {
  receive: {
    icon: ArrowDownToLine,
    label: "Received",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  pick: {
    icon: ArrowUpFromLine,
    label: "Picked",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  transfer: {
    icon: ArrowLeftRight,
    label: "Transferred",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  adjust: {
    icon: Pencil,
    label: "Adjusted",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  cycle_count: {
    icon: ClipboardCheck,
    label: "Cycle Count",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
};

interface ActivityFeedProps {
  movements: Tables<"stock_movements">[];
}

export function ActivityFeed({ movements }: ActivityFeedProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Recent Activity
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            Live
            <span className="ml-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-1 max-h-[400px] overflow-y-auto">
        {movements.slice(0, 15).map((m) => {
          const config =
            movementConfig[m.movement_type as keyof typeof movementConfig];
          const product = mockProducts.find((p) => p.id === m.product_id);
          const Icon = config.icon;

          return (
            <div
              key={m.id}
              className="flex items-start gap-3 rounded-md p-2 hover:bg-muted/50 transition-colors"
            >
              <div
                className={cn(
                  "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                  config.bg
                )}
              >
                <Icon className={cn("h-4 w-4", config.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">{config.label}</span>{" "}
                  <span className="text-muted-foreground">
                    {m.quantity} x{" "}
                  </span>
                  <span className="font-medium truncate">
                    {product?.name || "Unknown Product"}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {m.performed_by} &middot;{" "}
                  {formatDistanceToNow(new Date(m.created_at), {
                    addSuffix: true,
                  })}
                  {m.reference_number && (
                    <span className="ml-1 text-primary/70">
                      #{m.reference_number}
                    </span>
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
