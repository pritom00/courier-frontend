import { CreditCard, MapPin, PackagePlus, Truck } from "lucide-react";

const STEPS = [
  { icon: PackagePlus, title: "Book a shipment", desc: "Enter pickup and delivery details, and get an instant price estimate." },
  { icon: CreditCard, title: "Pay securely", desc: "Confirm your shipment and pay online through Stripe's secure checkout." },
  { icon: Truck, title: "We assign a courier", desc: "A verified courier is matched and picks up your parcel from your address." },
  { icon: MapPin, title: "Track to delivery", desc: "Follow every status update live until it's signed for at the destination." },
];

export function HowItWorks() {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {STEPS.map((step, i) => (
        <div key={step.title} className="relative">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">{i + 1}</div>
          <step.icon className="mt-4 size-6 text-primary" aria-hidden />
          <h3 className="mt-3 font-semibold">{step.title}</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">{step.desc}</p>
        </div>
      ))}
    </div>
  );
}
