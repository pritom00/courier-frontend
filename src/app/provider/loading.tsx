import { HeaderSkeleton, TableSkeleton } from "@/components/shared/skeletons";

export default function DashboardLoading() {
  return (
    <div>
      <HeaderSkeleton />
      <TableSkeleton />
    </div>
  );
}
