import { NextResponse, type NextRequest } from "next/server";
import { API_URL, COOKIES, ROLE_HOME } from "@/lib/config";
import { authCookies, clearedCookies, type TokenPair } from "@/lib/auth/cookies";
import { readToken, type TokenClaims } from "@/lib/auth/token";
import type { Role } from "@/lib/types";

const GUARDS: { prefix: string; role: Role }[] = [
  { prefix: "/admin", role: "ADMIN" },
  { prefix: "/dashboard", role: "CUSTOMER" },
  { prefix: "/provider", role: "COURIER" },
  { prefix: "/payment", role: "CUSTOMER" },
];
const AUTH_PAGES = ["/login", "/register"];
const REFRESH_WINDOW_SECONDS = 30;

async function refreshTokens(refreshToken: string): Promise<TokenPair | null> {
  try {
    const res = await fetch(`${API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: { accessToken?: unknown; refreshToken?: unknown } };
    const { accessToken, refreshToken: next } = json.data ?? {};
    if (typeof accessToken === "string" && typeof next === "string") return { accessToken, refreshToken: next };
    return null;
  } catch {
    return null;
  }
}

/** Forward refreshed tokens to Server Components / route handlers handling this same request. */
function requestHeadersWith(req: NextRequest, tokens: TokenPair | null, clear: boolean) {
  const headers = new Headers(req.headers);
  if (!tokens && !clear) return headers;
  const jar = new Map(req.cookies.getAll().map((c) => [c.name, c.value]));
  if (tokens) {
    jar.set(COOKIES.access, tokens.accessToken);
    jar.set(COOKIES.refresh, tokens.refreshToken);
  } else {
    jar.delete(COOKIES.access);
    jar.delete(COOKIES.refresh);
  }
  headers.set("cookie", [...jar].map(([k, v]) => `${k}=${v}`).join("; "));
  return headers;
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const access = req.cookies.get(COOKIES.access)?.value;
  const refresh = req.cookies.get(COOKIES.refresh)?.value;
  const now = Math.floor(Date.now() / 1000);

  let claims: TokenClaims | null = access ? await readToken(access) : null;
  let fresh: TokenPair | null = null;

  // Silent refresh when the access token is missing, expired, or about to expire.
  if ((!claims || claims.exp - now < REFRESH_WINDOW_SECONDS) && refresh) {
    const tokens = await refreshTokens(refresh);
    const next = tokens ? await readToken(tokens.accessToken) : null;
    if (tokens && next) {
      claims = next;
      fresh = tokens;
    }
  }

  const stale = !claims && Boolean(access || refresh);
  const redirectTo = (path: string) => NextResponse.redirect(new URL(path, req.url));

  let response: NextResponse;
  const isApi = pathname.startsWith("/api/");

  if (isApi) {
    response = claims
      ? NextResponse.next({ request: { headers: requestHeadersWith(req, fresh, false) } })
      : NextResponse.json({ success: false, message: "Not authenticated", errors: [] }, { status: 401 });
  } else if (AUTH_PAGES.includes(pathname)) {
    response = claims ? redirectTo(ROLE_HOME[claims.role]) : NextResponse.next({ request: { headers: requestHeadersWith(req, null, stale) } });
  } else if (!claims) {
    response = redirectTo(`/login?next=${encodeURIComponent(pathname + search)}`);
  } else {
    const guard = GUARDS.find((g) => pathname === g.prefix || pathname.startsWith(`${g.prefix}/`));
    response =
      guard && guard.role !== claims.role
        ? redirectTo(ROLE_HOME[claims.role])
        : NextResponse.next({ request: { headers: requestHeadersWith(req, fresh, false) } });
  }

  if (fresh && claims) {
    for (const c of authCookies(fresh, claims.exp)) response.cookies.set(c);
  } else if (stale) {
    for (const c of clearedCookies()) response.cookies.set(c);
  }
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/provider/:path*", "/payment/:path*", "/login", "/register", "/api/proxy/:path*"],
};
