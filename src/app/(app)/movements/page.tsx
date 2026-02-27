"use client";

import { useState, useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  Pencil,
  Search,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
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
import { cn } from "@/lib/utils";
import { mockMovements, mockProducts } from "@/lib/mock-data";

const typeConfig = {
  receive: { icon: ArrowDownToLine, label: "Receive", variant: "success" as const },
  pick: { icon: ArrowUpFromLine, label: "Pick", variant: "info" as const },
  transfer: { icon: ArrowLeftRight, label: "Transfer", variant: "secondary" as const },
  adjust: { icon: Pencil, label: "Adjust", variant: "warning" as const },
  cycle_count: { icon: Pencil, label: "Count", variant: "secondary" as const },
};

export default function MovementsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const filtered = useMemo(() => {
    let items = [...mockMovements];
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((m) => {
        const product = mockProducts.find((p) => p.id === m.product_id);
        return (
          product?.name.toLowerCase().includes(q) ||
          product?.sku.toLowerCase().includes(q) ||
          m.performed_by.toLowerCase().includes(q) ||
          m.reference_number?.toLowerCase().includes(q)
        );
      });
    }
    if (typeFilter) {
      items = items.filter((m) => m.movement_type === typeFilter);
    }
    return items;
  }, [search, typeFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search movements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            options={[
              { value: "", label: "All Types" },
              { value: "receive", label: "Receive" },
              { value: "pick", label: "Pick" },
              { value: "transfer", label: "Transfer" },
              { value: "adjust", label: "Adjust" },
            ]}
          />
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Performed By</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((m) => {
              const product = mockProducts.find((p) => p.id === m.product_id);
              const config = typeConfig[m.movement_type as keyof typeof typeConfig] || typeConfig.adjust;
              return (
                <TableRow key={m.id}>
                  <TableCell>
                    <Badge variant={config.variant}>{config.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">
                        {product?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {product?.sku}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold tabular-nums">
                    {m.movement_type === "pick" ? "-" : "+"}{m.quantity}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    {m.reference_number || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {m.performed_by}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(m.created_at), {
                      addSuffix: true,
                    })}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground">
        Showing {filtered.length} movements
      </p>
    </div>
  );
}
