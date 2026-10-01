import type { Metadata } from "next";
import { ServicesGrid } from "@/components/features/marketing/services-grid";
import { PriceEstimator } from "@/components/features/shipments/price-estimator";

export const metadata: Metadata = { title: "Services", description: "Explore CourierHub's delivery services, from same-city drop-offs to inter-city hub routing." };

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-bold">Our services</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">From single parcels to bulk business shipping, CourierHub adapts to how you need to move things.</p>
      <div className="mt-10">
        <ServicesGrid />
      </div>
      <div className="mx-auto mt-16 max-w-md">
        <PriceEstimator />
      </div>
    </div>
  );
}
