import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { ProfileForm } from "@/components/features/profile/profile-form";
import { getMe } from "@/lib/api/queries";

export const metadata: Metadata = { title: "Profile & availability" };

export default async function ProviderProfilePage() {
  const user = await getMe();
  return (
    <div>
      <PageHeader title="Profile & availability" description="Keep your contact details up to date." />
      <ProfileForm user={user} />
    </div>
  );
}
