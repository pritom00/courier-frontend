import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Checkout } from "@/components/features/payments/checkout";
import { getShipment } from "@/lib/api/queries";

export const metadata: Metadata = { title: "Pay for shipment" };

export default async function PayShipmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const shipment = await getShipment(id);
  return (
    <div className="mx-auto max-w-lg">
      <PageHeader title={`Pay for ${shipment.trackingCode}`} description="Your payment is processed securely by Stripe." />
      <Checkout shipmentId={shipment.id} price={shipment.price} returnPath={`/dashboard/shipments/${shipment.id}`} />
    </div>
  );
}
