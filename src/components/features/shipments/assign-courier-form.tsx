"use client";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Loader2, UserCog } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { assignCourier, fetchCouriers, queryKeys } from "@/lib/api/mutations";
import { errorMessage } from "@/lib/api/errors";

export function AssignCourierForm({ shipmentId }: { shipmentId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [courierId, setCourierId] = useState("");

  const couriersQuery = useQuery({ queryKey: queryKeys.couriers, queryFn: fetchCouriers });

  const mutation = useMutation({
    mutationFn: () => assignCourier(shipmentId, courierId),
    onSuccess: () => {
      toast.success("Courier assigned");
      queryClient.invalidateQueries({ queryKey: ["shipment", shipmentId] });
      router.refresh();
    },
    onError: (err) => toast.error(errorMessage(err, "Could not assign a courier")),
  });

  const couriers = couriersQuery.data?.items ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Assign courier</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {couriersQuery.isLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : couriers.length === 0 ? (
          <p className="text-sm text-muted-foreground">No active couriers available yet.</p>
        ) : (
          <Select value={courierId} onValueChange={setCourierId}>
            <SelectTrigger aria-label="Select a courier">
              <SelectValue placeholder="Select a courier" />
            </SelectTrigger>
            <SelectContent>
              {couriers.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name} ({c.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <Button className="w-full" disabled={!courierId || mutation.isPending} onClick={() => mutation.mutate()}>
          {mutation.isPending ? <Loader2 className="animate-spin" /> : <UserCog />} Assign courier
        </Button>
      </CardContent>
    </Card>
  );
}
