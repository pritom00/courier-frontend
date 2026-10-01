import Link from "next/link";
import { ArrowRight, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrackWidget } from "@/components/features/shipments/track-widget";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary/70 to-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            <Truck className="size-3.5" aria-hidden /> Trusted across Bangladesh
          </span>
          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Deliveries that arrive <span className="text-primary">on time</span>, every time
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Book a pickup, track your parcel live, and pay securely — CourierHub connects customers, couriers, and hubs on one simple platform.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/register">
                Send a parcel <ArrowRight />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/services">Explore services</Link>
            </Button>
          </div>
          <div className="mt-8">
            <p className="mb-2 text-sm font-medium text-muted-foreground">Already shipped with us? Track your parcel:</p>
            <TrackWidget />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCardVisual icon={PackageCheck} title="99.2%" desc="On-time delivery rate" />
          <StatCardVisual icon={ShieldCheck} title="Secure" desc="Stripe-protected payments" className="sm:mt-8" />
          <StatCardVisual icon={Truck} title="24/7" desc="Live shipment tracking" className="sm:col-span-2" />
        </div>
      </div>
    </section>
  );
}

function StatCardVisual({ icon: Icon, title, desc, className }: { icon: typeof Truck; title: string; desc: string; className?: string }) {
  return (
    <div className={`rounded-2xl border bg-card p-6 shadow-sm ${className ?? ""}`}>
      <Icon className="size-8 text-primary" aria-hidden />
      <p className="mt-3 text-2xl font-bold">{title}</p>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
