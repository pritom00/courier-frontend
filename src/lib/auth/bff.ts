import "server-only";
import { NextResponse } from "next/server";
import { API_URL, ROLE_HOME } from "@/lib/config";
import { authCookies } from "@/lib/auth/cookies";
import { readToken } from "@/lib/auth/token";
import type { Role, SessionUser } from "@/lib/types";

interface UpstreamAuthData {
  user?: { id?: string; name?: string; email?: string; role?: Role; phone?: string | null };
  accessToken?: string;
  refreshToken?: string;
}

/** Calls a backend auth endpoint and, on success, stores the tokens as httpOnly cookies. */
export async function authenticateWith(path: "/auth/login" | "/auth/register", payload: unknown) {
  let upstream: Response;
  try {
    upstream = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(55_000),
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "The API is unreachable. It may be waking up - please retry in a few seconds.", errors: [] },
      { status: 503 },
    );
  }

  const json = (await upstream.json().catch(() => null)) as
    | { success?: boolean; message?: string; data?: UpstreamAuthData; errors?: unknown[] }
    | null;

  if (!upstream.ok || !json?.success) {
    return NextResponse.json(
      { success: false, message: json?.message ?? "Authentication failed", errors: json?.errors ?? [] },
      { status: upstream.status || 500 },
    );
  }

  const data = json.data ?? {};
  const user = data.user;
  // e.g. if the API is later configured to require email verification, no tokens are issued at registration.
  if (!data.accessToken || !data.refreshToken || !user?.id || !user.role) {
    return NextResponse.json({ success: true, message: json.message ?? "Registration successful", data: { user: null, redirectTo: "/login" } });
  }

  const claims = await readToken(data.accessToken);
  const safeUser: SessionUser = {
    id: user.id,
    name: user.name ?? "",
    email: user.email ?? "",
    role: user.role,
    phone: user.phone ?? null,
  };
  const res = NextResponse.json({
    success: true,
    message: json.message ?? "Success",
    data: { user: safeUser, redirectTo: ROLE_HOME[user.role] },
  });
  for (const c of authCookies({ accessToken: data.accessToken, refreshToken: data.refreshToken }, claims?.exp)) res.cookies.set(c);
  return res;
}
