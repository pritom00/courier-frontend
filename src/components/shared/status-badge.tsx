import { Badge } from "@/components/ui/badge";
import { PAYMENT_LABEL, STATUS_LABEL } from "@/lib/constants";
import type { PaymentStatus, ShipmentStatus } from "@/lib/types";

type Variant = "default" | "secondary" | "outline" | "success" | "warning" | "destructive" | "brown" | "muted";

const SHIPMENT_VARIANT: Record<ShipmentStatus, Variant> = {
  PENDING: "warning",
  PICKUP_SCHEDULED: "brown",
  COURIER_ASSIGNED: "brown",
  PICKED_UP: "default",
  AT_ORIGIN_HUB: "default",
  IN_TRANSIT: "default",
  AT_DESTINATION_HUB: "default",
  OUT_FOR_DELIVERY: "default",
  DELIVERED: "success",
  FAILED_DELIVERY: "destructive",
  RETURNED: "muted",
  CANCELLED: "muted",
};

const PAYMENT_VARIANT: Record<PaymentStatus, Variant> = {
  PENDING: "warning",
  PAID: "success",
  FAILED: "destructive",
  REFUNDED: "muted",
};

export function StatusBadge({ status }: { status: ShipmentStatus }) {
  return <Badge variant={SHIPMENT_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>;
}

export function PaymentBadge({ status }: { status: PaymentStatus | null | undefined }) {
  if (!status) return <Badge variant="outline">Unpaid</Badge>;
  return <Badge variant={PAYMENT_VARIANT[status]}>{PAYMENT_LABEL[status]}</Badge>;
}
