import { api } from "@/lib/api/client";
import type {
  Hub,
  PaymentSession,
  Payment,
  Paginated,
  Shipment,
  ShipmentDetail,
  ShipmentStatus,
  SessionUser,
  UserRow,
} from "@/lib/types";
import type { HubValues, ProfileValues, ShipmentEditValues, ShipmentValues } from "@/lib/validators";

const clean = <T extends object>(o: T) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== "" && v !== "none"));

export const queryKeys = {
  shipment: (id: string) => ["shipment", id] as const,
  couriers: ["couriers"] as const,
  hubs: ["hubs", "all"] as const,
  payment: (id: string) => ["payment", id] as const,
};

export const createShipment = (v: ShipmentValues) => api<Shipment>("/shipments", { method: "POST", body: clean(v) });
export const fetchShipment = (id: string) => api<ShipmentDetail>(`/shipments/${id}`);
export const updateShipment = (id: string, v: ShipmentEditValues) =>
  api<Shipment>(`/shipments/${id}`, { method: "PATCH", body: clean(v) });
export const cancelShipment = (id: string) => api<Shipment>(`/shipments/${id}/cancel`, { method: "POST" });
export const deleteShipment = (id: string) => api<Record<string, never>>(`/shipments/${id}`, { method: "DELETE" });
export const assignCourier = (id: string, courierId: string) =>
  api<Shipment>(`/shipments/${id}/assign`, { method: "POST", body: { courierId } });
export const updateStatus = (id: string, body: { status: ShipmentStatus; note?: string }) =>
  api<Shipment>(`/shipments/${id}/status`, { method: "PATCH", body: clean(body) });

export const fetchCouriers = () => api<Paginated<UserRow>>("/admin/users?role=COURIER&limit=100");
export const fetchHubs = () => api<Paginated<Hub>>("/hubs?limit=100");
export const createHub = (v: HubValues) => api<Hub>("/hubs", { method: "POST", body: v });
export const updateHub = (id: string, v: Partial<HubValues> & { isActive?: boolean }) =>
  api<Hub>(`/hubs/${id}`, { method: "PATCH", body: v });
export const deleteHub = (id: string) => api<Record<string, never>>(`/hubs/${id}`, { method: "DELETE" });

export const updateUserRole = (id: string, role: UserRow["role"]) =>
  api<UserRow>(`/admin/users/${id}/role`, { method: "PATCH", body: { role } });
export const updateProfile = (v: ProfileValues) => api<SessionUser>("/users/me", { method: "PATCH", body: clean(v) });

export const initiatePayment = (shipmentId: string) =>
  api<PaymentSession>("/payments/initiate", { method: "POST", body: { shipmentId } });
export const fetchPayment = (id: string) => api<Payment>(`/payments/${id}`);
