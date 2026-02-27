-- WarehouseIQ Database Schema
-- 17 tables with triggers, views, indexes, and RLS

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CORE TABLES
-- ============================================

CREATE TABLE warehouses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  total_capacity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  warehouse_id UUID NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  zone_type TEXT NOT NULL CHECK (zone_type IN ('ambient', 'cold', 'hazmat', 'bulk', 'picking')),
  color TEXT NOT NULL DEFAULT '#3b82f6',
  grid_row_start INTEGER NOT NULL DEFAULT 0,
  grid_row_end INTEGER NOT NULL DEFAULT 1,
  grid_col_start INTEGER NOT NULL DEFAULT 0,
  grid_col_end INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE aisles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zone_id UUID NOT NULL REFERENCES zones(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  aisle_number INTEGER NOT NULL,
  orientation TEXT NOT NULL CHECK (orientation IN ('horizontal', 'vertical')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE racks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aisle_id UUID NOT NULL REFERENCES aisles(id) ON DELETE CASCADE,
  rack_number INTEGER NOT NULL,
  side TEXT NOT NULL CHECK (side IN ('left', 'right')),
  levels INTEGER NOT NULL DEFAULT 4,
  bins_per_level INTEGER NOT NULL DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE bin_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rack_id UUID NOT NULL REFERENCES racks(id) ON DELETE CASCADE,
  level INTEGER NOT NULL,
  position INTEGER NOT NULL,
  label TEXT NOT NULL UNIQUE,
  max_capacity INTEGER NOT NULL DEFAULT 100,
  grid_row INTEGER NOT NULL DEFAULT 0,
  grid_col INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  parent_id UUID REFERENCES product_categories(id),
  icon TEXT NOT NULL DEFAULT 'package',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category_id UUID NOT NULL REFERENCES product_categories(id),
  barcode TEXT NOT NULL UNIQUE,
  unit_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  weight_kg DECIMAL(6, 2) NOT NULL DEFAULT 0,
  width_cm DECIMAL(6, 2) NOT NULL DEFAULT 0,
  height_cm DECIMAL(6, 2) NOT NULL DEFAULT 0,
  depth_cm DECIMAL(6, 2) NOT NULL DEFAULT 0,
  min_stock_level INTEGER NOT NULL DEFAULT 10,
  max_stock_level INTEGER NOT NULL DEFAULT 500,
  reorder_point INTEGER NOT NULL DEFAULT 25,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE inventory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  bin_location_id UUID NOT NULL REFERENCES bin_locations(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  lot_number TEXT,
  expiry_date DATE,
  last_counted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, bin_location_id)
);

CREATE TABLE stock_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id),
  from_bin_id UUID REFERENCES bin_locations(id),
  to_bin_id UUID REFERENCES bin_locations(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  movement_type TEXT NOT NULL CHECK (movement_type IN ('receive', 'pick', 'transfer', 'adjust', 'cycle_count')),
  reference_number TEXT,
  notes TEXT,
  performed_by TEXT NOT NULL DEFAULT 'system',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (from_bin_id IS NOT NULL OR to_bin_id IS NOT NULL)
);

CREATE TABLE inventory_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id),
  warehouse_id UUID NOT NULL REFERENCES warehouses(id),
  total_quantity INTEGER NOT NULL DEFAULT 0,
  total_value DECIMAL(12, 2) NOT NULL DEFAULT 0,
  snapshot_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, warehouse_id, snapshot_date)
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'operator', 'viewer')),
  warehouse_id UUID REFERENCES warehouses(id),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cycle_counts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  warehouse_id UUID NOT NULL REFERENCES warehouses(id),
  zone_id UUID REFERENCES zones(id),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  scheduled_date DATE NOT NULL,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  assigned_to TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cycle_count_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cycle_count_id UUID NOT NULL REFERENCES cycle_counts(id) ON DELETE CASCADE,
  inventory_item_id UUID NOT NULL REFERENCES inventory_items(id),
  expected_quantity INTEGER NOT NULL DEFAULT 0,
  actual_quantity INTEGER,
  variance INTEGER,
  counted_at TIMESTAMPTZ
);

CREATE TABLE alert_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  warehouse_id UUID NOT NULL REFERENCES warehouses(id),
  product_id UUID REFERENCES products(id),
  zone_id UUID REFERENCES zones(id),
  rule_type TEXT NOT NULL CHECK (rule_type IN ('low_stock', 'overstock', 'expiring', 'no_movement', 'misplaced')),
  threshold INTEGER NOT NULL DEFAULT 10,
  severity TEXT NOT NULL DEFAULT 'warning' CHECK (severity IN ('info', 'warning', 'critical')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alert_rule_id UUID REFERENCES alert_rules(id),
  warehouse_id UUID NOT NULL REFERENCES warehouses(id),
  product_id UUID REFERENCES products(id),
  bin_location_id UUID REFERENCES bin_locations(id),
  alert_type TEXT NOT NULL CHECK (alert_type IN ('low_stock', 'overstock', 'expiring', 'no_movement', 'misplaced')),
  severity TEXT NOT NULL DEFAULT 'warning' CHECK (severity IN ('info', 'warning', 'critical')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'acknowledged', 'resolved', 'dismissed')),
  acknowledged_by TEXT,
  acknowledged_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE scan_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  warehouse_id UUID NOT NULL REFERENCES warehouses(id),
  session_type TEXT NOT NULL CHECK (session_type IN ('receive', 'pick', 'audit', 'transfer')),
  scanned_by TEXT NOT NULL,
  total_scans INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE scan_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scan_session_id UUID NOT NULL REFERENCES scan_sessions(id) ON DELETE CASCADE,
  barcode TEXT NOT NULL,
  product_id UUID REFERENCES products(id),
  bin_location_id UUID REFERENCES bin_locations(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  scan_result TEXT NOT NULL CHECK (scan_result IN ('success', 'not_found', 'error')),
  scanned_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_inventory_items_product ON inventory_items(product_id);
CREATE INDEX idx_inventory_items_bin ON inventory_items(bin_location_id);
CREATE INDEX idx_inventory_items_product_bin ON inventory_items(product_id, bin_location_id);
CREATE INDEX idx_stock_movements_product ON stock_movements(product_id);
CREATE INDEX idx_stock_movements_created ON stock_movements(created_at DESC);
CREATE INDEX idx_stock_movements_type ON stock_movements(movement_type);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_alerts_warehouse ON alerts(warehouse_id);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_created ON alerts(created_at DESC);
CREATE INDEX idx_bin_locations_rack ON bin_locations(rack_id);
CREATE INDEX idx_bin_locations_grid ON bin_locations(grid_row, grid_col);
CREATE INDEX idx_snapshots_date ON inventory_snapshots(snapshot_date);
CREATE INDEX idx_snapshots_product_warehouse ON inventory_snapshots(product_id, warehouse_id);
CREATE INDEX idx_scan_entries_barcode ON scan_entries(barcode);

-- Full-text search on products
CREATE INDEX idx_products_search ON products USING GIN (to_tsvector('english', name || ' ' || description || ' ' || sku));

-- ============================================
-- VIEWS
-- ============================================

CREATE OR REPLACE VIEW v_inventory_overview AS
SELECT
  p.id AS product_id,
  p.name AS product_name,
  p.sku,
  pc.name AS category_name,
  COALESCE(SUM(ii.quantity), 0)::INTEGER AS total_quantity,
  COUNT(DISTINCT ii.bin_location_id)::INTEGER AS total_locations,
  p.unit_price,
  COALESCE(SUM(ii.quantity * p.unit_price), 0)::DECIMAL AS total_value,
  p.min_stock_level,
  p.max_stock_level,
  CASE
    WHEN COALESCE(SUM(ii.quantity), 0) = 0 THEN 'out_of_stock'
    WHEN COALESCE(SUM(ii.quantity), 0) <= p.min_stock_level THEN 'critical'
    WHEN COALESCE(SUM(ii.quantity), 0) <= p.reorder_point THEN 'low'
    WHEN COALESCE(SUM(ii.quantity), 0) >= p.max_stock_level THEN 'overstock'
    ELSE 'normal'
  END AS stock_status
FROM products p
LEFT JOIN product_categories pc ON p.category_id = pc.id
LEFT JOIN inventory_items ii ON p.id = ii.product_id
GROUP BY p.id, p.name, p.sku, pc.name, p.unit_price, p.min_stock_level, p.max_stock_level, p.reorder_point;

CREATE OR REPLACE VIEW v_zone_utilization AS
SELECT
  z.id AS zone_id,
  z.name AS zone_name,
  z.zone_type,
  w.name AS warehouse_name,
  COUNT(DISTINCT bl.id)::INTEGER AS total_bins,
  COUNT(DISTINCT CASE WHEN ii.quantity > 0 THEN bl.id END)::INTEGER AS occupied_bins,
  COALESCE(SUM(ii.quantity), 0)::INTEGER AS total_items,
  CASE
    WHEN COUNT(DISTINCT bl.id) = 0 THEN 0
    ELSE ROUND(COUNT(DISTINCT CASE WHEN ii.quantity > 0 THEN bl.id END)::DECIMAL / COUNT(DISTINCT bl.id) * 100, 1)
  END AS utilization_percent
FROM zones z
JOIN warehouses w ON z.warehouse_id = w.id
LEFT JOIN aisles a ON a.zone_id = z.id
LEFT JOIN racks r ON r.aisle_id = a.id
LEFT JOIN bin_locations bl ON bl.rack_id = r.id
LEFT JOIN inventory_items ii ON ii.bin_location_id = bl.id
GROUP BY z.id, z.name, z.zone_type, w.name;

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_warehouses_updated_at
  BEFORE UPDATE ON warehouses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_inventory_items_updated_at
  BEFORE UPDATE ON inventory_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_alert_rules_updated_at
  BEFORE UPDATE ON alert_rules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-update inventory on stock movement
CREATE OR REPLACE FUNCTION process_stock_movement()
RETURNS TRIGGER AS $$
BEGIN
  -- Decrease quantity at source (clamp to 0 to avoid constraint violation)
  IF NEW.from_bin_id IS NOT NULL THEN
    UPDATE inventory_items
    SET quantity = GREATEST(0, quantity - NEW.quantity)
    WHERE product_id = NEW.product_id AND bin_location_id = NEW.from_bin_id;
  END IF;

  -- Increase quantity at destination
  IF NEW.to_bin_id IS NOT NULL THEN
    INSERT INTO inventory_items (product_id, bin_location_id, quantity)
    VALUES (NEW.product_id, NEW.to_bin_id, NEW.quantity)
    ON CONFLICT (product_id, bin_location_id)
    DO UPDATE SET quantity = inventory_items.quantity + NEW.quantity;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_process_stock_movement
  AFTER INSERT ON stock_movements
  FOR EACH ROW EXECUTE FUNCTION process_stock_movement();

-- Auto-generate low stock alerts
CREATE OR REPLACE FUNCTION check_low_stock_alert()
RETURNS TRIGGER AS $$
DECLARE
  product_record RECORD;
  total_qty INTEGER;
  warehouse_uuid UUID;
BEGIN
  SELECT p.*, pc.name AS category_name INTO product_record
  FROM products p
  JOIN product_categories pc ON p.category_id = pc.id
  WHERE p.id = NEW.product_id;

  SELECT COALESCE(SUM(quantity), 0) INTO total_qty
  FROM inventory_items
  WHERE product_id = NEW.product_id;

  SELECT w.id INTO warehouse_uuid
  FROM bin_locations bl
  JOIN racks r ON bl.rack_id = r.id
  JOIN aisles a ON r.aisle_id = a.id
  JOIN zones z ON a.zone_id = z.id
  JOIN warehouses w ON z.warehouse_id = w.id
  WHERE bl.id = COALESCE(NEW.bin_location_id, NEW.product_id::UUID)
  LIMIT 1;

  IF warehouse_uuid IS NULL THEN
    SELECT w.id INTO warehouse_uuid FROM warehouses w LIMIT 1;
  END IF;

  IF total_qty <= product_record.min_stock_level AND total_qty > 0 AND warehouse_uuid IS NOT NULL THEN
    INSERT INTO alerts (warehouse_id, product_id, alert_type, severity, title, message, status)
    VALUES (
      warehouse_uuid,
      NEW.product_id,
      'low_stock',
      CASE WHEN total_qty <= product_record.min_stock_level / 2 THEN 'critical' ELSE 'warning' END,
      'Low Stock: ' || product_record.name,
      product_record.name || ' (SKU: ' || product_record.sku || ') has only ' || total_qty || ' units remaining. Min level: ' || product_record.min_stock_level,
      'open'
    )
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_low_stock
  AFTER UPDATE ON inventory_items
  FOR EACH ROW
  WHEN (NEW.quantity < OLD.quantity)
  EXECUTE FUNCTION check_low_stock_alert();

-- Update scan session total_scans count
CREATE OR REPLACE FUNCTION update_scan_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE scan_sessions
  SET total_scans = total_scans + 1
  WHERE id = NEW.scan_session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_scan_count
  AFTER INSERT ON scan_entries
  FOR EACH ROW EXECUTE FUNCTION update_scan_count();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Allow all operations for anon (demo mode - no auth required)
CREATE POLICY "Allow all for anon" ON warehouses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON zones FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON inventory_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON stock_movements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON alerts FOR ALL USING (true) WITH CHECK (true);

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE inventory_items;
ALTER PUBLICATION supabase_realtime ADD TABLE stock_movements;
ALTER PUBLICATION supabase_realtime ADD TABLE alerts;
