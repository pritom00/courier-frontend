"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { updateProfile } from "@/lib/api/mutations";
import { errorMessage } from "@/lib/api/errors";
import { profileSchema, type ProfileValues } from "@/lib/validators";
import { ROLE_LABEL } from "@/lib/constants";
import { initials } from "@/lib/utils";
import type { SessionUser } from "@/lib/types";

export function ProfileForm({ user }: { user: SessionUser }) {
  const router = useRouter();
  const { setUser } = useAuth();
  const form = useForm<ProfileValues>({ resolver: zodResolver(profileSchema), defaultValues: { name: user.name, phone: user.phone ?? "" } });

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updated) => {
      toast.success("Profile updated");
      setUser(updated);
      router.refresh();
    },
    onError: (err) => toast.error(errorMessage(err, "Could not update your profile")),
  });

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
          <span className="flex size-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">{initials(user.name)}</span>
          <div>
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <Badge variant="brown">{ROLE_LABEL[user.role]}</Badge>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Personal information</CardTitle>
          <CardDescription>Update your name and phone number. Email cannot be changed here.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-4" noValidate>
            <Field id="name" label="Full name" error={form.formState.errors.name?.message}>
              <Input id="name" {...form.register("name")} />
            </Field>
            <Field id="email" label="Email">
              <Input id="email" value={user.email} disabled />
            </Field>
            <Field id="phone" label="Phone" optional error={form.formState.errors.phone?.message}>
              <Input id="phone" type="tel" placeholder="+8801700000000" {...form.register("phone")} />
            </Field>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <Loader2 className="animate-spin" /> : <Save />} Save changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
