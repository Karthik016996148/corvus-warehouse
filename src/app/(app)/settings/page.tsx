"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Warehouse, Database, Bell, Keyboard } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Database className="h-4 w-4" />
            Supabase Connection
          </CardTitle>
          <CardDescription>
            Connect to your Supabase project for live data and real-time features.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Project URL</label>
            <Input placeholder="https://your-project.supabase.co" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Anon Key</label>
            <Input placeholder="eyJhbGciOiJIUzI1NiIs..." type="password" />
          </div>
          <div className="flex items-center justify-between">
            <Badge variant="warning">Not Connected (Demo Mode)</Badge>
            <Button size="sm">Connect</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Warehouse className="h-4 w-4" />
            Warehouse Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Name</span>
            <span className="font-medium">Bay Area Distribution Center</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Location</span>
            <span>Fremont, CA</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Capacity</span>
            <span>10,000 units</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Keyboard className="h-4 w-4" />
            Keyboard Shortcuts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {[
              { key: "D", action: "Go to Dashboard" },
              { key: "I", action: "Go to Inventory" },
              { key: "M", action: "Go to Warehouse Map" },
              { key: "S", action: "Go to Scanner" },
              { key: "A", action: "Go to Alerts" },
              { key: "V", action: "Go to Movements" },
              { key: "N", action: "Go to Analytics" },
              { key: "[", action: "Toggle Sidebar" },
            ].map((shortcut) => (
              <div key={shortcut.key} className="flex items-center justify-between">
                <span className="text-muted-foreground">{shortcut.action}</span>
                <kbd className="rounded border bg-muted px-2 py-0.5 font-mono text-xs">
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Bell className="h-4 w-4" />
            About
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <p><span className="font-medium text-foreground">WarehouseIQ</span> v0.1.0</p>
          <p>Intelligent warehouse inventory management with real-time tracking, spatial mapping, smart alerts, and barcode scanning.</p>
          <p className="pt-2">Built with Next.js, Supabase, Tailwind CSS, and Recharts.</p>
        </CardContent>
      </Card>
    </div>
  );
}
