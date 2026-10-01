import Link from "next/link";
import { Mail, MapPin, Phone, Truck } from "lucide-react";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/config";

export function SiteFooter() {
  return (
    <footer className="border-t bg-secondary/60">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-bold">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Truck className="size-4.5" aria-hidden />
            </span>
            {SITE_NAME}
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">Reliable courier and logistics management across Bangladesh - from pickup to doorstep.</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Company</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/about" className="hover:text-foreground">About us</Link></li>
            <li><Link href="/services" className="hover:text-foreground">Services</Link></li>
            <li><Link href="/pricing" className="hover:text-foreground">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Support</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
            <li><Link href="/login" className="hover:text-foreground">Sign in</Link></li>
            <li><Link href="/register" className="hover:text-foreground">Create account</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Get in touch</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Mail className="size-4" aria-hidden /> {CONTACT_EMAIL}</li>
            <li className="flex items-center gap-2"><Phone className="size-4" aria-hidden /> +880 1700-000000</li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0" aria-hidden /> Motijheel, Dhaka, Bangladesh</li>
          </ul>
        </div>
      </div>
      <div className="border-t px-4 py-5 text-center text-xs text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
      </div>
    </footer>
  );
}
