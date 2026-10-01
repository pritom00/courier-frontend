import type { PaymentStatus, Role, ShipmentStatus } from "@/lib/types";

export const SHIPMENT_STATUSES: ShipmentStatus[] = [
  "PENDING",
  "PICKUP_SCHEDULED",
  "COURIER_ASSIGNED",
  "PICKED_UP",
  "AT_ORIGIN_HUB",
  "IN_TRANSIT",
  "AT_DESTINATION_HUB",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "FAILED_DELIVERY",
  "RETURNED",
  "CANCELLED",
];

export const STATUS_LABEL: Record<ShipmentStatus, string> = {
  PENDING: "Pending",
  PICKUP_SCHEDULED: "Pickup scheduled",
  COURIER_ASSIGNED: "Courier assigned",
  PICKED_UP: "Picked up",
  AT_ORIGIN_HUB: "At origin hub",
  IN_TRANSIT: "In transit",
  AT_DESTINATION_HUB: "At destination hub",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  FAILED_DELIVERY: "Failed delivery",
  RETURNED: "Returned",
  CANCELLED: "Cancelled",
};

/** Mirrors the backend state machine (shipment.stateMachine.ts). */
export const TRANSITIONS: Record<ShipmentStatus, ShipmentStatus[]> = {
  PENDING: ["PICKUP_SCHEDULED", "CANCELLED"],
  PICKUP_SCHEDULED: ["COURIER_ASSIGNED", "CANCELLED"],
  COURIER_ASSIGNED: ["PICKED_UP", "CANCELLED"],
  PICKED_UP: ["AT_ORIGIN_HUB", "CANCELLED"],
  AT_ORIGIN_HUB: ["IN_TRANSIT"],
  IN_TRANSIT: ["AT_DESTINATION_HUB"],
  AT_DESTINATION_HUB: ["OUT_FOR_DELIVERY"],
  OUT_FOR_DELIVERY: ["DELIVERED", "FAILED_DELIVERY"],
  FAILED_DELIVERY: ["OUT_FOR_DELIVERY", "RETURNED"],
  DELIVERED: [],
  RETURNED: [],
  CANCELLED: [],
};

export const FINAL_STATUSES: ShipmentStatus[] = ["DELIVERED", "RETURNED", "CANCELLED"];

/** Statuses from which the customer may still cancel (backend allows any non-final). */
export const isFinalStatus = (s: ShipmentStatus) => FINAL_STATUSES.includes(s);

export const PAYMENT_LABEL: Record<PaymentStatus, string> = {
  PENDING: "Payment pending",
  PAID: "Paid",
  FAILED: "Payment failed",
  REFUNDED: "Refunded",
};

export const ROLE_LABEL: Record<Role, string> = {
  ADMIN: "Admin",
  CUSTOMER: "Customer",
  COURIER: "Courier",
};

/** Mirrors backend pricing (shipment.pricing.ts). */
export const PRICING = { base: 60, perKg: 15, fragile: 25 } as const;

export const DEMO_ACCOUNTS: { role: Role; title: string; blurb: string; email: string; password: string }[] = [
  { role: "ADMIN", title: "Admin", blurb: "Hubs, users, assignments, audit trail", email: "admin@courierhub.com", password: "Admin@12345" },
  { role: "CUSTOMER", title: "User", blurb: "Send parcels, pay, track shipments", email: "customer@courierhub.com", password: "Customer@123" },
  { role: "COURIER", title: "Provider", blurb: "Accept jobs, update delivery status", email: "courier@courierhub.com", password: "Courier@123" },
];

export const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Newest first" },
  { value: "createdAt:asc", label: "Oldest first" },
  { value: "price:desc", label: "Price: high to low" },
  { value: "price:asc", label: "Price: low to high" },
  { value: "status:asc", label: "Status (A-Z)" },
] as const;

export const AUDIT_ENTITY_TYPES = ["User", "Shipment", "Payment"] as const;
