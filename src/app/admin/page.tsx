import type { Metadata } from "next";
import { Suspense } from "react";
import { DollarSign, Package, Truck, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatsSkeleton, ChartsSkeleton } from "@/components/shared/skeletons";
import { ChartsClient } from "@/app/admin/charts-client";
import { getDashboardStats } from "@/lib/api/queries";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = { title: "Overview" };

async function Stats() {
  const stats = await getDashboardStats();
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total shipments" value={stats.totalShipments} icon={Package} />
      <StatCard label="Total users" value={stats.totalUsers} icon={Users} />
      <StatCard label="Active couriers" value={stats.activeCouriers} icon={Truck} />
      <StatCard label="Total revenue" value={formatCurrency(stats.totalRevenue)} hint={stats.cached ? "Cached (Redis)" : "Live"} icon={DollarSign} />
    </div>
  );
}

async function Charts() {
  const stats = await getDashboardStats();
  return <ChartsClient shipmentsByStatus={stats.shipmentsByStatus} totalRevenue={stats.totalRevenue} totalShipments={stats.totalShipments} activeCouriers={stats.activeCouriers} />;
}

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Overview" description="Real-time snapshot of platform activity." />
      <Suspense fallback={<StatsSkeleton />}>
        <Stats />
      </Suspense>
      <Suspense fallback={<ChartsSkeleton />}>
        <Charts />
      </Suspense>
    </div>
  );
}
