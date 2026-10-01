export type Role = "CUSTOMER" | "COURIER" | "ADMIN";

export type ShipmentStatus =
  | "PENDING"
  | "PICKUP_SCHEDULED"
  | "COURIER_ASSIGNED"
  | "PICKED_UP"
  | "AT_ORIGIN_HUB"
  | "IN_TRANSIT"
  | "AT_DESTINATION_HUB"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "FAILED_DELIVERY"
  | "RETURNED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: unknown[];
}

export interface PageMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Paginated<T> {
  items: T[];
  meta: PageMeta;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone: string | null;
}

export interface UserRow {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface Shipment {
  id: string;
  trackingCode: string;
  customerId: string;
  courierId: string | null;
  originHubId: string | null;
  destinationHubId: string | null;
  pickupAddress: string;
  deliveryAddress: string;
  receiverName: string;
  receiverPhone: string;
  packageWeightKg: number;
  packageDesc: string | null;
  status: ShipmentStatus;
  price: number;
  isFragile: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Row returned by GET /shipments (includes party names). Search results omit them. */
export interface ShipmentListItem extends Shipment {
  customer?: { id: string; name: string };
  courier?: { id: string; name: string } | null;
}

export interface TrackingEvent {
  id: string;
  shipmentId: string;
  status: ShipmentStatus;
  note: string | null;
  createdAt: string;
}

export interface Payment {
  id: string;
  shipmentId: string;
  userId: string;
  amount: number;
  currency: string;
  method: "STRIPE" | "BKASH" | "SSLCOMMERZ";
  status: PaymentStatus;
  providerRef: string | null;
  createdAt: string;
  updatedAt: string;
}

/** GET /shipments/:id */
export interface ShipmentDetail extends Shipment {
  trackingEvents: TrackingEvent[];
  payment: Payment | null;
}

export interface Hub {
  id: string;
  name: string;
  city: string;
  address: string;
  managerId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  user: { id: string; name: string; email: string } | null;
}

export interface DashboardStats {
  totalUsers: number;
  totalShipments: number;
  activeCouriers: number;
  totalRevenue: number;
  shipmentsByStatus: { status: ShipmentStatus; count: number }[];
  cached: boolean;
}

export interface PaymentSession {
  payment: Payment;
  clientSecret: string;
}
