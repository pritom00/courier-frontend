import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { FilterSelect } from "@/components/shared/filter-select";
import { UsersTable } from "@/components/features/admin/users-table";
import { TableSkeleton } from "@/components/shared/skeletons";
import { getUsers, parsePage } from "@/lib/api/queries";
import { getSession } from "@/lib/auth/session";
import { ROLE_LABEL } from "@/lib/constants";

export const metadata: Metadata = { title: "Manage users" };

async function UsersList({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const { page, limit } = parsePage(sp);
  const role = Array.isArray(sp.role) ? sp.role[0] : sp.role;
  const q = Array.isArray(sp.q) ? sp.q[0] : sp.q;
  const [{ items, meta }, session] = await Promise.all([getUsers({ page, limit, role: role || undefined, q: q || undefined }), getSession()]);
  return <UsersTable users={items} meta={meta} currentUserId={session?.userId ?? ""} />;
}

export default function AdminUsersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return (
    <div>
      <PageHeader title="Manage users" description="View every account and adjust roles as needed." />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <SearchInput param="q" placeholder="Search by name or email…" label="Search users" />
        <FilterSelect
          param="role"
          label="Filter by role"
          allLabel="All roles"
          className="w-full sm:w-48"
          options={(Object.keys(ROLE_LABEL) as (keyof typeof ROLE_LABEL)[]).map((r) => ({ value: r, label: ROLE_LABEL[r] }))}
        />
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <UsersList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
