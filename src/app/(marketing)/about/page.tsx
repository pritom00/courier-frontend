import type { Metadata } from "next";
import { ShieldCheck, Target, Truck, Users } from "lucide-react";

export const metadata: Metadata = { title: "About us", description: "Learn about CourierHub's mission to make logistics simple and reliable across Bangladesh." };

const VALUES = [
  { icon: Target, title: "Reliability first", desc: "Every shipment is tracked from pickup to delivery so nothing falls through the cracks." },
  { icon: Users, title: "People powered", desc: "A growing network of courier partners committed to on-time delivery." },
  { icon: ShieldCheck, title: "Secure by design", desc: "Role-based access control and verified payments protect every transaction." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="flex items-center gap-2 text-primary">
        <Truck className="size-6" aria-hidden />
        <span className="text-sm font-semibold uppercase tracking-wide">About CourierHub</span>
      </div>
      <h1 className="mt-3 text-4xl font-bold">Built to make delivery logistics simple</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        CourierHub connects customers who need to send parcels, couriers who deliver them, and admins who keep the whole network running smoothly - all on
        one platform with live tracking and secure payments.
      </p>
      <p className="mt-4 text-muted-foreground">
        We started with a simple observation: sending a parcel across town or across the country shouldn&apos;t mean guessing when it will arrive. By
        giving every shipment a real-time status timeline and every role a purpose-built dashboard, we&apos;ve built a platform that keeps everyone
        informed, from booking to delivery confirmation.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {VALUES.map((v) => (
          <div key={v.title} className="rounded-xl border p-5">
            <v.icon className="size-6 text-primary" aria-hidden />
            <h3 className="mt-3 font-semibold">{v.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{v.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
