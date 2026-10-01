import type { Metadata } from "next";
import { Hero } from "@/components/features/marketing/hero";
import { ServicesGrid } from "@/components/features/marketing/services-grid";
import { HowItWorks } from "@/components/features/marketing/how-it-works";
import { Testimonials } from "@/components/features/marketing/testimonials";
import { CtaSection } from "@/components/features/marketing/cta-section";

export const metadata: Metadata = {
  title: "Fast, trackable courier & logistics delivery",
  description: "Book pickups, track parcels in real time, and pay securely with CourierHub - Bangladesh's courier and logistics platform.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-3xl font-bold">What we offer</h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-muted-foreground">Everything you need to send, deliver, and manage parcels end to end.</p>
        <div className="mt-10">
          <ServicesGrid />
        </div>
      </section>
      <section className="bg-secondary/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold">How it works</h2>
          <div className="mt-10">
            <HowItWorks />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-3xl font-bold">Loved by senders and couriers</h2>
        <div className="mt-10">
          <Testimonials />
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <CtaSection />
      </section>
    </>
  );
}
