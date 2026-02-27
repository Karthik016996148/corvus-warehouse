"use client";

import { useState, useEffect, useCallback, createContext, useContext } from "react";
import {
  Check,
  X,
  AlertTriangle,
  Info,
  ArrowDownToLine,
  ArrowUpFromLine,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "warning" | "info" | "receive" | "pick";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  toast: (t: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <Check className="h-4 w-4 text-emerald-500" />,
  error: <X className="h-4 w-4 text-red-500" />,
  warning: <AlertTriangle className="h-4 w-4 text-orange-500" />,
  info: <Info className="h-4 w-4 text-blue-500" />,
  receive: <ArrowDownToLine className="h-4 w-4 text-emerald-500" />,
  pick: <ArrowUpFromLine className="h-4 w-4 text-blue-500" />,
};

const bgMap: Record<ToastType, string> = {
  success: "border-emerald-500/30 bg-emerald-500/5",
  error: "border-red-500/30 bg-red-500/5",
  warning: "border-orange-500/30 bg-orange-500/5",
  info: "border-blue-500/30 bg-blue-500/5",
  receive: "border-emerald-500/30 bg-emerald-500/5",
  pick: "border-blue-500/30 bg-blue-500/5",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((t: Omit<Toast, "id">) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => dismiss(id), t.duration || 4000);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col-reverse gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({
  toast: t,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  return (
    <div
      className={cn(
        "pointer-events-auto flex items-start gap-3 rounded-lg border p-3 shadow-lg backdrop-blur-sm transition-all duration-300",
        bgMap[t.type],
        visible
          ? "translate-x-0 opacity-100"
          : "translate-x-8 opacity-0"
      )}
    >
      <div className="mt-0.5 shrink-0">{iconMap[t.type]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{t.title}</p>
        {t.message && (
          <p className="text-xs text-muted-foreground mt-0.5">{t.message}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(t.id)}
        className="shrink-0 text-muted-foreground hover:text-foreground"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
