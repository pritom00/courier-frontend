import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { ShipmentEditForm } from "@/components/features/shipments/shipment-edit-form";
import { getShipment } from "@/lib/api/queries";

export const metadata: Metadata = { title: "Edit shipment" };

export default async function EditShipmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const shipment = await getShipment(id);
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title={`Edit ${shipment.trackingCode}`} />
      <ShipmentEditForm shipment={shipment} />
    </div>
  );
}
