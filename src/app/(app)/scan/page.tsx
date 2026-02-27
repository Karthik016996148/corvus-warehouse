"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Camera,
  Keyboard,
  Package,
  MapPin,
  Check,
  X,
  ArrowDownToLine,
  ArrowUpFromLine,
  ScanBarcode,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import { getProductByBarcode, mockProducts, mockBins } from "@/lib/mock-data";
import { useToast } from "@/components/ui/toast";
import { useScanSound } from "@/lib/hooks/use-sound";

type ScanMode = "receive" | "pick";

interface ScanResult {
  barcode: string;
  productName: string | null;
  status: "success" | "not_found";
  quantity: number;
  timestamp: Date;
  mode: ScanMode;
}

export default function ScanPage() {
  const [mode, setMode] = useState<ScanMode>("receive");
  const [inputMode, setInputMode] = useState<"camera" | "manual">("manual");
  const [barcode, setBarcode] = useState("");
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [foundProduct, setFoundProduct] = useState<ReturnType<typeof getProductByBarcode> | null>(null);
  const [quantity, setQuantity] = useState("1");
  const [selectedBin, setSelectedBin] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { playSuccess, playError } = useScanSound();

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch {
      setInputMode("manual");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((t) => t.stop());
      setCameraActive(false);
    }
  }, []);

  useEffect(() => {
    if (inputMode === "camera") {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [inputMode, startCamera, stopCamera]);

  function handleScan() {
    if (!barcode.trim()) return;
    const product = getProductByBarcode(barcode.trim());
    setFoundProduct(product || null);

    if (!product) {
      playError();
      toast({ type: "error", title: "Barcode Not Found", message: `No product matches barcode ${barcode.trim()}` });
      setScanResults((prev) => [
        {
          barcode: barcode.trim(),
          productName: null,
          status: "not_found",
          quantity: 0,
          timestamp: new Date(),
          mode,
        },
        ...prev,
      ]);
      setBarcode("");
    } else {
      playSuccess();
    }
  }

  function confirmAction() {
    if (!foundProduct) return;

    const qty = parseInt(quantity) || 1;
    playSuccess();
    toast({
      type: mode,
      title: `${mode === "receive" ? "Received" : "Picked"}: ${foundProduct.name}`,
      message: `${qty} unit${qty > 1 ? "s" : ""} ${mode === "receive" ? "added to" : "removed from"} inventory`,
    });

    setScanResults((prev) => [
      {
        barcode: foundProduct.barcode,
        productName: foundProduct.name,
        status: "success",
        quantity: qty,
        timestamp: new Date(),
        mode,
      },
      ...prev,
    ]);

    setFoundProduct(null);
    setBarcode("");
    setQuantity("1");
    setSelectedBin("");
    inputRef.current?.focus();
  }

  const sessionStats = {
    total: scanResults.length,
    success: scanResults.filter((r) => r.status === "success").length,
    notFound: scanResults.filter((r) => r.status === "not_found").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex rounded-lg border p-1">
          <Button
            variant={mode === "receive" ? "default" : "ghost"}
            size="sm"
            onClick={() => setMode("receive")}
          >
            <ArrowDownToLine className="mr-1.5 h-3.5 w-3.5" />
            Receive
          </Button>
          <Button
            variant={mode === "pick" ? "default" : "ghost"}
            size="sm"
            onClick={() => setMode("pick")}
          >
            <ArrowUpFromLine className="mr-1.5 h-3.5 w-3.5" />
            Pick
          </Button>
        </div>
        <div className="flex rounded-lg border p-1">
          <Button
            variant={inputMode === "manual" ? "default" : "ghost"}
            size="sm"
            onClick={() => setInputMode("manual")}
          >
            <Keyboard className="mr-1.5 h-3.5 w-3.5" />
            Manual
          </Button>
          <Button
            variant={inputMode === "camera" ? "default" : "ghost"}
            size="sm"
            onClick={() => setInputMode("camera")}
          >
            <Camera className="mr-1.5 h-3.5 w-3.5" />
            Camera
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          {inputMode === "camera" && (
            <Card>
              <CardContent className="p-4">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {!cameraActive && (
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      <div className="text-center">
                        <Camera className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm opacity-70">Camera initializing...</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-48 h-32 border-2 border-white/50 rounded-lg" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Position barcode within the frame. Using manual entry as camera
                  scanning requires a secure context (HTTPS).
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <ScanBarcode className="h-4 w-4" />
                {mode === "receive" ? "Scan to Receive" : "Scan to Pick"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  placeholder="Enter or scan barcode (e.g. WH100000001)..."
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleScan()}
                  autoFocus
                  className="font-mono"
                />
                <Button onClick={handleScan}>Scan</Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <p className="text-xs text-muted-foreground w-full">
                  Try these sample barcodes:
                </p>
                {mockProducts.slice(0, 6).map((p) => (
                  <button
                    key={p.barcode}
                    onClick={() => {
                      setBarcode(p.barcode);
                      const product = getProductByBarcode(p.barcode);
                      setFoundProduct(product || null);
                    }}
                    className="text-xs font-mono px-2 py-1 rounded border hover:bg-muted/50 transition-colors"
                  >
                    {p.barcode}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {foundProduct && (
            <Card className="border-primary/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  Product Found
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name</span>
                    <span className="font-medium">{foundProduct.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SKU</span>
                    <span className="font-mono">{foundProduct.sku}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Unit Price</span>
                    <span>{formatCurrency(foundProduct.unit_price)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />{" "}
                    {mode === "receive" ? "Destination Bin" : "Pick from Bin"}
                  </label>
                  <select
                    value={selectedBin}
                    onChange={(e) => setSelectedBin(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select bin location...</option>
                    {mockBins.slice(0, 20).map((bin) => (
                      <option key={bin.id} value={bin.id}>
                        {bin.label} ({bin.quantity}/{bin.maxCapacity})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">
                    Quantity
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={confirmAction} className="flex-1">
                    <Check className="mr-1.5 h-4 w-4" />
                    Confirm {mode === "receive" ? "Receive" : "Pick"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFoundProduct(null);
                      setBarcode("");
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">
                Session Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">{sessionStats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Scans</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-500">
                    {sessionStats.success}
                  </p>
                  <p className="text-xs text-muted-foreground">Successful</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-500">
                    {sessionStats.notFound}
                  </p>
                  <p className="text-xs text-muted-foreground">Not Found</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <History className="h-3.5 w-3.5" />
                Scan History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {scanResults.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No scans yet. Enter a barcode to start.
                </p>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {scanResults.map((result, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "flex items-center justify-between rounded-md p-2 text-sm",
                        result.status === "success"
                          ? "bg-emerald-500/5"
                          : "bg-red-500/5"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {result.status === "success" ? (
                          <Check className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                        <div>
                          <p className="font-medium">
                            {result.productName || "Unknown Barcode"}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {result.barcode}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            result.mode === "receive" ? "success" : "info"
                          }
                          className="text-[10px]"
                        >
                          {result.mode}
                        </Badge>
                        {result.quantity > 0 && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            x{result.quantity}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
