import type { Metadata } from "next";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { safeNext } from "@/lib/utils";

export const metadata: Metadata = { title: "Payment cancelled" };

export default async function PaymentCancelPage({ searchParams }: { searchParams: Promise<{ return?: string }> }) {
  const sp = await searchParams;
  const backHref = safeNext(sp.return, "/dashboard");

  return (
    <div className="flex min-h-dvh items-center justify-center bg-secondary/40 px-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardContent className="flex flex-col items-center gap-4 p-8">
          <div className="rounded-full bg-warning/10 p-4 text-warning">
            <XCircle className="size-10" aria-hidden />
          </div>
          <h1 className="text-2xl font-bold">Payment cancelled</h1>
          <p className="text-muted-foreground">No charge was made. You can restart the payment any time from your shipment.</p>
          <Button asChild className="w-full">
            <Link href={backHref}>Back to shipment</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
