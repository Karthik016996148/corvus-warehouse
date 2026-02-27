"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { cn, formatCurrency } from "@/lib/utils";
import { mockInventoryOverview, mockCategories } from "@/lib/mock-data";

type SortField = "product_name" | "sku" | "total_quantity" | "total_value";
type SortDir = "asc" | "desc";

const ITEMS_PER_PAGE = 12;

const statusConfig: Record<
  string,
  { label: string; variant: "success" | "warning" | "critical" | "info" | "secondary" }
> = {
  normal: { label: "Normal", variant: "success" },
  low: { label: "Low", variant: "warning" },
  critical: { label: "Critical", variant: "critical" },
  overstock: { label: "Overstock", variant: "info" },
  out_of_stock: { label: "Out of Stock", variant: "secondary" },
};

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortField, setSortField] = useState<SortField>("product_name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let items = [...mockInventoryOverview];

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (i) =>
          i.product_name.toLowerCase().includes(q) ||
          i.sku.toLowerCase().includes(q)
      );
    }

    if (categoryFilter) {
      items = items.filter((i) => i.category_name === categoryFilter);
    }

    if (statusFilter) {
      items = items.filter((i) => i.stock_status === statusFilter);
    }

    items.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const cmp =
        typeof aVal === "string"
          ? aVal.localeCompare(bVal as string)
          : (aVal as number) - (bVal as number);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return items;
  }, [search, categoryFilter, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            options={[
              { value: "", label: "All Categories" },
              ...mockCategories.map((c) => ({
                value: c.name,
                label: c.name,
              })),
            ]}
          />
          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            options={[
              { value: "", label: "All Statuses" },
              { value: "normal", label: "Normal" },
              { value: "low", label: "Low" },
              { value: "critical", label: "Critical" },
              { value: "overstock", label: "Overstock" },
              { value: "out_of_stock", label: "Out of Stock" },
            ]}
          />
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <button
                  onClick={() => toggleSort("product_name")}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  Product
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => toggleSort("sku")}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  SKU
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead>
                <button
                  onClick={() => toggleSort("total_quantity")}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  Qty
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead>Locations</TableHead>
              <TableHead>
                <button
                  onClick={() => toggleSort("total_value")}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  Value
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((item) => {
              const status = statusConfig[item.stock_status] || statusConfig.normal;
              return (
                <TableRow key={item.product_id}>
                  <TableCell className="font-medium">
                    {item.product_name}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {item.sku}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.category_name}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold tabular-nums">
                        {item.total_quantity.toLocaleString()}
                      </span>
                      <div className="h-1.5 w-16 rounded-full bg-muted">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            item.stock_status === "critical"
                              ? "bg-red-500"
                              : item.stock_status === "low"
                                ? "bg-orange-500"
                                : item.stock_status === "overstock"
                                  ? "bg-blue-500"
                                  : "bg-emerald-500"
                          )}
                          style={{
                            width: `${Math.min(100, (item.total_quantity / item.max_stock_level) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.total_locations}
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {formatCurrency(item.total_value)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/inventory/${item.product_id}`}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {(page - 1) * ITEMS_PER_PAGE + 1}-
          {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of{" "}
          {filtered.length} products
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span>
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
