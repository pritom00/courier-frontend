import type { Role } from "@/lib/types";

/** Backend base URL (server-side only). Includes the /api/v1 prefix. */
export const API_URL = (process.env.API_URL ?? "https://courier-logistics-platform.onrender.com/api/v1").replace(/\/$/, "");

export const COOKIES = { access: "access_token", refresh: "refresh_token" } as const;

export const REFRESH_MAX_AGE = 60 * 60 * 24 * 30; // matches backend JWT_REFRESH_EXPIRES_IN (30d)

export const ROLE_HOME: Record<Role, string> = {
  ADMIN: "/admin",
  CUSTOMER: "/dashboard",
  COURIER: "/provider",
};

export const SITE_NAME = "CourierHub";

export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "pritomofficial00@gmail.com";
