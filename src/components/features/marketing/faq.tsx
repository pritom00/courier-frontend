const FAQS = [
  { q: "How is the delivery price calculated?", a: "Pricing is based on a flat base fare plus a per-kilogram rate, with an additional handling fee for fragile items. You'll see the exact estimate before you confirm a shipment." },
  { q: "Which payment methods are supported?", a: "We process payments through Stripe in test mode, supporting major test cards for demonstration purposes." },
  { q: "Can I track my shipment in real time?", a: "Yes. Every shipment has a live status timeline, from pickup scheduling through hub transfers to final delivery." },
  { q: "How do I become a courier partner?", a: "Register for an account and choose the Courier role. Once approved, you'll be able to accept delivery assignments from admins." },
  { q: "What happens if I need to cancel?", a: "Shipments can be cancelled any time before they reach a final delivered/returned state, directly from your dashboard." },
];

export function Faq() {
  return (
    <div className="mx-auto max-w-3xl divide-y rounded-xl border">
      {FAQS.map((item) => (
        <details key={item.q} className="group p-5">
          <summary className="flex cursor-pointer list-none items-center justify-between font-medium marker:content-none">
            {item.q}
            <span className="ml-4 text-muted-foreground transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 text-sm text-muted-foreground">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
