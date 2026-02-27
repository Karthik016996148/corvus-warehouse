-- WarehouseIQ Seed Data
-- 1 warehouse, 3 zones, 12 aisles, ~200 bins, 50 products, 500+ movements

-- ============================================
-- WAREHOUSE
-- ============================================

INSERT INTO warehouses (id, name, address, city, state, total_capacity) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Bay Area Distribution Center', '1200 Warehouse Blvd', 'Fremont', 'CA', 10000);

-- ============================================
-- USERS
-- ============================================

INSERT INTO users (id, name, email, role, warehouse_id) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'Alex Rivera', 'alex@warehouseiq.io', 'admin', 'a0000000-0000-0000-0000-000000000001'),
  ('b0000000-0000-0000-0000-000000000002', 'Sam Chen', 'sam@warehouseiq.io', 'manager', 'a0000000-0000-0000-0000-000000000001'),
  ('b0000000-0000-0000-0000-000000000003', 'Jordan Patel', 'jordan@warehouseiq.io', 'operator', 'a0000000-0000-0000-0000-000000000001'),
  ('b0000000-0000-0000-0000-000000000004', 'Taylor Kim', 'taylor@warehouseiq.io', 'operator', 'a0000000-0000-0000-0000-000000000001');

-- ============================================
-- ZONES (3 zones with grid positions for spatial map)
-- ============================================

INSERT INTO zones (id, warehouse_id, name, zone_type, color, grid_row_start, grid_row_end, grid_col_start, grid_col_end) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Zone A - Ambient Storage', 'ambient', '#3b82f6', 0, 10, 0, 8),
  ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Zone B - Cold Storage', 'cold', '#06b6d4', 0, 10, 9, 14),
  ('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Zone C - Bulk & Picking', 'picking', '#8b5cf6', 11, 16, 0, 14);

-- ============================================
-- AISLES (4 per zone)
-- ============================================

INSERT INTO aisles (id, zone_id, name, aisle_number, orientation) VALUES
  -- Zone A
  ('a1000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'A-1', 1, 'vertical'),
  ('a1000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'A-2', 2, 'vertical'),
  ('a1000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'A-3', 3, 'vertical'),
  ('a1000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000001', 'A-4', 4, 'vertical'),
  -- Zone B
  ('a1000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000002', 'B-1', 1, 'vertical'),
  ('a1000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000002', 'B-2', 2, 'vertical'),
  ('a1000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000002', 'B-3', 3, 'vertical'),
  ('a1000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000002', 'B-4', 4, 'vertical'),
  -- Zone C
  ('a1000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000003', 'C-1', 1, 'horizontal'),
  ('a1000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000003', 'C-2', 2, 'horizontal'),
  ('a1000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000003', 'C-3', 3, 'horizontal'),
  ('a1000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000003', 'C-4', 4, 'horizontal');

-- ============================================
-- RACKS (2 per aisle, left and right)
-- ============================================

INSERT INTO racks (id, aisle_id, rack_number, side, levels, bins_per_level) VALUES
  -- Zone A aisles
  ('e0000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 1, 'left', 4, 3),
  ('e0000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 2, 'right', 4, 3),
  ('e0000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000002', 1, 'left', 4, 3),
  ('e0000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000002', 2, 'right', 4, 3),
  ('e0000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000003', 1, 'left', 4, 3),
  ('e0000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000003', 2, 'right', 4, 3),
  ('e0000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000004', 1, 'left', 4, 3),
  ('e0000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000004', 2, 'right', 4, 3),
  -- Zone B aisles
  ('e0000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000005', 1, 'left', 3, 3),
  ('e0000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000005', 2, 'right', 3, 3),
  ('e0000000-0000-0000-0000-000000000011', 'a1000000-0000-0000-0000-000000000006', 1, 'left', 3, 3),
  ('e0000000-0000-0000-0000-000000000012', 'a1000000-0000-0000-0000-000000000006', 2, 'right', 3, 3),
  ('e0000000-0000-0000-0000-000000000013', 'a1000000-0000-0000-0000-000000000007', 1, 'left', 3, 3),
  ('e0000000-0000-0000-0000-000000000014', 'a1000000-0000-0000-0000-000000000007', 2, 'right', 3, 3),
  ('e0000000-0000-0000-0000-000000000015', 'a1000000-0000-0000-0000-000000000008', 1, 'left', 3, 3),
  ('e0000000-0000-0000-0000-000000000016', 'a1000000-0000-0000-0000-000000000008', 2, 'right', 3, 3),
  -- Zone C aisles
  ('e0000000-0000-0000-0000-000000000017', 'a1000000-0000-0000-0000-000000000009', 1, 'left', 3, 4),
  ('e0000000-0000-0000-0000-000000000018', 'a1000000-0000-0000-0000-000000000009', 2, 'right', 3, 4),
  ('e0000000-0000-0000-0000-000000000019', 'a1000000-0000-0000-0000-000000000010', 1, 'left', 3, 4),
  ('e0000000-0000-0000-0000-000000000020', 'a1000000-0000-0000-0000-000000000010', 2, 'right', 3, 4),
  ('e0000000-0000-0000-0000-000000000021', 'a1000000-0000-0000-0000-000000000011', 1, 'left', 3, 4),
  ('e0000000-0000-0000-0000-000000000022', 'a1000000-0000-0000-0000-000000000011', 2, 'right', 3, 4),
  ('e0000000-0000-0000-0000-000000000023', 'a1000000-0000-0000-0000-000000000012', 1, 'left', 3, 4),
  ('e0000000-0000-0000-0000-000000000024', 'a1000000-0000-0000-0000-000000000012', 2, 'right', 3, 4);

-- ============================================
-- BIN LOCATIONS (generated for each rack)
-- Zone A: 8 racks * 4 levels * 3 bins = 96 bins
-- Zone B: 8 racks * 3 levels * 3 bins = 72 bins
-- Zone C: 8 racks * 3 levels * 4 bins = 96 bins
-- Total: 264 bins
-- ============================================

-- We'll insert a representative set. Using DO block for generation.

DO $$
DECLARE
  rack RECORD;
  l INTEGER;
  p INTEGER;
  row_offset INTEGER;
  col_offset INTEGER;
  zone_row_start INTEGER;
  zone_col_start INTEGER;
  rack_idx INTEGER;
  zone_name TEXT;
BEGIN
  rack_idx := 0;
  FOR rack IN SELECT r.id, r.rack_number, r.side, r.levels, r.bins_per_level, r.aisle_id,
                     a.aisle_number, a.zone_id, z.name AS zone_name, z.grid_row_start, z.grid_col_start
              FROM racks r
              JOIN aisles a ON r.aisle_id = a.id
              JOIN zones z ON a.zone_id = z.id
              ORDER BY z.name, a.aisle_number, r.rack_number
  LOOP
    zone_row_start := rack.grid_row_start;
    zone_col_start := rack.grid_col_start;
    zone_name := SUBSTRING(rack.zone_name FROM 'Zone ([A-C])');

    FOR l IN 1..rack.levels LOOP
      FOR p IN 1..rack.bins_per_level LOOP
        row_offset := zone_row_start + ((rack.aisle_number - 1) * 2) + (CASE WHEN rack.side = 'right' THEN 1 ELSE 0 END);
        col_offset := zone_col_start + ((l - 1) * rack.bins_per_level) + (p - 1);

        INSERT INTO bin_locations (rack_id, level, position, label, max_capacity, grid_row, grid_col)
        VALUES (
          rack.id, l, p,
          zone_name || '-' || rack.aisle_number || '-' || rack.rack_number || '-' || l || '-' || p,
          CASE WHEN zone_name = 'C' THEN 200 ELSE 100 END,
          row_offset, col_offset
        );
      END LOOP;
    END LOOP;

    rack_idx := rack_idx + 1;
  END LOOP;
END $$;

-- ============================================
-- PRODUCT CATEGORIES
-- ============================================

INSERT INTO product_categories (id, name, parent_id, icon) VALUES
  ('d0000000-0000-0000-0000-000000000001', 'Electronics', NULL, 'cpu'),
  ('d0000000-0000-0000-0000-000000000002', 'Industrial Parts', NULL, 'cog'),
  ('d0000000-0000-0000-0000-000000000003', 'Packaging', NULL, 'box'),
  ('d0000000-0000-0000-0000-000000000004', 'Safety Equipment', NULL, 'shield'),
  ('d0000000-0000-0000-0000-000000000005', 'Tools', NULL, 'wrench'),
  ('d0000000-0000-0000-0000-000000000006', 'Automotive Parts', NULL, 'car'),
  ('d0000000-0000-0000-0000-000000000007', 'Food & Beverage', NULL, 'coffee'),
  ('d0000000-0000-0000-0000-000000000008', 'Office Supplies', NULL, 'file-text');

-- ============================================
-- PRODUCTS (50 products)
-- ============================================

INSERT INTO products (id, sku, name, description, category_id, barcode, unit_price, weight_kg, width_cm, height_cm, depth_cm, min_stock_level, max_stock_level, reorder_point) VALUES
  ('f0000000-0000-0000-0000-000000000001', 'ELEC-001', 'Raspberry Pi 5 Board', '8GB RAM single-board computer', 'd0000000-0000-0000-0000-000000000001', 'WH100000001', 79.99, 0.05, 8.5, 5.6, 1.7, 20, 500, 50),
  ('f0000000-0000-0000-0000-000000000002', 'ELEC-002', 'Arduino Mega 2560', 'Microcontroller development board', 'd0000000-0000-0000-0000-000000000001', 'WH100000002', 45.99, 0.04, 10.2, 5.3, 1.5, 15, 400, 40),
  ('f0000000-0000-0000-0000-000000000003', 'ELEC-003', 'ESP32-WROOM Module', 'WiFi+BT microcontroller', 'd0000000-0000-0000-0000-000000000001', 'WH100000003', 12.50, 0.01, 2.5, 1.8, 0.3, 50, 1000, 100),
  ('f0000000-0000-0000-0000-000000000004', 'ELEC-004', 'USB-C Hub 7-Port', 'Multi-port USB hub', 'd0000000-0000-0000-0000-000000000001', 'WH100000004', 34.99, 0.15, 12.0, 6.5, 2.0, 25, 300, 60),
  ('f0000000-0000-0000-0000-000000000005', 'ELEC-005', 'OLED Display 128x64', 'I2C monochrome OLED module', 'd0000000-0000-0000-0000-000000000001', 'WH100000005', 8.99, 0.01, 3.5, 3.5, 0.5, 40, 800, 80),
  ('f0000000-0000-0000-0000-000000000006', 'ELEC-006', 'LiPo Battery 3.7V 10000mAh', 'Rechargeable lithium polymer', 'd0000000-0000-0000-0000-000000000001', 'WH100000006', 22.50, 0.18, 10.5, 7.0, 1.0, 30, 600, 70),
  ('f0000000-0000-0000-0000-000000000007', 'IND-001', 'Bearing 6205-2RS', 'Deep groove ball bearing', 'd0000000-0000-0000-0000-000000000002', 'WH200000001', 6.75, 0.12, 5.2, 5.2, 1.5, 100, 2000, 200),
  ('f0000000-0000-0000-0000-000000000008', 'IND-002', 'Timing Belt GT2 200mm', '6mm width timing belt', 'd0000000-0000-0000-0000-000000000002', 'WH200000002', 3.25, 0.03, 8.0, 8.0, 0.5, 80, 1500, 150),
  ('f0000000-0000-0000-0000-000000000009', 'IND-003', 'Linear Rail MGN12H 400mm', 'Miniature linear guide', 'd0000000-0000-0000-0000-000000000002', 'WH200000003', 28.99, 0.35, 40.0, 1.2, 2.7, 20, 200, 40),
  ('f0000000-0000-0000-0000-000000000010', 'IND-004', 'Stepper Motor NEMA 17', '1.8° step angle 42mm', 'd0000000-0000-0000-0000-000000000002', 'WH200000004', 14.99, 0.28, 4.2, 4.2, 4.0, 30, 500, 60),
  ('f0000000-0000-0000-0000-000000000011', 'IND-005', 'Pneumatic Cylinder 50mm', 'Double-acting air cylinder', 'd0000000-0000-0000-0000-000000000002', 'WH200000005', 45.00, 0.85, 5.0, 5.0, 15.0, 15, 150, 30),
  ('f0000000-0000-0000-0000-000000000012', 'IND-006', 'Conveyor Belt Roller', '50mm diameter, 500mm width', 'd0000000-0000-0000-0000-000000000002', 'WH200000006', 32.00, 2.50, 50.0, 5.0, 5.0, 10, 100, 20),
  ('f0000000-0000-0000-0000-000000000013', 'IND-007', 'Hydraulic Hose 1/2" x 1m', 'High pressure hydraulic hose', 'd0000000-0000-0000-0000-000000000002', 'WH200000007', 18.50, 0.65, 100.0, 2.0, 2.0, 25, 300, 50),
  ('f0000000-0000-0000-0000-000000000014', 'PKG-001', 'Corrugated Box 18x14x12', 'Standard shipping box', 'd0000000-0000-0000-0000-000000000003', 'WH300000001', 1.25, 0.45, 45.7, 35.6, 30.5, 200, 5000, 500),
  ('f0000000-0000-0000-0000-000000000015', 'PKG-002', 'Bubble Wrap Roll 12"x175ft', 'Protective cushioning wrap', 'd0000000-0000-0000-0000-000000000003', 'WH300000002', 24.99, 2.80, 30.5, 30.5, 30.5, 20, 200, 40),
  ('f0000000-0000-0000-0000-000000000016', 'PKG-003', 'Packing Tape 2" Clear', '110 yards per roll', 'd0000000-0000-0000-0000-000000000003', 'WH300000003', 3.50, 0.25, 12.0, 12.0, 5.0, 100, 2000, 200),
  ('f0000000-0000-0000-0000-000000000017', 'PKG-004', 'Stretch Wrap 18" x 1500ft', 'Machine grade pallet wrap', 'd0000000-0000-0000-0000-000000000003', 'WH300000004', 18.99, 3.20, 45.7, 45.7, 12.0, 15, 150, 30),
  ('f0000000-0000-0000-0000-000000000018', 'PKG-005', 'Poly Mailer 10x13', 'Self-sealing shipping bag', 'd0000000-0000-0000-0000-000000000003', 'WH300000005', 0.15, 0.01, 25.4, 33.0, 0.1, 500, 10000, 1000),
  ('f0000000-0000-0000-0000-000000000019', 'PKG-006', 'Kraft Paper Roll 30"', 'Recycled packing paper', 'd0000000-0000-0000-0000-000000000003', 'WH300000006', 32.00, 8.50, 76.2, 30.0, 30.0, 10, 100, 20),
  ('f0000000-0000-0000-0000-000000000020', 'SAF-001', 'Safety Goggles Anti-Fog', 'ANSI Z87.1 rated', 'd0000000-0000-0000-0000-000000000004', 'WH400000001', 12.99, 0.08, 18.0, 8.0, 7.0, 30, 500, 60),
  ('f0000000-0000-0000-0000-000000000021', 'SAF-002', 'High-Vis Vest Class 3', 'ANSI/ISEA reflective vest', 'd0000000-0000-0000-0000-000000000004', 'WH400000002', 15.99, 0.22, 30.0, 25.0, 3.0, 25, 400, 50),
  ('f0000000-0000-0000-0000-000000000022', 'SAF-003', 'Hard Hat Type II', 'Vented with ratchet suspension', 'd0000000-0000-0000-0000-000000000004', 'WH400000003', 28.50, 0.40, 30.0, 20.0, 25.0, 15, 200, 30),
  ('f0000000-0000-0000-0000-000000000023', 'SAF-004', 'Steel Toe Boots Size 10', 'ASTM F2413 compliant', 'd0000000-0000-0000-0000-000000000004', 'WH400000004', 89.99, 1.20, 32.0, 15.0, 12.0, 10, 100, 20),
  ('f0000000-0000-0000-0000-000000000024', 'SAF-005', 'Ear Protection Muffs NRR 31', 'Over-ear noise reduction', 'd0000000-0000-0000-0000-000000000004', 'WH400000005', 24.99, 0.30, 20.0, 18.0, 10.0, 20, 300, 40),
  ('f0000000-0000-0000-0000-000000000025', 'SAF-006', 'Nitrile Gloves Box (100)', 'Powder-free examination grade', 'd0000000-0000-0000-0000-000000000004', 'WH400000006', 9.99, 0.55, 24.0, 12.0, 8.0, 50, 1000, 100),
  ('f0000000-0000-0000-0000-000000000026', 'SAF-007', 'Fire Extinguisher ABC 5lb', 'Multi-purpose dry chemical', 'd0000000-0000-0000-0000-000000000004', 'WH400000007', 45.00, 2.30, 12.0, 12.0, 38.0, 10, 50, 15),
  ('f0000000-0000-0000-0000-000000000027', 'TL-001', 'Cordless Drill 20V', 'Variable speed with clutch', 'd0000000-0000-0000-0000-000000000005', 'WH500000001', 129.99, 1.80, 25.0, 22.0, 8.0, 8, 80, 15),
  ('f0000000-0000-0000-0000-000000000028', 'TL-002', 'Socket Set 40-Piece', 'SAE and Metric combination', 'd0000000-0000-0000-0000-000000000005', 'WH500000002', 49.99, 2.50, 35.0, 20.0, 8.0, 10, 120, 20),
  ('f0000000-0000-0000-0000-000000000029', 'TL-003', 'Digital Caliper 6"', 'Stainless steel with LCD', 'd0000000-0000-0000-0000-000000000005', 'WH500000003', 24.99, 0.15, 25.0, 8.0, 2.0, 15, 200, 30),
  ('f0000000-0000-0000-0000-000000000030', 'TL-004', 'Torque Wrench 1/2"', '10-150 ft-lb range', 'd0000000-0000-0000-0000-000000000005', 'WH500000004', 79.99, 1.50, 50.0, 5.0, 5.0, 8, 60, 12),
  ('f0000000-0000-0000-0000-000000000031', 'TL-005', 'Heat Gun 1500W', 'Variable temperature control', 'd0000000-0000-0000-0000-000000000005', 'WH500000005', 39.99, 0.75, 25.0, 20.0, 8.0, 10, 80, 20),
  ('f0000000-0000-0000-0000-000000000032', 'TL-006', 'Wire Stripper Automatic', 'AWG 10-24 range', 'd0000000-0000-0000-0000-000000000005', 'WH500000006', 18.99, 0.20, 18.0, 6.0, 2.0, 20, 300, 40),
  ('f0000000-0000-0000-0000-000000000033', 'AUTO-001', 'Brake Pad Set Ceramic', 'Low dust front brake pads', 'd0000000-0000-0000-0000-000000000006', 'WH600000001', 42.99, 1.80, 16.0, 8.0, 5.0, 20, 300, 40),
  ('f0000000-0000-0000-0000-000000000034', 'AUTO-002', 'Oil Filter Standard', 'Spin-on cartridge filter', 'd0000000-0000-0000-0000-000000000006', 'WH600000002', 7.99, 0.30, 10.0, 10.0, 10.0, 50, 800, 100),
  ('f0000000-0000-0000-0000-000000000035', 'AUTO-003', 'Spark Plug Iridium', 'Long-life iridium tip', 'd0000000-0000-0000-0000-000000000006', 'WH600000003', 11.99, 0.05, 2.0, 2.0, 8.0, 100, 2000, 200),
  ('f0000000-0000-0000-0000-000000000036', 'AUTO-004', 'Serpentine Belt 6PK2135', 'EPDM micro-V belt', 'd0000000-0000-0000-0000-000000000006', 'WH600000004', 28.50, 0.35, 30.0, 30.0, 2.0, 15, 200, 30),
  ('f0000000-0000-0000-0000-000000000037', 'AUTO-005', 'Headlight Bulb H11 LED', '6000K white LED pair', 'd0000000-0000-0000-0000-000000000006', 'WH600000005', 35.99, 0.10, 8.0, 4.0, 4.0, 25, 400, 50),
  ('f0000000-0000-0000-0000-000000000038', 'AUTO-006', 'Cabin Air Filter', 'Activated carbon media', 'd0000000-0000-0000-0000-000000000006', 'WH600000006', 15.99, 0.20, 25.0, 20.0, 2.5, 30, 500, 60),
  ('f0000000-0000-0000-0000-000000000039', 'FB-001', 'Protein Bars Case (24)', 'Chocolate peanut butter', 'd0000000-0000-0000-0000-000000000007', 'WH700000001', 32.99, 1.50, 30.0, 20.0, 15.0, 20, 300, 40),
  ('f0000000-0000-0000-0000-000000000040', 'FB-002', 'Water Bottles Case (24)', '500ml spring water', 'd0000000-0000-0000-0000-000000000007', 'WH700000002', 8.99, 12.00, 40.0, 25.0, 25.0, 30, 500, 60),
  ('f0000000-0000-0000-0000-000000000041', 'FB-003', 'Energy Drink Case (12)', 'Sugar-free 250ml cans', 'd0000000-0000-0000-0000-000000000007', 'WH700000003', 18.99, 3.50, 30.0, 15.0, 20.0, 25, 400, 50),
  ('f0000000-0000-0000-0000-000000000042', 'FB-004', 'Coffee Beans 1kg Premium', 'Medium roast arabica', 'd0000000-0000-0000-0000-000000000007', 'WH700000004', 24.99, 1.05, 12.0, 25.0, 8.0, 15, 200, 30),
  ('f0000000-0000-0000-0000-000000000043', 'FB-005', 'Dried Fruit Mix 500g', 'Trail mix assortment', 'd0000000-0000-0000-0000-000000000007', 'WH700000005', 12.99, 0.55, 15.0, 22.0, 5.0, 30, 400, 60),
  ('f0000000-0000-0000-0000-000000000044', 'FB-006', 'Instant Noodles Case (30)', 'Assorted flavors bulk', 'd0000000-0000-0000-0000-000000000007', 'WH700000006', 15.99, 4.20, 40.0, 30.0, 25.0, 20, 300, 40),
  ('f0000000-0000-0000-0000-000000000045', 'OFF-001', 'Copy Paper Ream 500', '20lb A4 white paper', 'd0000000-0000-0000-0000-000000000008', 'WH800000001', 8.99, 2.50, 30.0, 21.0, 5.0, 40, 600, 80),
  ('f0000000-0000-0000-0000-000000000046', 'OFF-002', 'Thermal Labels 4x6 Roll', '250 labels per roll', 'd0000000-0000-0000-0000-000000000008', 'WH800000002', 14.99, 0.50, 10.0, 15.0, 10.0, 50, 1000, 100),
  ('f0000000-0000-0000-0000-000000000047', 'OFF-003', 'Ink Cartridge Black XL', 'High yield compatible', 'd0000000-0000-0000-0000-000000000008', 'WH800000003', 22.99, 0.12, 12.0, 8.0, 4.0, 20, 300, 40),
  ('f0000000-0000-0000-0000-000000000048', 'OFF-004', 'Whiteboard Markers Set (8)', 'Assorted colors chisel tip', 'd0000000-0000-0000-0000-000000000008', 'WH800000004', 11.99, 0.18, 20.0, 12.0, 3.0, 25, 400, 50),
  ('f0000000-0000-0000-0000-000000000049', 'OFF-005', 'Filing Cabinet Labels', 'Adhesive tab inserts 100pk', 'd0000000-0000-0000-0000-000000000008', 'WH800000005', 6.99, 0.10, 15.0, 10.0, 2.0, 30, 500, 60),
  ('f0000000-0000-0000-0000-000000000050', 'OFF-006', 'Desk Organizer Mesh', '5-compartment metal mesh', 'd0000000-0000-0000-0000-000000000008', 'WH800000006', 19.99, 0.80, 30.0, 18.0, 15.0, 10, 150, 20);

-- ============================================
-- INVENTORY ITEMS (place products in bins)
-- ============================================

DO $$
DECLARE
  bin_ids UUID[];
  prod RECORD;
  num_locations INTEGER;
  bin_idx INTEGER;
  qty INTEGER;
BEGIN
  SELECT array_agg(id ORDER BY random()) INTO bin_ids FROM bin_locations;

  FOR prod IN SELECT id, min_stock_level, max_stock_level FROM products LOOP
    num_locations := 1 + floor(random() * 3)::INTEGER;
    FOR i IN 1..num_locations LOOP
      bin_idx := 1 + floor(random() * array_length(bin_ids, 1))::INTEGER;
      qty := prod.min_stock_level + floor(random() * (prod.max_stock_level - prod.min_stock_level))::INTEGER;

      INSERT INTO inventory_items (product_id, bin_location_id, quantity)
      VALUES (prod.id, bin_ids[bin_idx], qty)
      ON CONFLICT (product_id, bin_location_id) DO UPDATE SET quantity = inventory_items.quantity + EXCLUDED.quantity;
    END LOOP;
  END LOOP;
END $$;

-- ============================================
-- STOCK MOVEMENTS (historical data - ~500 entries)
-- ============================================

DO $$
DECLARE
  prod_ids UUID[];
  bin_ids UUID[];
  movement_types TEXT[] := ARRAY['receive', 'pick', 'transfer', 'adjust'];
  user_names TEXT[] := ARRAY['Alex Rivera', 'Sam Chen', 'Jordan Patel', 'Taylor Kim'];
  i INTEGER;
  prod_idx INTEGER;
  bin_idx INTEGER;
  m_type TEXT;
  qty INTEGER;
  days_ago INTEGER;
BEGIN
  SELECT array_agg(id) INTO prod_ids FROM products;
  SELECT array_agg(id) INTO bin_ids FROM bin_locations;

  FOR i IN 1..500 LOOP
    prod_idx := 1 + floor(random() * array_length(prod_ids, 1))::INTEGER;
    bin_idx := 1 + floor(random() * array_length(bin_ids, 1))::INTEGER;
    m_type := movement_types[1 + floor(random() * 4)::INTEGER];
    qty := 1 + floor(random() * 15)::INTEGER;
    days_ago := floor(random() * 90)::INTEGER;

    IF m_type = 'receive' THEN
      INSERT INTO stock_movements (product_id, to_bin_id, quantity, movement_type, performed_by, created_at, reference_number)
      VALUES (prod_ids[prod_idx], bin_ids[bin_idx], qty, m_type,
              user_names[1 + floor(random() * 4)::INTEGER],
              NOW() - (days_ago || ' days')::INTERVAL - (floor(random() * 24) || ' hours')::INTERVAL,
              'PO-' || (10000 + i));
    ELSIF m_type = 'pick' THEN
      INSERT INTO stock_movements (product_id, from_bin_id, quantity, movement_type, performed_by, created_at, reference_number)
      VALUES (prod_ids[prod_idx], bin_ids[bin_idx], qty, m_type,
              user_names[1 + floor(random() * 4)::INTEGER],
              NOW() - (days_ago || ' days')::INTERVAL - (floor(random() * 24) || ' hours')::INTERVAL,
              'SO-' || (20000 + i));
    ELSIF m_type = 'transfer' THEN
      INSERT INTO stock_movements (product_id, from_bin_id, to_bin_id, quantity, movement_type, performed_by, created_at)
      VALUES (prod_ids[prod_idx], bin_ids[bin_idx],
              bin_ids[1 + floor(random() * array_length(bin_ids, 1))::INTEGER],
              qty, m_type,
              user_names[1 + floor(random() * 4)::INTEGER],
              NOW() - (days_ago || ' days')::INTERVAL - (floor(random() * 24) || ' hours')::INTERVAL);
    ELSE
      INSERT INTO stock_movements (product_id, to_bin_id, quantity, movement_type, performed_by, created_at, notes)
      VALUES (prod_ids[prod_idx], bin_ids[bin_idx], qty, m_type,
              user_names[1 + floor(random() * 4)::INTEGER],
              NOW() - (days_ago || ' days')::INTERVAL,
              'Cycle count adjustment');
    END IF;
  END LOOP;
END $$;

-- ============================================
-- INVENTORY SNAPSHOTS (30 days of history)
-- ============================================

DO $$
DECLARE
  d DATE;
  prod RECORD;
  base_qty INTEGER;
BEGIN
  FOR d IN SELECT generate_series(CURRENT_DATE - 30, CURRENT_DATE, '1 day'::INTERVAL)::DATE LOOP
    FOR prod IN SELECT id, unit_price FROM products LOOP
      base_qty := 50 + floor(random() * 400)::INTEGER;
      INSERT INTO inventory_snapshots (product_id, warehouse_id, total_quantity, total_value, snapshot_date)
      VALUES (prod.id, 'a0000000-0000-0000-0000-000000000001', base_qty, base_qty * prod.unit_price, d)
      ON CONFLICT (product_id, warehouse_id, snapshot_date) DO NOTHING;
    END LOOP;
  END LOOP;
END $$;

-- ============================================
-- ALERT RULES
-- ============================================

INSERT INTO alert_rules (warehouse_id, product_id, rule_type, threshold, severity, is_active) VALUES
  ('a0000000-0000-0000-0000-000000000001', NULL, 'low_stock', 10, 'critical', true),
  ('a0000000-0000-0000-0000-000000000001', NULL, 'low_stock', 25, 'warning', true),
  ('a0000000-0000-0000-0000-000000000001', NULL, 'overstock', 95, 'info', true),
  ('a0000000-0000-0000-0000-000000000001', NULL, 'no_movement', 30, 'warning', true),
  ('a0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'low_stock', 15, 'critical', true),
  ('a0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000003', 'low_stock', 30, 'warning', true);

-- ============================================
-- SAMPLE ALERTS
-- ============================================

INSERT INTO alerts (warehouse_id, product_id, alert_type, severity, title, message, status, created_at) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000023', 'low_stock', 'critical', 'Low Stock: Steel Toe Boots Size 10', 'Steel Toe Boots Size 10 (SKU: SAF-004) has only 8 units remaining. Min level: 10', 'open', NOW() - INTERVAL '2 hours'),
  ('a0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000027', 'low_stock', 'warning', 'Low Stock: Cordless Drill 20V', 'Cordless Drill 20V (SKU: TL-001) has only 12 units remaining. Min level: 8', 'open', NOW() - INTERVAL '5 hours'),
  ('a0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000014', 'overstock', 'info', 'Overstock: Corrugated Box 18x14x12', 'Corrugated Box 18x14x12 (SKU: PKG-001) has 4,850 units. Max level: 5,000', 'open', NOW() - INTERVAL '1 day'),
  ('a0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000042', 'low_stock', 'warning', 'Low Stock: Coffee Beans 1kg Premium', 'Coffee Beans 1kg Premium (SKU: FB-004) has only 18 units remaining. Min level: 15', 'acknowledged', NOW() - INTERVAL '3 days'),
  ('a0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000009', 'no_movement', 'warning', 'No Movement: Linear Rail MGN12H 400mm', 'Linear Rail MGN12H 400mm (SKU: IND-003) has had no stock movement in 30+ days', 'open', NOW() - INTERVAL '6 hours'),
  ('a0000000-0000-0000-0000-000000000001', NULL, 'low_stock', 'critical', 'Multiple Items Below Minimum', '3 items across Zone B are below minimum stock levels', 'open', NOW() - INTERVAL '30 minutes');

-- ============================================
-- CYCLE COUNTS
-- ============================================

INSERT INTO cycle_counts (warehouse_id, zone_id, status, scheduled_date, assigned_to, notes) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'completed', CURRENT_DATE - 7, 'Jordan Patel', 'Weekly Zone A count'),
  ('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'in_progress', CURRENT_DATE, 'Taylor Kim', 'Weekly Zone B count'),
  ('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003', 'scheduled', CURRENT_DATE + 3, 'Sam Chen', 'Scheduled Zone C audit');
