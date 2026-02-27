import type { Tables, Views } from "@/types/database";

const WAREHOUSE_ID = "a0000000-0000-0000-0000-000000000001";

export const mockWarehouse: Tables<"warehouses"> = {
  id: WAREHOUSE_ID,
  name: "Bay Area Distribution Center",
  address: "1200 Warehouse Blvd",
  city: "Fremont",
  state: "CA",
  total_capacity: 10000,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const mockCategories: Tables<"product_categories">[] = [
  { id: "d0000000-0000-0000-0000-000000000001", name: "Electronics", parent_id: null, icon: "cpu", created_at: new Date().toISOString() },
  { id: "d0000000-0000-0000-0000-000000000002", name: "Industrial Parts", parent_id: null, icon: "cog", created_at: new Date().toISOString() },
  { id: "d0000000-0000-0000-0000-000000000003", name: "Packaging", parent_id: null, icon: "box", created_at: new Date().toISOString() },
  { id: "d0000000-0000-0000-0000-000000000004", name: "Safety Equipment", parent_id: null, icon: "shield", created_at: new Date().toISOString() },
  { id: "d0000000-0000-0000-0000-000000000005", name: "Tools", parent_id: null, icon: "wrench", created_at: new Date().toISOString() },
  { id: "d0000000-0000-0000-0000-000000000006", name: "Automotive Parts", parent_id: null, icon: "car", created_at: new Date().toISOString() },
  { id: "d0000000-0000-0000-0000-000000000007", name: "Food & Beverage", parent_id: null, icon: "coffee", created_at: new Date().toISOString() },
  { id: "d0000000-0000-0000-0000-000000000008", name: "Office Supplies", parent_id: null, icon: "file-text", created_at: new Date().toISOString() },
];

export const mockProducts: (Tables<"products"> & { category_name: string })[] = [
  { id: "p001", sku: "ELEC-001", name: "Raspberry Pi 5 Board", description: "8GB RAM single-board computer", category_id: "d0000000-0000-0000-0000-000000000001", category_name: "Electronics", barcode: "WH100000001", unit_price: 79.99, weight_kg: 0.05, width_cm: 8.5, height_cm: 5.6, depth_cm: 1.7, min_stock_level: 20, max_stock_level: 500, reorder_point: 50, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "p002", sku: "ELEC-002", name: "Arduino Mega 2560", description: "Microcontroller development board", category_id: "d0000000-0000-0000-0000-000000000001", category_name: "Electronics", barcode: "WH100000002", unit_price: 45.99, weight_kg: 0.04, width_cm: 10.2, height_cm: 5.3, depth_cm: 1.5, min_stock_level: 15, max_stock_level: 400, reorder_point: 40, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "p003", sku: "ELEC-003", name: "ESP32-WROOM Module", description: "WiFi+BT microcontroller", category_id: "d0000000-0000-0000-0000-000000000001", category_name: "Electronics", barcode: "WH100000003", unit_price: 12.50, weight_kg: 0.01, width_cm: 2.5, height_cm: 1.8, depth_cm: 0.3, min_stock_level: 50, max_stock_level: 1000, reorder_point: 100, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "p004", sku: "ELEC-004", name: "USB-C Hub 7-Port", description: "Multi-port USB hub", category_id: "d0000000-0000-0000-0000-000000000001", category_name: "Electronics", barcode: "WH100000004", unit_price: 34.99, weight_kg: 0.15, width_cm: 12.0, height_cm: 6.5, depth_cm: 2.0, min_stock_level: 25, max_stock_level: 300, reorder_point: 60, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "p005", sku: "ELEC-005", name: "OLED Display 128x64", description: "I2C monochrome OLED module", category_id: "d0000000-0000-0000-0000-000000000001", category_name: "Electronics", barcode: "WH100000005", unit_price: 8.99, weight_kg: 0.01, width_cm: 3.5, height_cm: 3.5, depth_cm: 0.5, min_stock_level: 40, max_stock_level: 800, reorder_point: 80, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "p006", sku: "ELEC-006", name: "LiPo Battery 3.7V 10000mAh", description: "Rechargeable lithium polymer", category_id: "d0000000-0000-0000-0000-000000000001", category_name: "Electronics", barcode: "WH100000006", unit_price: 22.50, weight_kg: 0.18, width_cm: 10.5, height_cm: 7.0, depth_cm: 1.0, min_stock_level: 30, max_stock_level: 600, reorder_point: 70, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "p007", sku: "IND-001", name: "Bearing 6205-2RS", description: "Deep groove ball bearing", category_id: "d0000000-0000-0000-0000-000000000002", category_name: "Industrial Parts", barcode: "WH200000001", unit_price: 6.75, weight_kg: 0.12, width_cm: 5.2, height_cm: 5.2, depth_cm: 1.5, min_stock_level: 100, max_stock_level: 2000, reorder_point: 200, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "p008", sku: "IND-002", name: "Timing Belt GT2 200mm", description: "6mm width timing belt", category_id: "d0000000-0000-0000-0000-000000000002", category_name: "Industrial Parts", barcode: "WH200000002", unit_price: 3.25, weight_kg: 0.03, width_cm: 8.0, height_cm: 8.0, depth_cm: 0.5, min_stock_level: 80, max_stock_level: 1500, reorder_point: 150, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "p009", sku: "IND-003", name: "Linear Rail MGN12H 400mm", description: "Miniature linear guide", category_id: "d0000000-0000-0000-0000-000000000002", category_name: "Industrial Parts", barcode: "WH200000003", unit_price: 28.99, weight_kg: 0.35, width_cm: 40.0, height_cm: 1.2, depth_cm: 2.7, min_stock_level: 20, max_stock_level: 200, reorder_point: 40, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "p010", sku: "IND-004", name: "Stepper Motor NEMA 17", description: "1.8° step angle 42mm", category_id: "d0000000-0000-0000-0000-000000000002", category_name: "Industrial Parts", barcode: "WH200000004", unit_price: 14.99, weight_kg: 0.28, width_cm: 4.2, height_cm: 4.2, depth_cm: 4.0, min_stock_level: 30, max_stock_level: 500, reorder_point: 60, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "p011", sku: "PKG-001", name: "Corrugated Box 18x14x12", description: "Standard shipping box", category_id: "d0000000-0000-0000-0000-000000000003", category_name: "Packaging", barcode: "WH300000001", unit_price: 1.25, weight_kg: 0.45, width_cm: 45.7, height_cm: 35.6, depth_cm: 30.5, min_stock_level: 200, max_stock_level: 5000, reorder_point: 500, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "p012", sku: "PKG-002", name: "Bubble Wrap Roll 12\"x175ft", description: "Protective cushioning wrap", category_id: "d0000000-0000-0000-0000-000000000003", category_name: "Packaging", barcode: "WH300000002", unit_price: 24.99, weight_kg: 2.80, width_cm: 30.5, height_cm: 30.5, depth_cm: 30.5, min_stock_level: 20, max_stock_level: 200, reorder_point: 40, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "p013", sku: "SAF-001", name: "Safety Goggles Anti-Fog", description: "ANSI Z87.1 rated", category_id: "d0000000-0000-0000-0000-000000000004", category_name: "Safety Equipment", barcode: "WH400000001", unit_price: 12.99, weight_kg: 0.08, width_cm: 18.0, height_cm: 8.0, depth_cm: 7.0, min_stock_level: 30, max_stock_level: 500, reorder_point: 60, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "p014", sku: "SAF-002", name: "High-Vis Vest Class 3", description: "ANSI/ISEA reflective vest", category_id: "d0000000-0000-0000-0000-000000000004", category_name: "Safety Equipment", barcode: "WH400000002", unit_price: 15.99, weight_kg: 0.22, width_cm: 30.0, height_cm: 25.0, depth_cm: 3.0, min_stock_level: 25, max_stock_level: 400, reorder_point: 50, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "p015", sku: "SAF-003", name: "Hard Hat Type II", description: "Vented with ratchet suspension", category_id: "d0000000-0000-0000-0000-000000000004", category_name: "Safety Equipment", barcode: "WH400000003", unit_price: 28.50, weight_kg: 0.40, width_cm: 30.0, height_cm: 20.0, depth_cm: 25.0, min_stock_level: 15, max_stock_level: 200, reorder_point: 30, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "p016", sku: "TL-001", name: "Cordless Drill 20V", description: "Variable speed with clutch", category_id: "d0000000-0000-0000-0000-000000000005", category_name: "Tools", barcode: "WH500000001", unit_price: 129.99, weight_kg: 1.80, width_cm: 25.0, height_cm: 22.0, depth_cm: 8.0, min_stock_level: 8, max_stock_level: 80, reorder_point: 15, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "p017", sku: "TL-002", name: "Socket Set 40-Piece", description: "SAE and Metric combination", category_id: "d0000000-0000-0000-0000-000000000005", category_name: "Tools", barcode: "WH500000002", unit_price: 49.99, weight_kg: 2.50, width_cm: 35.0, height_cm: 20.0, depth_cm: 8.0, min_stock_level: 10, max_stock_level: 120, reorder_point: 20, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "p018", sku: "AUTO-001", name: "Brake Pad Set Ceramic", description: "Low dust front brake pads", category_id: "d0000000-0000-0000-0000-000000000006", category_name: "Automotive Parts", barcode: "WH600000001", unit_price: 42.99, weight_kg: 1.80, width_cm: 16.0, height_cm: 8.0, depth_cm: 5.0, min_stock_level: 20, max_stock_level: 300, reorder_point: 40, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "p019", sku: "FB-001", name: "Protein Bars Case (24)", description: "Chocolate peanut butter", category_id: "d0000000-0000-0000-0000-000000000007", category_name: "Food & Beverage", barcode: "WH700000001", unit_price: 32.99, weight_kg: 1.50, width_cm: 30.0, height_cm: 20.0, depth_cm: 15.0, min_stock_level: 20, max_stock_level: 300, reorder_point: 40, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "p020", sku: "OFF-001", name: "Copy Paper Ream 500", description: "20lb A4 white paper", category_id: "d0000000-0000-0000-0000-000000000008", category_name: "Office Supplies", barcode: "WH800000001", unit_price: 8.99, weight_kg: 2.50, width_cm: 30.0, height_cm: 21.0, depth_cm: 5.0, min_stock_level: 40, max_stock_level: 600, reorder_point: 80, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

function randomQuantity(min: number, max: number) {
  return Math.floor(min + Math.random() * (max - min));
}

export const mockInventoryOverview: Views<"v_inventory_overview">[] =
  mockProducts.map((p) => {
    const qty = randomQuantity(p.min_stock_level - 5, p.max_stock_level);
    return {
      product_id: p.id,
      product_name: p.name,
      sku: p.sku,
      category_name: p.category_name,
      total_quantity: qty,
      total_locations: randomQuantity(1, 4),
      unit_price: p.unit_price,
      total_value: qty * p.unit_price,
      min_stock_level: p.min_stock_level,
      max_stock_level: p.max_stock_level,
      stock_status:
        qty <= 0
          ? "out_of_stock"
          : qty <= p.min_stock_level
            ? "critical"
            : qty <= p.reorder_point
              ? "low"
              : qty >= p.max_stock_level
                ? "overstock"
                : "normal",
    };
  });

const movementTypes = ["receive", "pick", "transfer", "adjust"] as const;
const performers = ["Alex Rivera", "Sam Chen", "Jordan Patel", "Taylor Kim"];

export const mockMovements: Tables<"stock_movements">[] = Array.from(
  { length: 50 },
  (_, i) => {
    const type = movementTypes[Math.floor(Math.random() * movementTypes.length)];
    const product = mockProducts[Math.floor(Math.random() * mockProducts.length)];
    const hoursAgo = Math.floor(Math.random() * 72);
    return {
      id: `mov-${i}`,
      product_id: product.id,
      from_bin_id: type === "pick" || type === "transfer" ? `bin-${Math.floor(Math.random() * 200)}` : null,
      to_bin_id: type === "receive" || type === "transfer" ? `bin-${Math.floor(Math.random() * 200)}` : null,
      quantity: Math.floor(Math.random() * 50) + 1,
      movement_type: type,
      reference_number: type === "receive" ? `PO-${10000 + i}` : type === "pick" ? `SO-${20000 + i}` : null,
      notes: null,
      performed_by: performers[Math.floor(Math.random() * performers.length)],
      created_at: new Date(Date.now() - hoursAgo * 3600000).toISOString(),
    };
  }
).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

export const mockAlerts: Tables<"alerts">[] = [
  { id: "alert-1", alert_rule_id: null, warehouse_id: WAREHOUSE_ID, product_id: "p015", bin_location_id: null, alert_type: "low_stock", severity: "critical", title: "Low Stock: Hard Hat Type II", message: "Hard Hat Type II (SKU: SAF-003) has only 8 units remaining. Min level: 15", status: "open", acknowledged_by: null, acknowledged_at: null, resolved_at: null, created_at: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: "alert-2", alert_rule_id: null, warehouse_id: WAREHOUSE_ID, product_id: "p016", bin_location_id: null, alert_type: "low_stock", severity: "warning", title: "Low Stock: Cordless Drill 20V", message: "Cordless Drill 20V (SKU: TL-001) has only 12 units remaining. Min level: 8", status: "open", acknowledged_by: null, acknowledged_at: null, resolved_at: null, created_at: new Date(Date.now() - 5 * 3600000).toISOString() },
  { id: "alert-3", alert_rule_id: null, warehouse_id: WAREHOUSE_ID, product_id: "p011", bin_location_id: null, alert_type: "overstock", severity: "info", title: "Overstock: Corrugated Box 18x14x12", message: "Corrugated Box (SKU: PKG-001) has 4,850 units. Max level: 5,000", status: "open", acknowledged_by: null, acknowledged_at: null, resolved_at: null, created_at: new Date(Date.now() - 24 * 3600000).toISOString() },
  { id: "alert-4", alert_rule_id: null, warehouse_id: WAREHOUSE_ID, product_id: "p019", bin_location_id: null, alert_type: "low_stock", severity: "warning", title: "Low Stock: Protein Bars Case", message: "Protein Bars Case (SKU: FB-001) has only 18 units remaining. Min level: 20", status: "acknowledged", acknowledged_by: "Sam Chen", acknowledged_at: new Date(Date.now() - 20 * 3600000).toISOString(), resolved_at: null, created_at: new Date(Date.now() - 72 * 3600000).toISOString() },
  { id: "alert-5", alert_rule_id: null, warehouse_id: WAREHOUSE_ID, product_id: "p009", bin_location_id: null, alert_type: "no_movement", severity: "warning", title: "No Movement: Linear Rail MGN12H", message: "Linear Rail MGN12H 400mm (SKU: IND-003) has had no stock movement in 30+ days", status: "open", acknowledged_by: null, acknowledged_at: null, resolved_at: null, created_at: new Date(Date.now() - 6 * 3600000).toISOString() },
  { id: "alert-6", alert_rule_id: null, warehouse_id: WAREHOUSE_ID, product_id: null, bin_location_id: null, alert_type: "low_stock", severity: "critical", title: "Multiple Items Below Minimum", message: "3 items across Zone B are below minimum stock levels", status: "open", acknowledged_by: null, acknowledged_at: null, resolved_at: null, created_at: new Date(Date.now() - 1800000).toISOString() },
];

export const mockZoneUtilization: Views<"v_zone_utilization">[] = [
  { zone_id: "z001", zone_name: "Zone A - Ambient Storage", zone_type: "ambient", warehouse_name: "Bay Area DC", total_bins: 96, occupied_bins: 78, total_items: 4520, utilization_percent: 81.3 },
  { zone_id: "z002", zone_name: "Zone B - Cold Storage", zone_type: "cold", warehouse_name: "Bay Area DC", total_bins: 72, occupied_bins: 45, total_items: 1890, utilization_percent: 62.5 },
  { zone_id: "z003", zone_name: "Zone C - Bulk & Picking", zone_type: "picking", warehouse_name: "Bay Area DC", total_bins: 96, occupied_bins: 88, total_items: 6340, utilization_percent: 91.7 },
];

export const mockSnapshotData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    date: date.toISOString().split("T")[0],
    totalItems: 12000 + Math.floor(Math.random() * 2000 - 1000),
    totalValue: 285000 + Math.floor(Math.random() * 30000 - 15000),
    movements: 15 + Math.floor(Math.random() * 20),
  };
});

// Warehouse map grid data
export interface BinCell {
  id: string;
  label: string;
  row: number;
  col: number;
  zone: string;
  zoneColor: string;
  quantity: number;
  maxCapacity: number;
  productName?: string;
}

function generateBins(): BinCell[] {
  const bins: BinCell[] = [];
  const zones = [
    { name: "Zone A", color: "#3b82f6", rowStart: 0, rowEnd: 8, colStart: 0, colEnd: 8 },
    { name: "Zone B", color: "#06b6d4", rowStart: 0, rowEnd: 8, colStart: 9, colEnd: 14 },
    { name: "Zone C", color: "#8b5cf6", rowStart: 9, rowEnd: 14, colStart: 0, colEnd: 14 },
  ];

  const sampleProducts = [
    "Raspberry Pi 5", "Arduino Mega", "ESP32 Module", "USB-C Hub",
    "Bearing 6205", "Timing Belt", "Corrugated Box", "Safety Goggles",
    "Hard Hat", "Drill 20V", "Brake Pads", "Copy Paper",
  ];

  let binId = 0;
  for (const zone of zones) {
    for (let r = zone.rowStart; r < zone.rowEnd; r++) {
      for (let c = zone.colStart; c <= zone.colEnd; c++) {
        // Leave some gaps for aisles
        if (c === zone.colStart + Math.floor((zone.colEnd - zone.colStart) / 2)) continue;
        if (r % 3 === 2 && zone.name !== "Zone C") continue;

        const maxCap = zone.name === "Zone C" ? 200 : 100;
        const qty = Math.random() > 0.15 ? Math.floor(Math.random() * maxCap) : 0;

        bins.push({
          id: `bin-${binId++}`,
          label: `${zone.name.slice(-1)}-${r}-${c}`,
          row: r,
          col: c,
          zone: zone.name,
          zoneColor: zone.color,
          quantity: qty,
          maxCapacity: maxCap,
          productName: qty > 0 ? sampleProducts[Math.floor(Math.random() * sampleProducts.length)] : undefined,
        });
      }
    }
  }
  return bins;
}

export const mockBins = generateBins();

export const mockAlertRules = [
  { id: "ar-1", warehouse_id: WAREHOUSE_ID, product_id: null, zone_id: null, rule_type: "low_stock" as const, threshold: 10, severity: "critical" as const, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "ar-2", warehouse_id: WAREHOUSE_ID, product_id: null, zone_id: null, rule_type: "low_stock" as const, threshold: 25, severity: "warning" as const, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "ar-3", warehouse_id: WAREHOUSE_ID, product_id: null, zone_id: null, rule_type: "overstock" as const, threshold: 95, severity: "info" as const, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "ar-4", warehouse_id: WAREHOUSE_ID, product_id: null, zone_id: null, rule_type: "no_movement" as const, threshold: 30, severity: "warning" as const, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export function getProductById(id: string) {
  return mockProducts.find((p) => p.id === id);
}

export function getProductByBarcode(barcode: string) {
  return mockProducts.find((p) => p.barcode === barcode);
}
