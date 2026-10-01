import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { safeNext } from "@/lib/utils";

export const metadata: Metadata = { title: "Payment successful" };

/** Stripe redirects here after confirmPayment(); the webhook (server-side) is the source of truth for the PAID status. */
export default async function PaymentSuccessPage({ searchParams }: { searchParams: Promise<{ shipmentId?: string; return?: string; redirect_status?: string }> }) {
  const sp = await searchParams;
  const backHref = safeNext(sp.return, "/dashboard");
  const failed = sp.redirect_status === "failed";

  return (
    <div className="flex min-h-dvh items-center justify-center bg-secondary/40 px-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardContent className="flex flex-col items-center gap-4 p-8">
          <div className={`rounded-full p-4 ${failed ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>
            <CheckCircle2 className="size-10" aria-hidden />
          </div>
          <h1 className="text-2xl font-bold">{failed ? "Payment not completed" : "Payment received"}</h1>
          <p className="text-muted-foreground">
            {failed
              ? "Your payment could not be confirmed. You can try again from the shipment page."
              : "Thank you! Your shipment is confirmed. It may take a moment for the status to update once Stripe verifies the payment."}
          </p>
          <Button asChild className="w-full">
            <Link href={backHref}>Back to shipment</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
