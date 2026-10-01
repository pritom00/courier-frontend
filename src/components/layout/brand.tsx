import Link from "next/link";
import { Truck } from "lucide-react";
import { SITE_NAME } from "@/lib/config";
import { cn } from "@/lib/utils";

export function Brand({ href = "/", className }: { href?: string; className?: string }) {
  return (
    <Link href={href} className={cn("flex items-center gap-2 font-bold tracking-tight", className)}>
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Truck className="size-4.5" aria-hidden />
      </span>
      <span className="text-lg">{SITE_NAME}</span>
    </Link>
  );
}
