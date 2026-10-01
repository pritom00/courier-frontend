import { requireRole } from "@/lib/auth/session";
import { getMe } from "@/lib/api/queries";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function ProviderLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole("COURIER");
  const user = await getMe();
  return (
    <DashboardShell role={session.role} profileHref="/provider/profile" user={user}>
      {children}
    </DashboardShell>
  );
}
