import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { PackagePlus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ShipmentFilters } from "@/components/features/shipments/shipment-filters";
import { ShipmentTable } from "@/components/features/shipments/shipment-table";
import { TableSkeleton } from "@/components/shared/skeletons";
import { Button } from "@/components/ui/button";
import { getShipments, parseShipmentQuery } from "@/lib/api/queries";

export const metadata: Metadata = { title: "My shipments" };

async function ShipmentsList({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const raw = parseShipmentQuery(sp);
  const sortParam = Array.isArray(sp.sort) ? sp.sort[0] : sp.sort;
  const [sortBy, sortOrder] = sortParam ? sortParam.split(":") : [undefined, undefined];
  const { items, meta } = await getShipments({ ...raw, sortBy: sortBy || raw.sortBy, sortOrder: sortOrder || raw.sortOrder });
  return <ShipmentTable items={items} meta={meta} baseHref="/dashboard/shipments" emptyTitle="No shipments yet" emptyDescription="Create your first shipment to see it here." />;
}

export default function CustomerShipmentsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return (
    <div>
      <PageHeader
        title="My shipments"
        description="Track every parcel you've sent, from booking to delivery."
        actions={
          <Button asChild>
            <Link href="/dashboard/shipments/new">
              <PackagePlus /> New shipment
            </Link>
          </Button>
        }
      />
      <div className="mb-4">
        <ShipmentFilters />
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <ShipmentsList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
