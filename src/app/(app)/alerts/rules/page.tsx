"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Power, PowerOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { mockAlertRules } from "@/lib/mock-data";

interface AlertRule {
  id: string;
  rule_type: string;
  threshold: number;
  severity: string;
  is_active: boolean;
}

export default function AlertRulesPage() {
  const [rules, setRules] = useState<AlertRule[]>(mockAlertRules);

  function toggleRule(id: string) {
    setRules((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, is_active: !r.is_active } : r
      )
    );
  }

  function deleteRule(id: string) {
    setRules((prev) => prev.filter((r) => r.id !== id));
  }

  function addRule() {
    setRules((prev) => [
      ...prev,
      {
        id: `ar-${Date.now()}`,
        rule_type: "low_stock",
        threshold: 10,
        severity: "warning",
        is_active: true,
      },
    ]);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/alerts">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-lg font-semibold">Alert Rules</h2>
        </div>
        <Button size="sm" onClick={addRule}>
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add Rule
        </Button>
      </div>

      <div className="space-y-3">
        {rules.map((rule) => (
          <Card
            key={rule.id}
            className={cn(!rule.is_active && "opacity-50")}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Rule Type
                    </label>
                    <Select
                      value={rule.rule_type}
                      onChange={(e) =>
                        setRules((prev) =>
                          prev.map((r) =>
                            r.id === rule.id
                              ? { ...r, rule_type: e.target.value }
                              : r
                          )
                        )
                      }
                      options={[
                        { value: "low_stock", label: "Low Stock" },
                        { value: "overstock", label: "Overstock" },
                        { value: "no_movement", label: "No Movement" },
                        { value: "expiring", label: "Expiring" },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Threshold
                    </label>
                    <Input
                      type="number"
                      value={rule.threshold}
                      onChange={(e) =>
                        setRules((prev) =>
                          prev.map((r) =>
                            r.id === rule.id
                              ? { ...r, threshold: parseInt(e.target.value) || 0 }
                              : r
                          )
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Severity
                    </label>
                    <Select
                      value={rule.severity}
                      onChange={(e) =>
                        setRules((prev) =>
                          prev.map((r) =>
                            r.id === rule.id
                              ? { ...r, severity: e.target.value }
                              : r
                          )
                        )
                      }
                      options={[
                        { value: "info", label: "Info" },
                        { value: "warning", label: "Warning" },
                        { value: "critical", label: "Critical" },
                      ]}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleRule(rule.id)}
                    title={rule.is_active ? "Disable" : "Enable"}
                  >
                    {rule.is_active ? (
                      <Power className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <PowerOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteRule(rule.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
