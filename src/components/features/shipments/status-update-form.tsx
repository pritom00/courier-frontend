"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateStatus } from "@/lib/api/mutations";
import { errorMessage } from "@/lib/api/errors";
import { statusUpdateSchema, type StatusUpdateValues } from "@/lib/validators";
import { STATUS_LABEL, TRANSITIONS } from "@/lib/constants";
import type { ShipmentStatus } from "@/lib/types";

export function StatusUpdateForm({ shipmentId, currentStatus }: { shipmentId: string; currentStatus: ShipmentStatus }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const options = TRANSITIONS[currentStatus] ?? [];
  const [status, setStatus] = useState<ShipmentStatus | "">(options[0] ?? "");

  const form = useForm<StatusUpdateValues>({ resolver: zodResolver(statusUpdateSchema), defaultValues: { status: options[0] ?? "", note: "" } });

  const mutation = useMutation({
    mutationFn: (v: StatusUpdateValues) => updateStatus(shipmentId, { status: v.status as ShipmentStatus, note: v.note }),
    onSuccess: () => {
      toast.success("Status updated");
      queryClient.invalidateQueries({ queryKey: ["shipment", shipmentId] });
      router.refresh();
    },
    onError: (err) => toast.error(errorMessage(err, "Could not update status")),
  });

  if (!options.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Update status</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">This shipment has reached a final state and can no longer be updated.</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Update status</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
          className="space-y-4"
          noValidate
        >
          <Field id="status" label="Next status" error={form.formState.errors.status?.message}>
            <Select
              value={status}
              onValueChange={(v) => {
                setStatus(v as ShipmentStatus);
                form.setValue("status", v, { shouldValidate: true });
              }}
            >
              <SelectTrigger id="status" aria-label="Next status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options.map((s) => (
                  <SelectItem key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field id="note" label="Note" optional error={form.formState.errors.note?.message}>
            <Textarea id="note" placeholder="e.g. Left with the front desk" {...form.register("note")} />
          </Field>
          <Button type="submit" disabled={mutation.isPending} className="w-full">
            {mutation.isPending ? <Loader2 className="animate-spin" /> : <Send />} Update status
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
