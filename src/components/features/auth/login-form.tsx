"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DEMO_ACCOUNTS } from "@/lib/constants";
import { errorMessage } from "@/lib/api/errors";
import { loginSchema, type LoginValues } from "@/lib/validators";
import { safeNext } from "@/lib/utils";
import type { Role } from "@/lib/types";

const ROLE_ICON: Record<Role, string> = { ADMIN: "👨‍💼", CUSTOMER: "👤", COURIER: "🛠️" };

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"), "/dashboard");
  const expired = params.get("reason") === "expired";
  const [isPending, startTransition] = useTransition();
  const [demoLoading, setDemoLoading] = useState<Role | null>(null);

  const form = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });

  async function submit(values: LoginValues, redirectOverride?: string) {
    try {
      const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message ?? "Login failed");
      toast.success(`Welcome back, ${json.data.user?.name ?? "there"}!`);
      startTransition(() => {
        router.push(redirectOverride ?? json.data.redirectTo ?? next);
        router.refresh();
      });
    } catch (err) {
      toast.error(errorMessage(err, "Invalid email or password"));
    } finally {
      setDemoLoading(null);
    }
  }

  async function demoLogin(role: Role) {
    const acct = DEMO_ACCOUNTS.find((a) => a.role === role);
    if (!acct) return;
    setDemoLoading(role);
    form.reset({ email: acct.email, password: acct.password });
    await submit({ email: acct.email, password: acct.password }, next === "/dashboard" ? undefined : next);
  }

  const busy = isPending || form.formState.isSubmitting || demoLoading !== null;

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl">Welcome back 👋</CardTitle>
        <CardDescription>Login to your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {expired && <p className="rounded-md bg-warning/15 px-3 py-2 text-sm text-warning">Your session expired. Please log in again.</p>}

        <form onSubmit={form.handleSubmit((v) => submit(v))} className="space-y-4" noValidate>
          <Field id="email" label="Email" error={form.formState.errors.email?.message}>
            <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" aria-invalid={!!form.formState.errors.email} {...form.register("email")} />
          </Field>
          <Field id="password" label="Password" error={form.formState.errors.password?.message}>
            <Input id="password" type="password" autoComplete="current-password" placeholder="••••••••" aria-invalid={!!form.formState.errors.password} {...form.register("password")} />
          </Field>
          <Button type="submit" className="w-full" disabled={busy}>
            {form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : <LogIn />}
            Login
          </Button>
        </form>

        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">or</span>
        </div>

        <div>
          <p className="mb-3 text-center text-sm font-semibold">🚀 Quick demo login</p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.slice(0, 2).map((acct) => (
              <Button key={acct.role} type="button" variant="outline" className="h-auto flex-col gap-1 py-3" disabled={busy} onClick={() => demoLogin(acct.role)}>
                {demoLoading === acct.role ? <Loader2 className="animate-spin" /> : <span aria-hidden>{ROLE_ICON[acct.role]}</span>}
                <span className="text-sm font-semibold">{acct.title}</span>
                <span className="text-[11px] font-normal text-muted-foreground">Demo login</span>
              </Button>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            className="mt-2 h-auto w-full flex-col gap-1 py-3"
            disabled={busy}
            onClick={() => demoLogin(DEMO_ACCOUNTS[2].role)}
          >
            {demoLoading === DEMO_ACCOUNTS[2].role ? <Loader2 className="animate-spin" /> : <span aria-hidden>{ROLE_ICON[DEMO_ACCOUNTS[2].role]}</span>}
            <span className="text-sm font-semibold">{DEMO_ACCOUNTS[2].title}</span>
            <span className="text-[11px] font-normal text-muted-foreground">Demo login</span>
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
