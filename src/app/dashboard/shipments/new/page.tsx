import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { ShipmentForm } from "@/components/features/shipments/shipment-form";

export const metadata: Metadata = { title: "New shipment" };

export default function NewShipmentPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Create a shipment" description="Fill in pickup, receiver, and package details to get an instant quote." />
      <ShipmentForm />
    </div>
  );
}
