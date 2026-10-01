import "server-only";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { API_URL, COOKIES } from "@/lib/config";
import { ApiError } from "@/lib/api/errors";
import type { ApiEnvelope } from "@/lib/types";

type QueryValue = string | number | boolean | undefined | null;
export type Query = Record<string, QueryValue>;

export interface ServerFetchOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Query;
}

export function buildQuery(query?: Query) {
  if (!query) return "";
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null || v === "") continue;
    p.set(k, String(v));
  }
  const s = p.toString();
  return s ? `?${s}` : "";
}

/**
 * Server-side call to the backend. Attaches the Bearer token from the httpOnly
 * cookie. 401 -> clear session, 404 -> not-found page, other failures throw
 * ApiError to be caught by the nearest error.tsx boundary.
 */
export async function serverFetch<T>(path: string, options: ServerFetchOptions = {}): Promise<T> {
  const jar = await cookies();
  const token = jar.get(COOKIES.access)?.value;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}${buildQuery(options.query)}`, {
      method: options.method ?? "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      cache: "no-store",
      signal: AbortSignal.timeout(55_000),
    });
  } catch {
    throw new ApiError(503, "The API is unreachable. It may be waking up - please retry.");
  }

  const json = (await res.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (res.status === 401) redirect("/api/auth/expired");
  if (res.status === 404) notFound();
  if (!res.ok || !json?.success) {
    throw new ApiError(res.status, json?.message ?? "Request failed", json?.errors ?? []);
  }
  return json.data;
}
