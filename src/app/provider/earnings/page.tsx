import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckCircle2, Clock, Package, Wallet } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatsSkeleton } from "@/components/shared/skeletons";
import { serverFetch } from "@/lib/api/server";
import { formatCurrency } from "@/lib/utils";
import type { Paginated, ShipmentListItem } from "@/lib/types";
import { isFinalStatus } from "@/lib/constants";

export const metadata: Metadata = { title: "Performance" };

async function EarningsSummary() {
  const data = await serverFetch<Paginated<ShipmentListItem>>("/shipments/my-assigned", { query: { page: 1, limit: 100 } });
  const delivered = data.items.filter((s) => s.status === "DELIVERED");
  const active = data.items.filter((s) => !isFinalStatus(s.status));
  const earnings = delivered.reduce((sum, s) => sum + s.price * 0.15, 0); // illustrative 15% courier commission

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total assigned" value={data.meta.total} icon={Package} />
      <StatCard label="In progress" value={active.length} icon={Clock} />
      <StatCard label="Delivered" value={delivered.length} icon={CheckCircle2} />
      <StatCard label="Est. earnings" value={formatCurrency(earnings)} hint="15% of delivered shipment value" icon={Wallet} />
    </div>
  );
}

export default function EarningsPage() {
  return (
    <div>
      <PageHeader title="Performance" description="Your delivery activity and estimated earnings." />
      <Suspense fallback={<StatsSkeleton />}>
        <EarningsSummary />
      </Suspense>
    </div>
  );
}
