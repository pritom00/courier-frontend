"use client";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { createHub, updateHub } from "@/lib/api/mutations";
import { errorMessage } from "@/lib/api/errors";
import { hubSchema, type HubValues } from "@/lib/validators";
import type { Hub } from "@/lib/types";

export function HubFormDialog({ open, onOpenChange, hub, onSaved }: { open: boolean; onOpenChange: (open: boolean) => void; hub?: Hub | null; onSaved?: () => void }) {
  const queryClient = useQueryClient();
  const isEdit = Boolean(hub);
  const form = useForm<HubValues>({ resolver: zodResolver(hubSchema), defaultValues: { name: "", city: "", address: "" } });

  useEffect(() => {
    if (open) form.reset({ name: hub?.name ?? "", city: hub?.city ?? "", address: hub?.address ?? "" });
  }, [open, hub, form]);

  const mutation = useMutation({
    mutationFn: (v: HubValues) => (isEdit && hub ? updateHub(hub.id, v) : createHub(v)),
    onSuccess: () => {
      toast.success(isEdit ? "Hub updated" : "Hub created");
      queryClient.invalidateQueries({ queryKey: ["hubs"] });
      onOpenChange(false);
      onSaved?.();
    },
    onError: (err) => toast.error(errorMessage(err, "Could not save the hub")),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit hub" : "Create hub"}</DialogTitle>
          <DialogDescription>{isEdit ? "Update this hub's details." : "Add a new sorting/transit hub."}</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-4" noValidate>
          <Field id="hub-name" label="Hub name" error={form.formState.errors.name?.message}>
            <Input id="hub-name" placeholder="Sylhet Hub" {...form.register("name")} />
          </Field>
          <Field id="hub-city" label="City" error={form.formState.errors.city?.message}>
            <Input id="hub-city" placeholder="Sylhet" {...form.register("city")} />
          </Field>
          <Field id="hub-address" label="Address" error={form.formState.errors.address?.message}>
            <Input id="hub-address" placeholder="Zindabazar, Sylhet" {...form.register("address")} />
          </Field>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="animate-spin" />} {isEdit ? "Save changes" : "Create hub"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
