"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

/** Stripe Elements checkout: confirms the PaymentIntent client-side, then redirects to /payment/success. */
export function CheckoutForm({ shipmentId, returnPath }: { shipmentId: string; returnPath: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);

    const site = typeof window !== "undefined" ? window.location.origin : "";
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${site}/payment/success?shipmentId=${shipmentId}&return=${encodeURIComponent(returnPath)}` },
    });

    if (error) {
      toast.error(error.message ?? "Payment could not be confirmed");
      setSubmitting(false);
    }
    // On success Stripe redirects the browser to return_url itself - no further action needed here.
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <PaymentElement options={{ layout: "tabs" }} />
      <Button type="submit" size="lg" className="w-full" disabled={!stripe || submitting}>
        {submitting ? <Loader2 className="animate-spin" /> : <CreditCard />} Pay now
      </Button>
      <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="size-3.5" aria-hidden /> Secured by Stripe · Test mode
      </p>
      <button
        type="button"
        onClick={() => router.push(returnPath)}
        className="block w-full text-center text-sm text-muted-foreground underline-offset-4 hover:underline"
      >
        Cancel and go back
      </button>
    </form>
  );
}
