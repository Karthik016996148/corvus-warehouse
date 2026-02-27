"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Map,
  ScanBarcode,
  Bell,
  BarChart3,
  ArrowLeftRight,
  Settings,
  Warehouse,
} from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, shortcut: "D" },
  { name: "Inventory", href: "/inventory", icon: Package, shortcut: "I" },
  { name: "Warehouse Map", href: "/warehouse/map", icon: Map, shortcut: "M" },
  { name: "Scanner", href: "/scan", icon: ScanBarcode, shortcut: "S" },
  { name: "Alerts", href: "/alerts", icon: Bell, shortcut: "A" },
  { name: "Movements", href: "/movements", icon: ArrowLeftRight, shortcut: "V" },
  { name: "Analytics", href: "/analytics", icon: BarChart3, shortcut: "N" },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex h-16 items-center gap-3 border-b px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Warehouse className="h-4 w-4" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight">
              WarehouseIQ
            </span>
            <span className="text-[10px] text-muted-foreground">
              Inventory Intelligence
            </span>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const link = (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.name}</span>
                  <kbd className="hidden text-[10px] text-muted-foreground/50 font-mono lg:inline">
                    {item.shortcut}
                  </kbd>
                </>
              )}
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.name} content={item.name} side="right">
                {link}
              </Tooltip>
            );
          }
          return link;
        })}
      </nav>

      <div className="border-t p-2">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
        >
          <Settings className="h-4 w-4 shrink-0 text-muted-foreground" />
          {!collapsed && <span>Settings</span>}
        </Link>
      </div>
    </aside>
  );
}
