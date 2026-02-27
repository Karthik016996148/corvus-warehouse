"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { cn } from "@/lib/utils";

const pageTitle: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/inventory": "Inventory",
  "/warehouse/map": "Warehouse Map",
  "/scan": "Scanner",
  "/alerts": "Alerts",
  "/alerts/rules": "Alert Rules",
  "/movements": "Stock Movements",
  "/analytics": "Analytics",
  "/settings": "Settings",
};

const shortcuts: Record<string, string> = {
  d: "/dashboard",
  i: "/inventory",
  m: "/warehouse/map",
  s: "/scan",
  a: "/alerts",
  v: "/movements",
  n: "/analytics",
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const title = pageTitle[pathname] || "";

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      if (shortcuts[key]) {
        e.preventDefault();
        router.push(shortcuts[key]);
      }
      if (key === "[") {
        setSidebarCollapsed((prev) => !prev);
      }
    },
    [router]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div
        className={cn(
          "flex-1 transition-all duration-300",
          sidebarCollapsed ? "ml-16" : "ml-60"
        )}
      >
        <Header
          onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          title={title}
          alertCount={4}
        />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
