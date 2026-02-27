"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  Eye,
  Thermometer,
  Grid3X3,
  ZoomIn,
  ZoomOut,
  Info,
  Plane,
  Square,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { mockBins, mockZoneUtilization, type BinCell } from "@/lib/mock-data";

type ViewMode = "fill" | "heatmap" | "zones";

interface DroneState {
  running: boolean;
  currentBinIndex: number;
  scannedBins: Set<string>;
  discrepancies: { binId: string; label: string; expected: number; found: number }[];
  progress: number;
}

function getBinColor(bin: BinCell, mode: ViewMode): string {
  if (mode === "zones") return bin.zoneColor;

  const ratio = bin.quantity / bin.maxCapacity;

  if (mode === "heatmap") {
    if (ratio === 0) return "rgba(100, 116, 139, 0.2)";
    if (ratio < 0.25) return "rgba(34, 197, 94, 0.5)";
    if (ratio < 0.5) return "rgba(59, 130, 246, 0.5)";
    if (ratio < 0.75) return "rgba(249, 115, 22, 0.5)";
    return "rgba(239, 68, 68, 0.6)";
  }

  if (bin.quantity === 0) return "rgba(100, 116, 139, 0.15)";
  if (ratio < 0.2) return "rgba(239, 68, 68, 0.5)";
  if (ratio < 0.4) return "rgba(249, 115, 22, 0.5)";
  if (ratio < 0.7) return "rgba(59, 130, 246, 0.5)";
  return "rgba(34, 197, 94, 0.5)";
}

const ZONE_LABELS = [
  { label: "Zone A", subtitle: "Ambient Storage", row: 0, col: 0, color: "#3b82f6" },
  { label: "Zone B", subtitle: "Cold Storage", row: 0, col: 9, color: "#06b6d4" },
  { label: "Zone C", subtitle: "Bulk & Picking", row: 9, col: 0, color: "#8b5cf6" },
];

export default function WarehouseMapPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("fill");
  const [zoom, setZoom] = useState(1);
  const [selectedBin, setSelectedBin] = useState<BinCell | null>(null);
  const [hoveredBin, setHoveredBin] = useState<BinCell | null>(null);
  const { toast } = useToast();

  const [drone, setDrone] = useState<DroneState>({
    running: false,
    currentBinIndex: -1,
    scannedBins: new Set(),
    discrepancies: [],
    progress: 0,
  });

  const droneInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const sortedBins = useMemo(
    () => [...mockBins].sort((a, b) => a.row - b.row || a.col - b.col),
    []
  );

  const gridBounds = useMemo(() => {
    const maxRow = Math.max(...mockBins.map((b) => b.row));
    const maxCol = Math.max(...mockBins.map((b) => b.col));
    return { rows: maxRow + 1, cols: maxCol + 1 };
  }, []);

  const binMap = useMemo(() => {
    const map = new Map<string, BinCell>();
    for (const bin of mockBins) {
      map.set(`${bin.row}-${bin.col}`, bin);
    }
    return map;
  }, []);

  const startDrone = useCallback(() => {
    setDrone({
      running: true,
      currentBinIndex: 0,
      scannedBins: new Set(),
      discrepancies: [],
      progress: 0,
    });
    toast({
      type: "info",
      title: "Drone Scan Started",
      message: `Scanning ${sortedBins.length} bin locations...`,
    });
  }, [sortedBins.length, toast]);

  const stopDrone = useCallback(() => {
    if (droneInterval.current) {
      clearInterval(droneInterval.current);
      droneInterval.current = null;
    }
    setDrone((prev) => ({ ...prev, running: false, currentBinIndex: -1 }));
    toast({
      type: "warning",
      title: "Drone Scan Stopped",
      message: "Scan was cancelled by operator.",
    });
  }, [toast]);

  useEffect(() => {
    if (!drone.running) {
      if (droneInterval.current) {
        clearInterval(droneInterval.current);
        droneInterval.current = null;
      }
      return;
    }

    droneInterval.current = setInterval(() => {
      setDrone((prev) => {
        const nextIndex = prev.currentBinIndex + 1;

        if (nextIndex >= sortedBins.length) {
          if (droneInterval.current) clearInterval(droneInterval.current);
          toast({
            type: "success",
            title: "Drone Scan Complete",
            message: `Scanned ${sortedBins.length} bins. ${prev.discrepancies.length} discrepancies found.`,
            duration: 6000,
          });
          return {
            ...prev,
            running: false,
            currentBinIndex: -1,
            progress: 100,
          };
        }

        const currentBin = sortedBins[nextIndex];
        const newScanned = new Set(prev.scannedBins);
        newScanned.add(currentBin.id);

        const newDiscrepancies = [...prev.discrepancies];
        if (Math.random() < 0.06 && currentBin.quantity > 0) {
          const variance = Math.floor(Math.random() * 10) - 5;
          if (variance !== 0) {
            newDiscrepancies.push({
              binId: currentBin.id,
              label: currentBin.label,
              expected: currentBin.quantity,
              found: Math.max(0, currentBin.quantity + variance),
            });
            toast({
              type: "warning",
              title: `Discrepancy at ${currentBin.label}`,
              message: `Expected ${currentBin.quantity}, found ${Math.max(0, currentBin.quantity + variance)}`,
            });
          }
        }

        return {
          ...prev,
          currentBinIndex: nextIndex,
          scannedBins: newScanned,
          discrepancies: newDiscrepancies,
          progress: Math.round((nextIndex / sortedBins.length) * 100),
        };
      });
    }, 120);

    return () => {
      if (droneInterval.current) {
        clearInterval(droneInterval.current);
        droneInterval.current = null;
      }
    };
  }, [drone.running, sortedBins, toast]);

  const currentDroneBin =
    drone.running && drone.currentBinIndex >= 0
      ? sortedBins[drone.currentBinIndex]
      : null;

  const cellSize = 36 * zoom;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "fill" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("fill")}
          >
            <Grid3X3 className="mr-1.5 h-3.5 w-3.5" />
            Fill Level
          </Button>
          <Button
            variant={viewMode === "heatmap" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("heatmap")}
          >
            <Thermometer className="mr-1.5 h-3.5 w-3.5" />
            Heatmap
          </Button>
          <Button
            variant={viewMode === "zones" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("zones")}
          >
            <Eye className="mr-1.5 h-3.5 w-3.5" />
            Zones
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          {!drone.running ? (
            <Button size="sm" variant="outline" onClick={startDrone} className="border-primary/50 text-primary hover:bg-primary/10">
              <Plane className="mr-1.5 h-3.5 w-3.5" />
              Drone Scan
            </Button>
          ) : (
            <Button size="sm" variant="destructive" onClick={stopDrone}>
              <Square className="mr-1.5 h-3 w-3" />
              Stop Drone
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {drone.running && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Plane className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium">Drone Scanning...</span>
              {currentDroneBin && (
                <span className="text-xs text-muted-foreground font-mono">
                  @ {currentDroneBin.label}
                </span>
              )}
            </div>
            <span className="text-sm font-semibold text-primary">{drone.progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-100"
              style={{ width: `${drone.progress}%` }}
            />
          </div>
          <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
            <span>{drone.scannedBins.size} bins scanned</span>
            {drone.discrepancies.length > 0 && (
              <span className="text-orange-500">
                {drone.discrepancies.length} discrepancies
              </span>
            )}
          </div>
        </div>
      )}

      {!drone.running && drone.discrepancies.length > 0 && drone.progress === 100 && (
        <Card className="border-orange-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-orange-500">
              <AlertTriangle className="h-4 w-4" />
              Drone Scan Report — {drone.discrepancies.length} Discrepancies Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5 max-h-[150px] overflow-y-auto">
              {drone.discrepancies.map((d, i) => (
                <div key={i} className="flex items-center justify-between text-sm rounded-md p-1.5 bg-orange-500/5">
                  <span className="font-mono text-xs">{d.label}</span>
                  <span>
                    Expected <span className="font-semibold">{d.expected}</span>
                    {" → "}Found <span className="font-semibold text-orange-500">{d.found}</span>
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-4 overflow-auto">
              <div className="relative inline-block">
                {/* Zone labels */}
                {ZONE_LABELS.map((z) => (
                  <div
                    key={z.label}
                    className="absolute z-10 pointer-events-none"
                    style={{
                      top: z.row * (cellSize + 2) - 2,
                      left: z.col * (cellSize + 2),
                    }}
                  >
                    <div className="flex items-center gap-1.5 -translate-y-full pb-1">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: z.color }} />
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: z.color }}>
                        {z.label}
                      </span>
                      <span className="text-[9px] text-muted-foreground/60">{z.subtitle}</span>
                    </div>
                  </div>
                ))}

                <div
                  className="inline-grid gap-[2px]"
                  style={{
                    gridTemplateColumns: `repeat(${gridBounds.cols}, ${cellSize}px)`,
                    gridTemplateRows: `repeat(${gridBounds.rows}, ${cellSize}px)`,
                    marginTop: "20px",
                  }}
                >
                  {Array.from({ length: gridBounds.rows }, (_, r) =>
                    Array.from({ length: gridBounds.cols }, (_, c) => {
                      const bin = binMap.get(`${r}-${c}`);
                      if (!bin) {
                        return (
                          <div
                            key={`${r}-${c}`}
                            className="rounded-sm bg-transparent"
                          />
                        );
                      }
                      const isSelected = selectedBin?.id === bin.id;
                      const isHovered = hoveredBin?.id === bin.id;
                      const isDroneAt = currentDroneBin?.id === bin.id;
                      const isScanned = drone.scannedBins.has(bin.id);
                      const hasDiscrepancy = drone.discrepancies.some((d) => d.binId === bin.id);

                      return (
                        <div
                          key={bin.id}
                          className={cn(
                            "rounded-sm cursor-pointer transition-all duration-100 border relative",
                            isSelected
                              ? "border-white ring-2 ring-white/50"
                              : isDroneAt
                                ? "border-primary ring-2 ring-primary/60"
                                : hasDiscrepancy
                                  ? "border-orange-500 ring-1 ring-orange-500/50"
                                  : isHovered
                                    ? "border-white/40"
                                    : "border-transparent"
                          )}
                          style={{
                            backgroundColor: getBinColor(bin, viewMode),
                            opacity: drone.running && isScanned && !isDroneAt ? 0.4 : 1,
                          }}
                          onClick={() => setSelectedBin(bin)}
                          onMouseEnter={() => setHoveredBin(bin)}
                          onMouseLeave={() => setHoveredBin(null)}
                          title={`${bin.label}: ${bin.quantity}/${bin.maxCapacity}`}
                        >
                          {isDroneAt && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="h-3 w-3 rounded-full bg-primary animate-ping" />
                              <Plane className="absolute h-3 w-3 text-primary-foreground drop-shadow-lg" />
                            </div>
                          )}
                          {hasDiscrepancy && !isDroneAt && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <AlertTriangle className="h-3 w-3 text-orange-500" />
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                {viewMode === "fill" && (
                  <>
                    <span className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: "rgba(100, 116, 139, 0.15)" }} /> Empty
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: "rgba(239, 68, 68, 0.5)" }} /> Critical
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: "rgba(249, 115, 22, 0.5)" }} /> Low
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: "rgba(59, 130, 246, 0.5)" }} /> Normal
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: "rgba(34, 197, 94, 0.5)" }} /> Full
                    </span>
                  </>
                )}
                {viewMode === "zones" && ZONE_LABELS.map((z) => (
                  <span key={z.label} className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: z.color }} /> {z.label} ({z.subtitle})
                  </span>
                ))}
                {viewMode === "heatmap" && (
                  <>
                    <span className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: "rgba(34, 197, 94, 0.5)" }} /> Low Activity
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: "rgba(239, 68, 68, 0.6)" }} /> High Activity
                    </span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {(selectedBin || hoveredBin) && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Info className="h-3.5 w-3.5" />
                  Bin Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {(() => {
                  const bin = selectedBin || hoveredBin!;
                  const percent = Math.round((bin.quantity / bin.maxCapacity) * 100);
                  return (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location</span>
                        <span className="font-mono font-medium">{bin.label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Zone</span>
                        <span>{bin.zone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Quantity</span>
                        <span className="font-semibold">
                          {bin.quantity} / {bin.maxCapacity}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            percent === 0 ? "bg-gray-500" :
                            percent < 25 ? "bg-red-500" :
                            percent < 50 ? "bg-orange-500" :
                            percent < 75 ? "bg-blue-500" : "bg-emerald-500"
                          )}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      {bin.productName && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Product</span>
                          <span>{bin.productName}</span>
                        </div>
                      )}
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">
                Zone Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockZoneUtilization.map((zone) => (
                <div key={zone.zone_id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>{zone.zone_name.split(" - ")[0]}</span>
                    <span className="font-medium">{zone.utilization_percent}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        zone.utilization_percent >= 90 ? "bg-red-500" :
                        zone.utilization_percent >= 70 ? "bg-orange-500" : "bg-blue-500"
                      )}
                      style={{ width: `${zone.utilization_percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">
                Map Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Bins</span>
                <span className="font-semibold">{mockBins.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Occupied</span>
                <span className="font-semibold">
                  {mockBins.filter((b) => b.quantity > 0).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Empty</span>
                <span className="font-semibold">
                  {mockBins.filter((b) => b.quantity === 0).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Critical</span>
                <Badge variant="critical" className="text-xs">
                  {mockBins.filter((b) => b.quantity > 0 && b.quantity / b.maxCapacity < 0.2).length}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
