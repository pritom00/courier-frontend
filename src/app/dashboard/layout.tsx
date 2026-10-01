import { requireRole } from "@/lib/auth/session";
import { getMe } from "@/lib/api/queries";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole("CUSTOMER");
  const user = await getMe();
  return (
    <DashboardShell role={session.role} profileHref="/dashboard/profile" user={user}>
      {children}
    </DashboardShell>
  );
}
