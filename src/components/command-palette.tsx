"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  Package,
  Map,
  ScanBarcode,
  Bell,
  ArrowLeftRight,
  BarChart3,
  Settings,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockProducts } from "@/lib/mock-data";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  category: "navigation" | "product" | "action";
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  function navigate(href: string) {
    router.push(href);
    setOpen(false);
  }

  const allItems: CommandItem[] = useMemo(() => {
    const navItems: CommandItem[] = [
      { id: "nav-dashboard", label: "Dashboard", description: "KPIs, charts, activity feed", icon: <LayoutDashboard className="h-4 w-4" />, action: () => navigate("/dashboard"), category: "navigation" },
      { id: "nav-inventory", label: "Inventory", description: "Search and manage stock", icon: <Package className="h-4 w-4" />, action: () => navigate("/inventory"), category: "navigation" },
      { id: "nav-map", label: "Warehouse Map", description: "Spatial overview of bins", icon: <Map className="h-4 w-4" />, action: () => navigate("/warehouse/map"), category: "navigation" },
      { id: "nav-scan", label: "Scanner", description: "Barcode scan to receive or pick", icon: <ScanBarcode className="h-4 w-4" />, action: () => navigate("/scan"), category: "navigation" },
      { id: "nav-alerts", label: "Alerts", description: "View and manage alerts", icon: <Bell className="h-4 w-4" />, action: () => navigate("/alerts"), category: "navigation" },
      { id: "nav-movements", label: "Stock Movements", description: "Movement audit log", icon: <ArrowLeftRight className="h-4 w-4" />, action: () => navigate("/movements"), category: "navigation" },
      { id: "nav-analytics", label: "Analytics", description: "Charts and reports", icon: <BarChart3 className="h-4 w-4" />, action: () => navigate("/analytics"), category: "navigation" },
      { id: "nav-settings", label: "Settings", description: "App configuration", icon: <Settings className="h-4 w-4" />, action: () => navigate("/settings"), category: "navigation" },
    ];

    const productItems: CommandItem[] = mockProducts.slice(0, 20).map((p) => ({
      id: `product-${p.id}`,
      label: p.name,
      description: `${p.sku} · ${p.category_name}`,
      icon: <Package className="h-4 w-4 text-muted-foreground" />,
      action: () => navigate(`/inventory/${p.id}`),
      category: "product" as const,
    }));

    return [...navItems, ...productItems];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    if (!query) return allItems.filter((i) => i.category === "navigation");
    const q = query.toLowerCase();
    return allItems.filter(
      (i) =>
        i.label.toLowerCase().includes(q) ||
        i.description?.toLowerCase().includes(q)
    );
  }, [query, allItems]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        setQuery("");
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[activeIndex]) {
      e.preventDefault();
      filtered[activeIndex].action();
    }
  }

  useEffect(() => {
    const el = listRef.current?.children[activeIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  if (!open) return null;

  const grouped = {
    navigation: filtered.filter((i) => i.category === "navigation"),
    product: filtered.filter((i) => i.category === "product"),
    action: filtered.filter((i) => i.category === "action"),
  };

  let flatIndex = -1;

  return (
    <>
      <div
        className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div className="fixed left-1/2 top-[20%] z-[95] w-full max-w-lg -translate-x-1/2">
        <div className="rounded-xl border bg-popover shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="flex items-center gap-3 border-b px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search pages, products, actions..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="text-[10px] text-muted-foreground/60 font-mono border rounded px-1.5 py-0.5">
              ESC
            </kbd>
          </div>

          <div ref={listRef} className="max-h-[320px] overflow-y-auto p-2">
            {filtered.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No results found.
              </p>
            )}

            {(["navigation", "product", "action"] as const).map((cat) => {
              const items = grouped[cat];
              if (items.length === 0) return null;
              const catLabel =
                cat === "navigation"
                  ? "Pages"
                  : cat === "product"
                    ? "Products"
                    : "Actions";

              return (
                <div key={cat}>
                  <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {catLabel}
                  </p>
                  {items.map((item) => {
                    flatIndex++;
                    const idx = flatIndex;
                    const isActive = idx === activeIndex;
                    return (
                      <button
                        key={item.id}
                        onClick={() => item.action()}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                          isActive ? "bg-accent text-accent-foreground" : "text-foreground/80"
                        )}
                      >
                        <span className="shrink-0">{item.icon}</span>
                        <span className="flex-1 text-left">
                          <span className="font-medium">{item.label}</span>
                          {item.description && (
                            <span className="ml-2 text-xs text-muted-foreground">
                              {item.description}
                            </span>
                          )}
                        </span>
                        {isActive && (
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>

          <div className="border-t px-4 py-2 flex items-center gap-4 text-[10px] text-muted-foreground/60">
            <span><kbd className="font-mono border rounded px-1">↑↓</kbd> Navigate</span>
            <span><kbd className="font-mono border rounded px-1">↵</kbd> Open</span>
            <span><kbd className="font-mono border rounded px-1">Esc</kbd> Close</span>
          </div>
        </div>
      </div>
    </>
  );
}
