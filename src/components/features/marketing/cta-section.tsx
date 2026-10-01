import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <div className="rounded-2xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12">
      <h2 className="text-3xl font-bold sm:text-4xl">Ready to ship smarter?</h2>
      <p className="mx-auto mt-3 max-w-xl text-primary-foreground/85">Create a free account and book your first pickup in minutes.</p>
      <Button size="lg" variant="secondary" className="mt-6" asChild>
        <Link href="/register">
          Get started free <ArrowRight />
        </Link>
      </Button>
    </div>
  );
}
