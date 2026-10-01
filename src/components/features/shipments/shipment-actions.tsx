"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Ban, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { cancelShipment, deleteShipment } from "@/lib/api/mutations";
import { errorMessage } from "@/lib/api/errors";
import { isFinalStatus } from "@/lib/constants";
import type { ShipmentStatus } from "@/lib/types";

export function ShipmentActions({ shipmentId, status, canDelete, afterDeleteHref }: { shipmentId: string; status: ShipmentStatus; canDelete?: boolean; afterDeleteHref: string }) {
  const router = useRouter();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const cancelMutation = useMutation({
    mutationFn: () => cancelShipment(shipmentId),
    onSuccess: () => {
      toast.success("Shipment cancelled");
      setConfirmCancel(false);
      router.refresh();
    },
    onError: (err) => {
      toast.error(errorMessage(err, "Could not cancel this shipment"));
      setConfirmCancel(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteShipment(shipmentId),
    onSuccess: () => {
      toast.success("Shipment deleted");
      router.push(afterDeleteHref);
      router.refresh();
    },
    onError: (err) => {
      toast.error(errorMessage(err, "Could not delete this shipment"));
      setConfirmDelete(false);
    },
  });

  if (isFinalStatus(status) && !canDelete) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {!isFinalStatus(status) && (
        <Button variant="outline" onClick={() => setConfirmCancel(true)}>
          <Ban /> Cancel shipment
        </Button>
      )}
      {canDelete && (
        <Button variant="destructive" onClick={() => setConfirmDelete(true)}>
          <Trash2 /> Delete
        </Button>
      )}

      <ConfirmDialog
        open={confirmCancel}
        onOpenChange={setConfirmCancel}
        title="Cancel this shipment?"
        description="The customer and any assigned courier will see this shipment marked as cancelled. This cannot be undone."
        confirmLabel="Yes, cancel it"
        destructive
        loading={cancelMutation.isPending}
        onConfirm={() => cancelMutation.mutate()}
      />
      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete this shipment?"
        description="This performs a soft delete - the record is kept for audit purposes but will no longer appear in any list."
        confirmLabel="Delete"
        destructive
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate()}
      />
    </div>
  );
}
