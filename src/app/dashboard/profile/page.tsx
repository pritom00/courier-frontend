import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { ProfileForm } from "@/components/features/profile/profile-form";
import { getMe } from "@/lib/api/queries";

export const metadata: Metadata = { title: "Profile & settings" };

export default async function CustomerProfilePage() {
  const user = await getMe();
  return (
    <div>
      <PageHeader title="Profile & settings" description="Manage your personal information." />
      <ProfileForm user={user} />
    </div>
  );
}
