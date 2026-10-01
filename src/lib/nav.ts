import type { Role } from "@/lib/types";

export type IconName =
  | "dashboard"
  | "package"
  | "plus"
  | "card"
  | "user"
  | "users"
  | "hub"
  | "logs"
  | "chart"
  | "truck";

export interface NavItem {
  href: string;
  label: string;
  icon: IconName;
}

export const NAV: Record<Role, NavItem[]> = {
  ADMIN: [
    { href: "/admin", label: "Overview", icon: "dashboard" },
    { href: "/admin/manage", label: "Shipments", icon: "package" },
    { href: "/admin/hubs", label: "Hubs", icon: "hub" },
    { href: "/admin/users", label: "Users", icon: "users" },
    { href: "/admin/reports", label: "Audit logs", icon: "logs" },
    { href: "/admin/profile", label: "Profile", icon: "user" },
  ],
  CUSTOMER: [
    { href: "/dashboard", label: "My shipments", icon: "package" },
    { href: "/dashboard/shipments/new", label: "New shipment", icon: "plus" },
    { href: "/dashboard/payments", label: "Payments", icon: "card" },
    { href: "/dashboard/profile", label: "Profile", icon: "user" },
  ],
  COURIER: [
    { href: "/provider", label: "My deliveries", icon: "truck" },
    { href: "/provider/earnings", label: "Performance", icon: "chart" },
    { href: "/provider/profile", label: "Profile", icon: "user" },
  ],
};

export const SHIPMENT_BASE: Record<Role, string> = {
  ADMIN: "/admin/shipments",
  CUSTOMER: "/dashboard/shipments",
  COURIER: "/provider/shipments",
};
