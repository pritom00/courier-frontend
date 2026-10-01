import type { Metadata } from "next";
import { PricingTable } from "@/components/features/marketing/pricing-table";
import { Faq } from "@/components/features/marketing/faq";

export const metadata: Metadata = { title: "Pricing", description: "Simple, transparent courier pricing based on weight and handling requirements." };

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-center text-4xl font-bold">Simple, transparent pricing</h1>
      <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">No hidden fees. Pay a base fare plus a per-kilogram rate, with a fragile handling add-on when you need it.</p>
      <div className="mt-12">
        <PricingTable />
      </div>
      <div className="mt-20">
        <h2 className="text-center text-2xl font-bold">Frequently asked questions</h2>
        <div className="mt-8">
          <Faq />
        </div>
      </div>
    </div>
  );
}
