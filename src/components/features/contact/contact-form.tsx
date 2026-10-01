"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/ui/field";
import { Card, CardContent } from "@/components/ui/card";
import { CONTACT_EMAIL } from "@/lib/config";
import { contactSchema, type ContactValues } from "@/lib/validators";

export function ContactForm() {
  const form = useForm<ContactValues>({ resolver: zodResolver(contactSchema), defaultValues: { name: "", email: "", subject: "", message: "" } });

  function onSubmit(values: ContactValues) {
    const body = encodeURIComponent(`${values.message}\n\n— ${values.name} (${values.email})`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(values.subject)}&body=${body}`;
    toast.success("Opening your email client…");
    form.reset();
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="name" label="Your name" error={form.formState.errors.name?.message}>
              <Input id="name" {...form.register("name")} />
            </Field>
            <Field id="email" label="Email" error={form.formState.errors.email?.message}>
              <Input id="email" type="email" {...form.register("email")} />
            </Field>
          </div>
          <Field id="subject" label="Subject" error={form.formState.errors.subject?.message}>
            <Input id="subject" {...form.register("subject")} />
          </Field>
          <Field id="message" label="Message" error={form.formState.errors.message?.message}>
            <Textarea id="message" rows={5} {...form.register("message")} />
          </Field>
          <Button type="submit">
            <Send /> Send message
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
