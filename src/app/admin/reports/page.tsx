import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { FilterSelect } from "@/components/shared/filter-select";
import { AuditLogTable } from "@/components/features/admin/audit-log-table";
import { TableSkeleton } from "@/components/shared/skeletons";
import { getAuditLogs, parsePage } from "@/lib/api/queries";
import { AUDIT_ENTITY_TYPES } from "@/lib/constants";

export const metadata: Metadata = { title: "Audit logs" };

async function LogsList({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const { page, limit } = parsePage(sp);
  const entityType = Array.isArray(sp.entityType) ? sp.entityType[0] : sp.entityType;
  const { items, meta } = await getAuditLogs({ page, limit, entityType: entityType || undefined });
  return <AuditLogTable logs={items} meta={meta} />;
}

export default function AdminReportsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return (
    <div>
      <PageHeader title="Audit logs" description="A record of critical actions across the platform." />
      <div className="mb-4">
        <FilterSelect param="entityType" label="Filter by entity" allLabel="All entities" className="w-full sm:w-48" options={AUDIT_ENTITY_TYPES.map((t) => ({ value: t, label: t }))} />
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <LogsList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
