import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { ProfileForm } from "@/components/features/profile/profile-form";
import { getMe } from "@/lib/api/queries";

export const metadata: Metadata = { title: "Profile" };

export default async function AdminProfilePage() {
  const user = await getMe();
  return (
    <div>
      <PageHeader title="Profile" description="Manage your admin account details." />
      <ProfileForm user={user} />
    </div>
  );
}
