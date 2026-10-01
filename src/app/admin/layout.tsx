import { requireRole } from "@/lib/auth/session";
import { getMe } from "@/lib/api/queries";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole("ADMIN");
  const user = await getMe();
  return (
    <DashboardShell role={session.role} profileHref="/admin/profile" user={user}>
      {children}
    </DashboardShell>
  );
}
