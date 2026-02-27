# WarehouseIQ

Intelligent warehouse inventory management system with real-time tracking, spatial mapping, smart alerts, and barcode scanning.

**Live Demo**: [Deploy to Vercel to get a live link]

## Features

- **Real-Time Dashboard** — KPI cards, activity feed, inventory trends with live simulation mode that generates real stock movements with toast notifications and sound effects
- **Spatial Warehouse Map** — Interactive 2D grid with fill level, heatmap, and zone views. Zone labels, click-to-inspect bins, and a **Drone Scan** simulation that animates a drone traversing all bins and finding inventory discrepancies
- **Barcode Scanner** — Camera or manual entry with receive/pick workflows, audio feedback (beep on success, buzz on error), and toast confirmations
- **Smart Alerts** — Configurable rules with severity levels, real-time toast notifications, and acknowledgment workflow (open → acknowledged → resolved)
- **Inventory Management** — Searchable, filterable, sortable table with stock level bars, pagination, and product detail pages with movement history charts
- **Analytics** — Stock value trends, daily movements, stock status donut, movement type breakdown, zone utilization, top products, value by category
- **Command Palette** — Ctrl+K to search pages, products, and actions with keyboard navigation
- **Keyboard Shortcuts** — D (Dashboard), I (Inventory), M (Map), S (Scanner), A (Alerts), [ (Toggle Sidebar)
- **Loading Skeletons** — Smooth page transitions with animated skeleton states
- **Toast Notifications** — Contextual feedback on every action with slide-in animations

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript, React 18 |
| Styling | Tailwind CSS, shadcn/ui components, dark mode |
| Database | Supabase (PostgreSQL) with real-time subscriptions |
| Charts | Recharts |
| State | Zustand |
| Deploy | Vercel + Supabase (both free tier) |

## Database

17 tables with triggers, views, composite indexes, full-text search, and row-level security:

`warehouses` → `zones` → `aisles` → `racks` → `bin_locations` → `inventory_items` ← `products` ← `product_categories`

Plus: `stock_movements`, `inventory_snapshots`, `cycle_counts`, `cycle_count_items`, `alert_rules`, `alerts`, `scan_sessions`, `scan_entries`, `users`

Key DB features:
- **Triggers**: auto-update inventory on stock movement, auto-generate low stock alerts, auto-increment scan counts
- **Views**: `v_inventory_overview` (joined product + location + quantity), `v_zone_utilization` (capacity %)
- **Indexes**: composite on (warehouse_id, product_id), GIN for full-text product search, covering indexes on movements
- **RLS**: row-level security policies enabled on core tables

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project (free at [supabase.com](https://supabase.com))

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy env template
cp .env.local.example .env.local

# 3. Add your Supabase credentials to .env.local
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# 4. Run the SQL migrations in your Supabase dashboard
#    SQL Editor → paste supabase/migrations/001_schema.sql → Run
#    SQL Editor → paste supabase/migrations/002_seed.sql → Run

# 5. Start dev server
npm run dev
```

The app works in **demo mode** without Supabase — it uses mock data with the same schema shape, so all features are functional locally.

### Deploy to Vercel

```bash
# Push to GitHub, then:
# 1. Import repo at vercel.com/new
# 2. Add environment variables (Supabase URL + Anon Key)
# 3. Deploy
```

## Project Structure

```
corvus-warehouse/
├── src/
│   ├── app/
│   │   ├── (app)/              # All app pages (wrapped in sidebar layout)
│   │   │   ├── dashboard/      # KPI cards, charts, activity feed
│   │   │   ├── inventory/      # Inventory table + product detail
│   │   │   ├── warehouse/map/  # Spatial warehouse grid
│   │   │   ├── scan/           # Barcode scanner
│   │   │   ├── alerts/         # Alerts + alert rules config
│   │   │   ├── movements/      # Stock movement log
│   │   │   ├── analytics/      # Charts and reports
│   │   │   └── settings/       # Connection & app settings
│   │   ├── globals.css
│   │   ├── layout.tsx          # Root layout (dark mode, fonts)
│   │   └── page.tsx            # Redirects to /dashboard
│   ├── components/
│   │   ├── ui/                 # Reusable UI primitives (button, card, badge, etc.)
│   │   ├── layout/             # Sidebar, header, app shell
│   │   └── dashboard/          # Dashboard-specific components
│   ├── lib/
│   │   ├── supabase/           # Supabase client + server helpers
│   │   ├── hooks/              # Real-time subscription hooks
│   │   ├── mock-data.ts        # Demo data (mirrors Supabase schema)
│   │   ├── store.ts            # Zustand state management
│   │   └── utils.ts            # Utility functions
│   └── types/
│       └── database.ts         # Full TypeScript types for all 17 tables
├── supabase/
│   └── migrations/
│       ├── 001_schema.sql      # Full schema: tables, triggers, views, RLS
│       └── 002_seed.sql        # Seed data: 264 bins, 50 products, 500+ movements
├── tailwind.config.ts
├── next.config.js
└── package.json
```

## License

MIT
