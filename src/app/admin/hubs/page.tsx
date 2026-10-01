import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { HubList } from "@/components/features/hubs/hub-list";
import { TableSkeleton } from "@/components/shared/skeletons";
import { getHubs, parsePage } from "@/lib/api/queries";

export const metadata: Metadata = { title: "Manage hubs" };

async function HubsList({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const { page, limit } = parsePage(sp);
  const { items, meta } = await getHubs({ page, limit });
  return <HubList hubs={items} meta={meta} />;
}

export default function AdminHubsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return (
    <div>
      <PageHeader title="Manage hubs" description="Sorting and transit hubs used for routing shipments." />
      <Suspense fallback={<TableSkeleton />}>
        <HubsList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
