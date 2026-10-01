import "server-only";
import { cache } from "react";
import { serverFetch } from "@/lib/api/server";
import type {
  AuditLog,
  DashboardStats,
  Hub,
  Paginated,
  Payment,
  SessionUser,
  Shipment,
  ShipmentDetail,
  ShipmentListItem,
  UserRow,
} from "@/lib/types";

export const getMe = cache(async (): Promise<SessionUser> => {
  const u = await serverFetch<SessionUser>("/users/me");
  return { id: u.id, name: u.name, email: u.email, role: u.role, phone: u.phone ?? null };
});

export interface ShipmentQuery {
  page: number;
  limit: number;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
  q?: string;
}

const SORT_FIELDS = ["createdAt", "price", "status"];
const ALLOWED_LIMITS = [10, 20, 50];

type RawParams = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export function parsePage(sp: RawParams) {
  const page = Math.max(parseInt(first(sp.page) ?? "1", 10) || 1, 1);
  const limitRaw = parseInt(first(sp.limit) ?? "10", 10);
  const limit = ALLOWED_LIMITS.includes(limitRaw) ? limitRaw : 10;
  return { page, limit };
}

export function parseShipmentQuery(sp: RawParams): ShipmentQuery {
  const { page, limit } = parsePage(sp);
  const sortBy = first(sp.sortBy);
  const sortOrder = first(sp.sortOrder);
  return {
    page,
    limit,
    status: first(sp.status) || undefined,
    sortBy: sortBy && SORT_FIELDS.includes(sortBy) ? sortBy : undefined,
    sortOrder: sortOrder === "asc" || sortOrder === "desc" ? sortOrder : undefined,
    q: first(sp.q)?.trim() || undefined,
  };
}

/** Uses /shipments/search when a text query is present (no pagination), otherwise the paginated list. */
export async function getShipments(query: ShipmentQuery): Promise<{ items: ShipmentListItem[]; meta: Paginated<Shipment>["meta"]; searched: boolean }> {
  if (query.q) {
    const found = await serverFetch<ShipmentListItem[]>("/shipments/search", { query: { q: query.q } });
    const items = query.status ? found.filter((s) => s.status === query.status) : found;
    return { items, meta: { total: items.length, page: 1, limit: items.length || 1, totalPages: 1 }, searched: true };
  }
  const data = await serverFetch<Paginated<ShipmentListItem>>("/shipments", {
    query: { page: query.page, limit: query.limit, status: query.status, sortBy: query.sortBy, sortOrder: query.sortOrder },
  });
  return { ...data, searched: false };
}

export const getShipment = (id: string) => serverFetch<ShipmentDetail>(`/shipments/${id}`);

export const getShipmentCount = async (status?: string) => {
  const data = await serverFetch<Paginated<ShipmentListItem>>("/shipments", { query: { page: 1, limit: 1, status } });
  return data.meta.total;
};

export const getDashboardStats = () => serverFetch<DashboardStats>("/admin/dashboard-stats");

export const getAuditLogs = (query: { page: number; limit: number; entityType?: string }) =>
  serverFetch<Paginated<AuditLog>>("/admin/audit-logs", { query });

export const getUsers = (query: { page: number; limit: number; role?: string; q?: string }) =>
  serverFetch<Paginated<UserRow>>("/admin/users", { query });

export const getHubs = (query: { page: number; limit: number; city?: string }) =>
  serverFetch<Paginated<Hub>>("/hubs", { query });

export const getPayment = (id: string) => serverFetch<Payment>(`/payments/${id}`);
