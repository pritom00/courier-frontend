import { NextResponse, type NextRequest } from "next/server";
import { clearedCookies } from "@/lib/auth/cookies";

/** Landing point when the backend rejects a token: clears cookies (avoids a redirect loop) and returns to login. */
export function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/login?reason=expired", req.url));
  for (const c of clearedCookies()) res.cookies.set(c);
  return res;
}
