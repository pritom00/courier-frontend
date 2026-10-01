import Link from "next/link";
import { CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaymentBadge } from "@/components/shared/status-badge";
import type { Payment } from "@/lib/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export function PaymentCard({ payment, shipmentId, payHref }: { payment: Payment | null; shipmentId: string; payHref: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Payment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!payment ? (
          <>
            <p className="text-sm text-muted-foreground">No payment has been started for this shipment yet.</p>
            <Button asChild className="w-full">
              <Link href={payHref}>
                <CreditCard /> Pay now
              </Link>
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <PaymentBadge status={payment.status} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium">{formatCurrency(payment.amount)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Updated</span>
              <span>{formatDateTime(payment.updatedAt)}</span>
            </div>
            {payment.status !== "PAID" && (
              <Button asChild className="w-full">
                <Link href={payHref}>
                  <CreditCard /> {payment.status === "FAILED" ? "Retry payment" : "Continue to payment"}
                </Link>
              </Button>
            )}
          </>
        )}
        <p className="text-xs text-muted-foreground" data-shipment-id={shipmentId} />
      </CardContent>
    </Card>
  );
}
