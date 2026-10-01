import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PRICING } from "@/lib/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
export const formatCurrency = (n: number) => currency.format(n);

// Fixed time zone so server- and client-rendered dates always match (no hydration drift).
const TZ = "Asia/Dhaka";
const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: TZ });
const dateTimeFmt = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
  timeZone: TZ,
});
export const formatDate = (iso: string) => dateFmt.format(new Date(iso));
export const formatDateTime = (iso: string) => dateTimeFmt.format(new Date(iso));

export const shortId = (id: string) => id.slice(0, 8);

export function estimatePrice(weightKg: number, fragile: boolean) {
  if (!Number.isFinite(weightKg) || weightKg <= 0) return 0;
  const p = PRICING.base + weightKg * PRICING.perKg + (fragile ? PRICING.fragile : 0);
  return Math.round(p * 100) / 100;
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

/** Only allow same-origin relative redirect targets. */
export function safeNext(next: string | null | undefined, fallback: string) {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}

export function toCsv(rows: (string | number | null)[][]) {
  return rows
    .map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\n");
}
