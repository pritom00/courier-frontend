import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Pencil, Package } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShipmentTimeline } from "@/components/shared/shipment-timeline";
import { ShipmentActions } from "@/components/features/shipments/shipment-actions";
import { PaymentCard } from "@/components/features/payments/payment-card";
import { DetailSkeleton } from "@/components/shared/skeletons";
import { getShipment } from "@/lib/api/queries";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { isFinalStatus } from "@/lib/constants";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const shipment = await getShipment(id);
  return { title: `Shipment ${shipment.trackingCode}` };
}

async function ShipmentDetail({ id }: { id: string }) {
  const shipment = await getShipment(id);
  const editable = !isFinalStatus(shipment.status);

  return (
    <>
      <PageHeader
        title={shipment.trackingCode}
        description={`Created ${formatDateTime(shipment.createdAt)}`}
        actions={
          editable ? (
            <Button variant="outline" asChild>
              <Link href={`/dashboard/shipments/${shipment.id}/edit`}>
                <Pencil /> Edit
              </Link>
            </Button>
          ) : undefined
        }
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="size-4" aria-hidden /> Shipment details
              </CardTitle>
              <StatusBadge status={shipment.status} />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Detail label="Pickup address" value={shipment.pickupAddress} />
                <Detail label="Delivery address" value={shipment.deliveryAddress} />
                <Detail label="Receiver" value={`${shipment.receiverName} · ${shipment.receiverPhone}`} />
                <Detail label="Package weight" value={`${shipment.packageWeightKg} kg${shipment.isFragile ? " · Fragile" : ""}`} />
                {shipment.packageDesc && <Detail label="Description" value={shipment.packageDesc} className="sm:col-span-2" />}
                <Detail label="Price" value={formatCurrency(shipment.price)} />
              </div>
              <Separator />
              <ShipmentActions shipmentId={shipment.id} status={shipment.status} afterDeleteHref="/dashboard" />
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

        <div className="space-y-6">
          <PaymentCard payment={shipment.payment} shipmentId={shipment.id} payHref={`/dashboard/shipments/${shipment.id}/pay`} />
        </div>
      </div>
    </>
  );
}

function Detail({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm">{value}</p>
    </div>
  );
}

export default async function CustomerShipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <ShipmentDetail id={id} />
    </Suspense>
  );
}
