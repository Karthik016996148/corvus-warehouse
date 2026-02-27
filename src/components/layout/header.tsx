"use client";

import { Bell, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  onMenuToggle: () => void;
  title?: string;
  alertCount?: number;
}

export function Header({ onMenuToggle, title, alertCount = 0 }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 lg:hidden"
        onClick={onMenuToggle}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {title && (
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      )}

      <div className="ml-auto flex items-center gap-4">
        <button
          onClick={() => {
            window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
          }}
          className="relative hidden md:flex items-center gap-2 h-9 w-64 rounded-md border border-input bg-muted/50 px-3 text-sm text-muted-foreground hover:bg-muted transition-colors"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">Search...</span>
          <kbd className="text-[10px] font-mono border rounded px-1.5 py-0.5 bg-background/50">
            Ctrl+K
          </kbd>
        </button>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {alertCount > 0 && (
            <Badge
              variant="critical"
              className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full p-0 text-[10px]"
            >
              {alertCount > 9 ? "9+" : alertCount}
            </Badge>
          )}
        </Button>

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
            AR
          </div>
        </div>
      </div>
    </header>
  );
}
