import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { ShipmentFilters } from "@/components/features/shipments/shipment-filters";
import { ShipmentTable } from "@/components/features/shipments/shipment-table";
import { TableSkeleton } from "@/components/shared/skeletons";
import { getShipments, parseShipmentQuery } from "@/lib/api/queries";

export const metadata: Metadata = { title: "Manage shipments" };

async function ShipmentsList({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const raw = parseShipmentQuery(sp);
  const sortParam = Array.isArray(sp.sort) ? sp.sort[0] : sp.sort;
  const [sortBy, sortOrder] = sortParam ? sortParam.split(":") : [undefined, undefined];
  const { items, meta } = await getShipments({ ...raw, sortBy: sortBy || raw.sortBy, sortOrder: sortOrder || raw.sortOrder });
  return <ShipmentTable items={items} meta={meta} baseHref="/admin/shipments" showParty="customer" />;
}

export default function AdminManagePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return (
    <div>
      <PageHeader title="Manage shipments" description="All shipments across the platform, filterable and sortable." />
      <div className="mb-4">
        <ShipmentFilters />
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <ShipmentsList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
