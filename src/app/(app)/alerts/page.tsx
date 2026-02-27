"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  Check,
  Eye,
  X,
  Settings,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { mockAlerts } from "@/lib/mock-data";
import { useToast } from "@/components/ui/toast";
import type { Tables } from "@/types/database";

const severityConfig = {
  critical: {
    icon: AlertTriangle,
    color: "text-red-500",
    bg: "bg-red-500/10",
    variant: "critical" as const,
  },
  warning: {
    icon: AlertCircle,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    variant: "warning" as const,
  },
  info: {
    icon: Info,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    variant: "info" as const,
  },
};

const statusConfig = {
  open: { label: "Open", variant: "critical" as const },
  acknowledged: { label: "Acknowledged", variant: "warning" as const },
  resolved: { label: "Resolved", variant: "success" as const },
  dismissed: { label: "Dismissed", variant: "secondary" as const },
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Tables<"alerts">[]>(mockAlerts);
  const [severityFilter, setSeverityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { toast } = useToast();

  const filtered = alerts.filter((a) => {
    if (severityFilter && a.severity !== severityFilter) return false;
    if (statusFilter && a.status !== statusFilter) return false;
    return true;
  });

  function updateStatus(
    id: string,
    status: Tables<"alerts">["status"]
  ) {
    const alert = alerts.find((a) => a.id === id);
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status,
              acknowledged_by: status === "acknowledged" ? "Alex Rivera" : a.acknowledged_by,
              acknowledged_at: status === "acknowledged" ? new Date().toISOString() : a.acknowledged_at,
              resolved_at: status === "resolved" ? new Date().toISOString() : a.resolved_at,
            }
          : a
      )
    );
    const labels: Record<string, string> = { acknowledged: "Acknowledged", resolved: "Resolved", dismissed: "Dismissed" };
    toast({
      type: status === "resolved" ? "success" : "info",
      title: `Alert ${labels[status] || status}`,
      message: alert?.title,
    });
  }

  const counts = {
    open: alerts.filter((a) => a.status === "open").length,
    critical: alerts.filter((a) => a.severity === "critical" && a.status === "open").length,
    warning: alerts.filter((a) => a.severity === "warning" && a.status === "open").length,
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
              <Bell className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{counts.open}</p>
              <p className="text-xs text-muted-foreground">Open Alerts</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-500">
                {counts.critical}
              </p>
              <p className="text-xs text-muted-foreground">Critical</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
              <AlertCircle className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-500">
                {counts.warning}
              </p>
              <p className="text-xs text-muted-foreground">Warnings</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            options={[
              { value: "", label: "All Severities" },
              { value: "critical", label: "Critical" },
              { value: "warning", label: "Warning" },
              { value: "info", label: "Info" },
            ]}
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: "", label: "All Statuses" },
              { value: "open", label: "Open" },
              { value: "acknowledged", label: "Acknowledged" },
              { value: "resolved", label: "Resolved" },
              { value: "dismissed", label: "Dismissed" },
            ]}
          />
        </div>
        <Link href="/alerts/rules">
          <Button variant="outline" size="sm">
            <Settings className="mr-1.5 h-3.5 w-3.5" />
            Alert Rules
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Bell className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">
                No alerts match your filters.
              </p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((alert) => {
            const sev = severityConfig[alert.severity as keyof typeof severityConfig];
            const stat = statusConfig[alert.status as keyof typeof statusConfig];
            const SevIcon = sev.icon;

            return (
              <Card
                key={alert.id}
                className={cn(
                  "transition-colors",
                  alert.status === "resolved" || alert.status === "dismissed"
                    ? "opacity-60"
                    : ""
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                        sev.bg
                      )}
                    >
                      <SevIcon className={cn("h-5 w-5", sev.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm">
                              {alert.title}
                            </h3>
                            <Badge variant={sev.variant} className="text-[10px]">
                              {alert.severity}
                            </Badge>
                            <Badge variant={stat.variant} className="text-[10px]">
                              {stat.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {alert.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(alert.created_at), {
                              addSuffix: true,
                            })}
                            {alert.acknowledged_by && (
                              <span>
                                {" "}
                                &middot; Acknowledged by{" "}
                                {alert.acknowledged_by}
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {alert.status === "open" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  updateStatus(alert.id, "acknowledged")
                                }
                                title="Acknowledge"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  updateStatus(alert.id, "resolved")
                                }
                                title="Resolve"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  updateStatus(alert.id, "dismissed")
                                }
                                title="Dismiss"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {alert.status === "acknowledged" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                updateStatus(alert.id, "resolved")
                              }
                              title="Resolve"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
