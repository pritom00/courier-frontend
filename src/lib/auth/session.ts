import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIES, ROLE_HOME } from "@/lib/config";
import { readToken, type TokenClaims } from "@/lib/auth/token";
import type { Role } from "@/lib/types";

export async function getSession(): Promise<TokenClaims | null> {
  const jar = await cookies();
  const token = jar.get(COOKIES.access)?.value;
  return token ? readToken(token) : null;
}

/** Defence in depth on top of middleware: ensure the visitor holds the required role. */
export async function requireRole(role: Role): Promise<TokenClaims> {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== role) redirect(ROLE_HOME[session.role]);
  return session;
}

export const getCachedSession = cache(getSession);
