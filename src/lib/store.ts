import { create } from "zustand";
import type { Tables } from "@/types/database";

interface WarehouseState {
  currentWarehouseId: string;
  recentMovements: Tables<"stock_movements">[];
  activeAlerts: Tables<"alerts">[];
  setCurrentWarehouse: (id: string) => void;
  addMovement: (movement: Tables<"stock_movements">) => void;
  addAlert: (alert: Tables<"alerts">) => void;
  updateAlertStatus: (id: string, status: Tables<"alerts">["status"]) => void;
}

export const useWarehouseStore = create<WarehouseState>((set) => ({
  currentWarehouseId: "a0000000-0000-0000-0000-000000000001",
  recentMovements: [],
  activeAlerts: [],
  setCurrentWarehouse: (id) => set({ currentWarehouseId: id }),
  addMovement: (movement) =>
    set((state) => ({
      recentMovements: [movement, ...state.recentMovements].slice(0, 50),
    })),
  addAlert: (alert) =>
    set((state) => ({
      activeAlerts: [alert, ...state.activeAlerts],
    })),
  updateAlertStatus: (id, status) =>
    set((state) => ({
      activeAlerts: state.activeAlerts.map((a) =>
        a.id === id ? { ...a, status } : a
      ),
    })),
}));
