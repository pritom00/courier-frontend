"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Warehouse, Pencil, Trash2, Plus, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { HubFormDialog } from "@/components/features/hubs/hub-form-dialog";
import { deleteHub } from "@/lib/api/mutations";
import { errorMessage } from "@/lib/api/errors";
import type { Hub, PageMeta } from "@/lib/types";

export function HubList({ hubs, meta }: { hubs: Hub[]; meta: PageMeta }) {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Hub | null>(null);
  const [deleting, setDeleting] = useState<Hub | null>(null);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteHub(id),
    onSuccess: () => {
      toast.success("Hub deleted");
      queryClient.invalidateQueries({ queryKey: ["hubs"] });
      setDeleting(null);
      window.location.reload();
    },
    onError: (err) => {
      toast.error(errorMessage(err, "Could not delete this hub"));
      setDeleting(null);
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus /> New hub
        </Button>
      </div>

      {hubs.length === 0 ? (
        <EmptyState icon={Warehouse} title="No hubs yet" description="Create your first sorting hub to start routing shipments." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hubs.map((hub) => (
            <Card key={hub.id}>
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 font-semibold">
                    <Warehouse className="size-4 text-primary" aria-hidden /> {hub.name}
                  </div>
                  <Badge variant={hub.isActive ? "success" : "muted"}>{hub.isActive ? "Active" : "Inactive"}</Badge>
                </div>
                <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden /> {hub.address}, {hub.city}
                </p>
                <div className="flex gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setEditing(hub);
                      setFormOpen(true);
                    }}
                  >
                    <Pencil /> Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-destructive hover:text-destructive" onClick={() => setDeleting(hub)}>
                    <Trash2 /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Pagination meta={meta} />

      <HubFormDialog open={formOpen} onOpenChange={setFormOpen} hub={editing} onSaved={() => window.location.reload()} />
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title={`Delete ${deleting?.name}?`}
        description="This performs a soft delete. The hub will no longer appear in listings."
        confirmLabel="Delete"
        destructive
        loading={deleteMutation.isPending}
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
      />
    </div>
  );
}
