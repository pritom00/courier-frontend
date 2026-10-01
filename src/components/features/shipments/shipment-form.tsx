"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm, type UseFormReturn, type FieldValues, type Path } from "react-hook-form";
import { Loader2, PackagePlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { createShipment } from "@/lib/api/mutations";
import { errorMessage } from "@/lib/api/errors";
import { shipmentSchema, type ShipmentValues } from "@/lib/validators";
import { estimatePrice, formatCurrency } from "@/lib/utils";

const STEPS = ["Pickup & delivery", "Receiver details", "Package & review"] as const;

export function ShipmentForm() {
  const router = useRouter();
  const form = useForm<ShipmentValues>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: { pickupAddress: "", deliveryAddress: "", receiverName: "", receiverPhone: "", packageWeightKg: 1, isFragile: false, packageDesc: "" },
    mode: "onBlur",
  });

  const mutation = useMutation({
    mutationFn: createShipment,
    onSuccess: (shipment) => {
      toast.success(`Shipment ${shipment.trackingCode} created`);
      router.push(`/dashboard/shipments/${shipment.id}`);
      router.refresh();
    },
    onError: (err) => toast.error(errorMessage(err, "Could not create the shipment")),
  });

  const values = form.watch();
  const price = estimatePrice(values.packageWeightKg || 0, values.isFragile);

  const stepFields: (keyof ShipmentValues)[][] = [
    ["pickupAddress", "deliveryAddress"],
    ["receiverName", "receiverPhone"],
    ["packageWeightKg", "packageDesc"],
  ];

  return (
    <MultiStepForm
      title="Create a shipment"
      steps={STEPS}
      stepFields={stepFields}
      form={form}
      onSubmit={(v) => mutation.mutate(v)}
      submitting={mutation.isPending}
      submitLabel={
        <>
          <PackagePlus /> Create shipment
        </>
      }
      renderStep={(step) => {
        if (step === 0)
          return (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="pickupAddress" label="Pickup address" className="sm:col-span-2" error={form.formState.errors.pickupAddress?.message}>
                <Textarea id="pickupAddress" placeholder="House 12, Road 5, Dhanmondi, Dhaka" aria-invalid={!!form.formState.errors.pickupAddress} {...form.register("pickupAddress")} />
              </Field>
              <Field id="deliveryAddress" label="Delivery address" className="sm:col-span-2" error={form.formState.errors.deliveryAddress?.message}>
                <Textarea id="deliveryAddress" placeholder="House 40, GEC Circle, Chattogram" aria-invalid={!!form.formState.errors.deliveryAddress} {...form.register("deliveryAddress")} />
              </Field>
            </div>
          );
        if (step === 1)
          return (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="receiverName" label="Receiver name" error={form.formState.errors.receiverName?.message}>
                <Input id="receiverName" placeholder="Karim Rahman" aria-invalid={!!form.formState.errors.receiverName} {...form.register("receiverName")} />
              </Field>
              <Field id="receiverPhone" label="Receiver phone" error={form.formState.errors.receiverPhone?.message}>
                <Input id="receiverPhone" type="tel" placeholder="+8801711111111" aria-invalid={!!form.formState.errors.receiverPhone} {...form.register("receiverPhone")} />
              </Field>
            </div>
          );
        return (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="packageWeightKg" label="Package weight (kg)" error={form.formState.errors.packageWeightKg?.message}>
                <Input
                  id="packageWeightKg"
                  type="number"
                  step="0.1"
                  min={0.1}
                  aria-invalid={!!form.formState.errors.packageWeightKg}
                  {...form.register("packageWeightKg", { valueAsNumber: true })}
                />
              </Field>
              <div className="flex items-end justify-between rounded-lg border bg-muted/40 px-4 py-2.5">
                <Label htmlFor="isFragile" className="cursor-pointer">
                  Fragile item
                </Label>
                <Switch id="isFragile" checked={values.isFragile} onCheckedChange={(v) => form.setValue("isFragile", v)} />
              </div>
            </div>
            <Field id="packageDesc" label="Package description" optional error={form.formState.errors.packageDesc?.message}>
              <Textarea id="packageDesc" placeholder="e.g. Electronics, documents, clothing" {...form.register("packageDesc")} />
            </Field>
            <div className="rounded-lg bg-primary px-4 py-4 text-center text-primary-foreground">
              <p className="text-xs uppercase tracking-wide opacity-80">Estimated price</p>
              <p className="text-3xl font-bold">{formatCurrency(price)}</p>
            </div>
          </div>
        );
      }}
    />
  );
}

// --- Generic multi-step wrapper (kept in this file: only shipment creation needs it) ---

function MultiStepForm<T extends FieldValues>({
  title,
  steps,
  stepFields,
  form,
  onSubmit,
  submitting,
  submitLabel,
  renderStep,
}: {
  title: string;
  steps: readonly string[];
  stepFields: (keyof T)[][];
  form: UseFormReturn<T>;
  onSubmit: (values: T) => void;
  submitting: boolean;
  submitLabel: React.ReactNode;
  renderStep: (step: number) => React.ReactNode;
}) {
  const [step, setStep] = useState(0);
  const isLast = step === steps.length - 1;

  async function next() {
    const valid = await form.trigger(stepFields[step] as Path<T>[]);
    if (valid) setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Step {step + 1} of {steps.length}: {steps[step]}
        </CardDescription>
        <ol className="mt-3 flex gap-2" aria-label="Progress">
          {steps.map((s, i) => (
            <li key={s} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-accent"}`} aria-current={i === step ? "step" : undefined} />
          ))}
        </ol>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (isLast) form.handleSubmit(onSubmit)();
            else next();
          }}
          noValidate
          className="space-y-6"
        >
          {renderStep(step)}
          <div className="flex justify-between gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setStep((s) => Math.max(s - 1, 0))} disabled={step === 0 || submitting}>
              Back
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="animate-spin" />}
              {isLast ? submitLabel : "Continue"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
