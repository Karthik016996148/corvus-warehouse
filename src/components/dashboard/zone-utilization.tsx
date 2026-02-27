"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Views } from "@/types/database";

interface ZoneUtilizationProps {
  zones: Views<"v_zone_utilization">[];
}

export function ZoneUtilization({ zones }: ZoneUtilizationProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Zone Utilization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {zones.map((zone) => {
          const percent = zone.utilization_percent;
          const barColor =
            percent >= 90
              ? "bg-red-500"
              : percent >= 70
                ? "bg-orange-500"
                : percent >= 50
                  ? "bg-blue-500"
                  : "bg-emerald-500";

          return (
            <div key={zone.zone_id} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{zone.zone_name}</span>
                  <span className="text-xs text-muted-foreground capitalize">
                    ({zone.zone_type})
                  </span>
                </div>
                <span className="text-sm font-semibold">{percent}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className={cn("h-full rounded-full transition-all", barColor)}
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {zone.occupied_bins}/{zone.total_bins} bins occupied
                </span>
                <span>{zone.total_items.toLocaleString()} items</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
