"use client";
import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { errorMessage } from "@/lib/api/errors";
import { registerSchema, type RegisterValues } from "@/lib/validators";

export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", phone: "", role: "CUSTOMER" },
  });

  async function onSubmit(values: RegisterValues) {
    try {
      const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message ?? "Registration failed");
      toast.success(json.message ?? "Account created!");
      startTransition(() => {
        router.push(json.data.redirectTo ?? "/login");
        router.refresh();
      });
    } catch (err) {
      toast.error(errorMessage(err, "Could not create your account"));
    }
  }

  const busy = isPending || form.formState.isSubmitting;

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl">Create your account</CardTitle>
        <CardDescription>Join CourierHub to send or deliver parcels</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Field id="name" label="Full name" error={form.formState.errors.name?.message}>
            <Input id="name" autoComplete="name" placeholder="Jane Doe" aria-invalid={!!form.formState.errors.name} {...form.register("name")} />
          </Field>
          <Field id="email" label="Email" error={form.formState.errors.email?.message}>
            <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" aria-invalid={!!form.formState.errors.email} {...form.register("email")} />
          </Field>
          <Field id="phone" label="Phone" optional error={form.formState.errors.phone?.message}>
            <Input id="phone" type="tel" autoComplete="tel" placeholder="+8801700000000" {...form.register("phone")} />
          </Field>
          <Field id="role" label="I want to" error={form.formState.errors.role?.message}>
            <Select value={form.watch("role")} onValueChange={(v) => form.setValue("role", v as RegisterValues["role"], { shouldValidate: true })}>
              <SelectTrigger id="role" aria-label="Account type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CUSTOMER">Send parcels (Customer)</SelectItem>
                <SelectItem value="COURIER">Deliver parcels (Courier)</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field id="password" label="Password" error={form.formState.errors.password?.message}>
            <Input id="password" type="password" autoComplete="new-password" placeholder="At least 6 characters" aria-invalid={!!form.formState.errors.password} {...form.register("password")} />
          </Field>
          <Field id="confirmPassword" label="Confirm password" error={form.formState.errors.confirmPassword?.message}>
            <Input id="confirmPassword" type="password" autoComplete="new-password" aria-invalid={!!form.formState.errors.confirmPassword} {...form.register("confirmPassword")} />
          </Field>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? <Loader2 className="animate-spin" /> : <UserPlus />} Create account
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
