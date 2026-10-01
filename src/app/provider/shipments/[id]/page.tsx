import type { Metadata } from "next";
import { Suspense } from "react";
import { Package } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShipmentTimeline } from "@/components/shared/shipment-timeline";
import { StatusUpdateForm } from "@/components/features/shipments/status-update-form";
import { DetailSkeleton } from "@/components/shared/skeletons";
import { getShipment } from "@/lib/api/queries";
import { formatDateTime } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const shipment = await getShipment(id);
  return { title: `Delivery ${shipment.trackingCode}` };
}

async function DeliveryDetail({ id }: { id: string }) {
  const shipment = await getShipment(id);
  return (
    <>
      <PageHeader title={shipment.trackingCode} description={`Assigned since ${formatDateTime(shipment.createdAt)}`} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="size-4" aria-hidden /> Delivery details
              </CardTitle>
              <StatusBadge status={shipment.status} />
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Detail label="Pickup address" value={shipment.pickupAddress} />
              <Detail label="Delivery address" value={shipment.deliveryAddress} />
              <Detail label="Receiver" value={`${shipment.receiverName} · ${shipment.receiverPhone}`} />
              <Detail label="Package" value={`${shipment.packageWeightKg} kg${shipment.isFragile ? " · Fragile" : ""}`} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tracking history</CardTitle>
            </CardHeader>
            <CardContent>
              <ShipmentTimeline events={shipment.trackingEvents} />
            </CardContent>
          </Card>
        </div>
        <div>
          <StatusUpdateForm shipmentId={shipment.id} currentStatus={shipment.status} />
        </div>
      </div>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm">{value}</p>
    </div>
  );
}

export default async function ProviderShipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <DeliveryDetail id={id} />
    </Suspense>
  );
}
