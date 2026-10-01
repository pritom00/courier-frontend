import { Boxes, Building2, Clock, Globe, ShieldCheck, Truck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const SERVICES = [
  { icon: Truck, title: "Same-city delivery", desc: "Fast intra-city pickup and drop-off, tracked from the moment a courier is assigned." },
  { icon: Globe, title: "Inter-city shipping", desc: "Hub-to-hub routing between major cities with full transit visibility." },
  { icon: Boxes, title: "Fragile handling", desc: "Dedicated fragile-item pricing and handling instructions for delicate packages." },
  { icon: Building2, title: "Hub network", desc: "A growing network of sorting hubs that keep transfers fast and reliable." },
  { icon: Clock, title: "Real-time tracking", desc: "A live status timeline for every shipment, from pickup to delivery." },
  { icon: ShieldCheck, title: "Secure payments", desc: "Stripe-powered checkout with payment status verified by secure webhooks." },
];

export function ServicesGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {SERVICES.map((s) => (
        <Card key={s.title} className="transition-shadow hover:shadow-md">
          <CardContent className="p-6">
            <div className="mb-4 inline-flex rounded-lg bg-accent p-3 text-accent-foreground">
              <s.icon className="size-6" aria-hidden />
            </div>
            <h3 className="font-semibold">{s.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
