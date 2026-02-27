export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      warehouses: {
        Row: {
          id: string;
          name: string;
          address: string;
          city: string;
          state: string;
          total_capacity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["warehouses"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["warehouses"]["Insert"]>;
      };
      zones: {
        Row: {
          id: string;
          warehouse_id: string;
          name: string;
          zone_type: "ambient" | "cold" | "hazmat" | "bulk" | "picking";
          color: string;
          grid_row_start: number;
          grid_row_end: number;
          grid_col_start: number;
          grid_col_end: number;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["zones"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["zones"]["Insert"]>;
      };
      aisles: {
        Row: {
          id: string;
          zone_id: string;
          name: string;
          aisle_number: number;
          orientation: "horizontal" | "vertical";
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["aisles"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["aisles"]["Insert"]>;
      };
      racks: {
        Row: {
          id: string;
          aisle_id: string;
          rack_number: number;
          side: "left" | "right";
          levels: number;
          bins_per_level: number;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["racks"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["racks"]["Insert"]>;
      };
      bin_locations: {
        Row: {
          id: string;
          rack_id: string;
          level: number;
          position: number;
          label: string;
          max_capacity: number;
          grid_row: number;
          grid_col: number;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["bin_locations"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["bin_locations"]["Insert"]
        >;
      };
      product_categories: {
        Row: {
          id: string;
          name: string;
          parent_id: string | null;
          icon: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["product_categories"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["product_categories"]["Insert"]
        >;
      };
      products: {
        Row: {
          id: string;
          sku: string;
          name: string;
          description: string;
          category_id: string;
          barcode: string;
          unit_price: number;
          weight_kg: number;
          width_cm: number;
          height_cm: number;
          depth_cm: number;
          min_stock_level: number;
          max_stock_level: number;
          reorder_point: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["products"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
      };
      inventory_items: {
        Row: {
          id: string;
          product_id: string;
          bin_location_id: string;
          quantity: number;
          lot_number: string | null;
          expiry_date: string | null;
          last_counted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["inventory_items"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["inventory_items"]["Insert"]
        >;
      };
      stock_movements: {
        Row: {
          id: string;
          product_id: string;
          from_bin_id: string | null;
          to_bin_id: string | null;
          quantity: number;
          movement_type:
            | "receive"
            | "pick"
            | "transfer"
            | "adjust"
            | "cycle_count";
          reference_number: string | null;
          notes: string | null;
          performed_by: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["stock_movements"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["stock_movements"]["Insert"]
        >;
      };
      inventory_snapshots: {
        Row: {
          id: string;
          product_id: string;
          warehouse_id: string;
          total_quantity: number;
          total_value: number;
          snapshot_date: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["inventory_snapshots"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["inventory_snapshots"]["Insert"]
        >;
      };
      cycle_counts: {
        Row: {
          id: string;
          warehouse_id: string;
          zone_id: string | null;
          status: "scheduled" | "in_progress" | "completed" | "cancelled";
          scheduled_date: string;
          started_at: string | null;
          completed_at: string | null;
          assigned_to: string;
          notes: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["cycle_counts"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["cycle_counts"]["Insert"]
        >;
      };
      cycle_count_items: {
        Row: {
          id: string;
          cycle_count_id: string;
          inventory_item_id: string;
          expected_quantity: number;
          actual_quantity: number | null;
          variance: number | null;
          counted_at: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["cycle_count_items"]["Row"],
          "id"
        >;
        Update: Partial<
          Database["public"]["Tables"]["cycle_count_items"]["Insert"]
        >;
      };
      alert_rules: {
        Row: {
          id: string;
          warehouse_id: string;
          product_id: string | null;
          zone_id: string | null;
          rule_type:
            | "low_stock"
            | "overstock"
            | "expiring"
            | "no_movement"
            | "misplaced";
          threshold: number;
          severity: "info" | "warning" | "critical";
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["alert_rules"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["alert_rules"]["Insert"]
        >;
      };
      alerts: {
        Row: {
          id: string;
          alert_rule_id: string | null;
          warehouse_id: string;
          product_id: string | null;
          bin_location_id: string | null;
          alert_type:
            | "low_stock"
            | "overstock"
            | "expiring"
            | "no_movement"
            | "misplaced";
          severity: "info" | "warning" | "critical";
          title: string;
          message: string;
          status: "open" | "acknowledged" | "resolved" | "dismissed";
          acknowledged_by: string | null;
          acknowledged_at: string | null;
          resolved_at: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["alerts"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["alerts"]["Insert"]>;
      };
      scan_sessions: {
        Row: {
          id: string;
          warehouse_id: string;
          session_type: "receive" | "pick" | "audit" | "transfer";
          scanned_by: string;
          total_scans: number;
          started_at: string;
          ended_at: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["scan_sessions"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["scan_sessions"]["Insert"]
        >;
      };
      scan_entries: {
        Row: {
          id: string;
          scan_session_id: string;
          barcode: string;
          product_id: string | null;
          bin_location_id: string | null;
          quantity: number;
          scan_result: "success" | "not_found" | "error";
          scanned_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["scan_entries"]["Row"],
          "id" | "scanned_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["scan_entries"]["Insert"]
        >;
      };
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: "admin" | "manager" | "operator" | "viewer";
          warehouse_id: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["users"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
    };
    Views: {
      v_inventory_overview: {
        Row: {
          product_id: string;
          product_name: string;
          sku: string;
          category_name: string;
          total_quantity: number;
          total_locations: number;
          unit_price: number;
          total_value: number;
          min_stock_level: number;
          max_stock_level: number;
          stock_status: string;
        };
      };
      v_zone_utilization: {
        Row: {
          zone_id: string;
          zone_name: string;
          zone_type: string;
          warehouse_name: string;
          total_bins: number;
          occupied_bins: number;
          total_items: number;
          utilization_percent: number;
        };
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
export type Views<T extends keyof Database["public"]["Views"]> =
  Database["public"]["Views"][T]["Row"];
