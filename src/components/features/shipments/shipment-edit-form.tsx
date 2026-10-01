"use client";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateShipment } from "@/lib/api/mutations";
import { errorMessage } from "@/lib/api/errors";
import { shipmentEditSchema, type ShipmentEditValues } from "@/lib/validators";
import type { ShipmentDetail } from "@/lib/types";

export function ShipmentEditForm({ shipment }: { shipment: ShipmentDetail }) {
  const router = useRouter();
  const form = useForm<ShipmentEditValues>({
    resolver: zodResolver(shipmentEditSchema),
    defaultValues: {
      pickupAddress: shipment.pickupAddress,
      deliveryAddress: shipment.deliveryAddress,
      receiverName: shipment.receiverName,
      receiverPhone: shipment.receiverPhone,
      packageDesc: shipment.packageDesc ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: (v: ShipmentEditValues) => updateShipment(shipment.id, v),
    onSuccess: () => {
      toast.success("Shipment updated");
      router.push(`.`);
      router.refresh();
    },
    onError: (err) => toast.error(errorMessage(err, "Could not update this shipment")),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Edit details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="pickupAddress" label="Pickup address" error={form.formState.errors.pickupAddress?.message}>
              <Textarea id="pickupAddress" {...form.register("pickupAddress")} />
            </Field>
            <Field id="deliveryAddress" label="Delivery address" error={form.formState.errors.deliveryAddress?.message}>
              <Textarea id="deliveryAddress" {...form.register("deliveryAddress")} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="receiverName" label="Receiver name" error={form.formState.errors.receiverName?.message}>
              <Input id="receiverName" {...form.register("receiverName")} />
            </Field>
            <Field id="receiverPhone" label="Receiver phone" error={form.formState.errors.receiverPhone?.message}>
              <Input id="receiverPhone" type="tel" {...form.register("receiverPhone")} />
            </Field>
          </div>
          <Field id="packageDesc" label="Package description" optional error={form.formState.errors.packageDesc?.message}>
            <Textarea id="packageDesc" {...form.register("packageDesc")} />
          </Field>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Loader2 className="animate-spin" /> : <Save />} Save changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
