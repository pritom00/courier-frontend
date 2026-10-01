"use client";
import { useEffect, useState } from "react";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useMutation } from "@tanstack/react-query";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckoutForm } from "@/components/features/payments/checkout-form";
import { initiatePayment } from "@/lib/api/mutations";
import { errorMessage } from "@/lib/api/errors";
import { formatCurrency } from "@/lib/utils";

let stripePromise: Promise<Stripe | null> | null = null;
function getStripe() {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key) return null;
  if (!stripePromise) stripePromise = loadStripe(key);
  return stripePromise;
}

export function Checkout({ shipmentId, price, returnPath }: { shipmentId: string; price: number; returnPath: string }) {
  const [started, setStarted] = useState(false);
  const mutation = useMutation({ mutationFn: () => initiatePayment(shipmentId) });

  useEffect(() => {
    if (!started) {
      setStarted(true);
      mutation.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  if (!publishableKey) {
    return (
      <Card className="border-warning/40 bg-warning/5">
        <CardContent className="flex items-start gap-3 p-5 text-sm">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden />
          <p>Payments aren&apos;t configured yet: set <code className="rounded bg-muted px-1 py-0.5">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> to enable checkout.</p>
        </CardContent>
      </Card>
    );
  }

  if (mutation.isPending) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Preparing a secure checkout session…</p>
        </CardContent>
      </Card>
    );
  }

  if (mutation.isError) {
    return (
      <Card className="border-destructive/40 bg-destructive/5">
        <CardContent className="flex items-start gap-3 p-5 text-sm text-destructive">
          <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden />
          {errorMessage(mutation.error, "Could not start the payment session")}
        </CardContent>
      </Card>
    );
  }

  if (!mutation.data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete payment</CardTitle>
        <CardDescription>Amount due: <span className="font-semibold text-foreground">{formatCurrency(price)}</span></CardDescription>
      </CardHeader>
      <CardContent>
        <Elements stripe={getStripe()} options={{ clientSecret: mutation.data.clientSecret, appearance: { theme: "stripe", variables: { colorPrimary: "#5b3a22" } } }}>
          <CheckoutForm shipmentId={shipmentId} returnPath={returnPath} />
        </Elements>
      </CardContent>
    </Card>
  );
}
