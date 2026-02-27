import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function getStockLevelColor(
  current: number,
  min: number,
  max: number
): string {
  const ratio = current / max;
  if (current <= 0) return "bg-gray-800";
  if (current <= min) return "bg-red-500/80";
  if (ratio < 0.3) return "bg-orange-500/80";
  if (ratio < 0.7) return "bg-blue-500/80";
  return "bg-emerald-500/80";
}

export function getStockLevelLabel(
  current: number,
  min: number,
  max: number
): string {
  if (current <= 0) return "Empty";
  if (current <= min) return "Critical";
  if (current / max < 0.3) return "Low";
  if (current / max < 0.7) return "Normal";
  return "Full";
}

export function generateBarcode(): string {
  const prefix = "WH";
  const num = Math.floor(Math.random() * 1_000_000_000)
    .toString()
    .padStart(9, "0");
  return `${prefix}${num}`;
}
