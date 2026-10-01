import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { ShipmentFilters } from "@/components/features/shipments/shipment-filters";
import { ShipmentTable } from "@/components/features/shipments/shipment-table";
import { TableSkeleton } from "@/components/shared/skeletons";
import { serverFetch } from "@/lib/api/server";
import { parsePage } from "@/lib/api/queries";
import type { Paginated, ShipmentListItem } from "@/lib/types";

export const metadata: Metadata = { title: "My deliveries" };

async function DeliveriesList({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const { page, limit } = parsePage(sp);
  const data = await serverFetch<Paginated<ShipmentListItem>>("/shipments/my-assigned", { query: { page, limit } });
  return <ShipmentTable items={data.items} meta={data.meta} baseHref="/provider/shipments" showParty="customer" emptyTitle="No deliveries assigned" emptyDescription="New delivery jobs assigned to you will show up here." />;
}

export default function ProviderDeliveriesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return (
    <div>
      <PageHeader title="My deliveries" description="Shipments currently assigned to you." />
      <div className="mb-4">
        <ShipmentFilters showSort={false} />
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <DeliveriesList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
