import { decodeJwt, jwtVerify } from "jose";
import type { Role } from "@/lib/types";

export interface TokenClaims {
  userId: string;
  role: Role;
  exp: number;
}

const ROLES: Role[] = ["CUSTOMER", "COURIER", "ADMIN"];

/**
 * Reads and validates an access token. Edge-safe (used by middleware).
 * - If JWT_ACCESS_SECRET is configured the signature is verified.
 * - Otherwise the payload is decoded only; the backend still enforces
 *   authentication/authorization on every API call.
 * Expired or malformed tokens return null.
 */
export async function readToken(token: string): Promise<TokenClaims | null> {
  try {
    const secret = process.env.JWT_ACCESS_SECRET;
    const payload = secret ? (await jwtVerify(token, new TextEncoder().encode(secret))).payload : decodeJwt(token);
    const { userId, role, exp } = payload as { userId?: unknown; role?: unknown; exp?: unknown };
    if (typeof userId !== "string" || typeof exp !== "number") return null;
    if (typeof role !== "string" || !ROLES.includes(role as Role)) return null;
    if (exp <= Math.floor(Date.now() / 1000)) return null;
    return { userId, role: role as Role, exp };
  } catch {
    return null;
  }
}
