import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/features/contact/contact-form";
import { CONTACT_EMAIL } from "@/lib/config";

export const metadata: Metadata = { title: "Contact us", description: "Get in touch with the CourierHub team." };

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
      <div>
        <h1 className="text-4xl font-bold">Get in touch</h1>
        <p className="mt-3 text-muted-foreground">Questions about a shipment, becoming a courier partner, or anything else? We&apos;d love to hear from you.</p>
        <ul className="mt-8 space-y-4 text-sm">
          <li className="flex items-center gap-3">
            <Mail className="size-5 text-primary" aria-hidden /> {CONTACT_EMAIL}
          </li>
          <li className="flex items-center gap-3">
            <Phone className="size-5 text-primary" aria-hidden /> +880 1700-000000
          </li>
          <li className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden /> Motijheel, Dhaka, Bangladesh
          </li>
        </ul>
      </div>
      <ContactForm />
    </div>
  );
}
