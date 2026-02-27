"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useWarehouseStore } from "@/lib/store";
import type { Tables } from "@/types/database";

export function useRealtimeMovements() {
  const addMovement = useWarehouseStore((s) => s.addMovement);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("stock_movements_realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "stock_movements" },
        (payload) => {
          addMovement(payload.new as Tables<"stock_movements">);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [addMovement]);
}

export function useRealtimeAlerts() {
  const addAlert = useWarehouseStore((s) => s.addAlert);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("alerts_realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "alerts" },
        (payload) => {
          addAlert(payload.new as Tables<"alerts">);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [addAlert]);
}

export function useRealtimeInventory(
  onUpdate: (item: Tables<"inventory_items">) => void
) {
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("inventory_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "inventory_items" },
        (payload) => {
          if (payload.new) {
            onUpdate(payload.new as Tables<"inventory_items">);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onUpdate]);
}
