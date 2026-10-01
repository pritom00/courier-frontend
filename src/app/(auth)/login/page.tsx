import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/features/auth/login-form";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <Suspense fallback={<Loader2 className="mx-auto size-8 animate-spin text-primary" />}>
      <LoginForm />
    </Suspense>
  );
}
