import { ApiError } from "@/lib/api/errors";
import type { ApiEnvelope } from "@/lib/types";

export interface ClientFetchOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
}

/** Browser-side call. Goes through the Next.js BFF proxy, which attaches the httpOnly-cookie token. */
export async function api<T>(path: string, options: ClientFetchOptions = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api/proxy${path}`, {
      method: options.method ?? "GET",
      headers: options.body === undefined ? undefined : { "Content-Type": "application/json" },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch {
    throw new ApiError(503, "Network error. Check your connection and retry.");
  }

  const json = (await res.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (res.status === 401 && typeof window !== "undefined") {
    window.location.assign("/api/auth/expired");
  }
  if (!res.ok || !json?.success) {
    throw new ApiError(res.status, json?.message ?? "Request failed", json?.errors ?? []);
  }
  return json.data;
}
