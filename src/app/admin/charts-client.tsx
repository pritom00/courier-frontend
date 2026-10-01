"use client";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import type { ShipmentStatus } from "@/lib/types";

// recharts bundles its own react-is (pinned to 18.x), which breaks Next's
// server-side page-data collection under React 19. Loading it client-only
// avoids that server evaluation entirely - the charts render only in the browser.
const StatusChart = dynamic(() => import("@/components/features/admin/status-chart").then((m) => m.StatusChart), {
  ssr: false,
  loading: () => <Skeleton className="h-80 w-full" />,
});
const RevenueSummary = dynamic(() => import("@/components/features/admin/revenue-summary").then((m) => m.RevenueSummary), {
  ssr: false,
  loading: () => <Skeleton className="h-80 w-full" />,
});

export function ChartsClient({
  shipmentsByStatus,
  totalRevenue,
  totalShipments,
  activeCouriers,
}: {
  shipmentsByStatus: { status: ShipmentStatus; count: number }[];
  totalRevenue: number;
  totalShipments: number;
  activeCouriers: number;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <StatusChart data={shipmentsByStatus} />
      <RevenueSummary totalRevenue={totalRevenue} totalShipments={totalShipments} activeCouriers={activeCouriers} />
    </div>
  );
}
