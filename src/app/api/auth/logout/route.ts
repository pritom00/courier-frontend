import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_URL, COOKIES } from "@/lib/config";
import { clearedCookies } from "@/lib/auth/cookies";

export async function POST() {
  const jar = await cookies();
  const token = jar.get(COOKIES.access)?.value;
  if (token) {
    // Best effort: invalidate the stored refresh token on the backend.
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    }).catch(() => null);
  }
  const res = NextResponse.json({ success: true, message: "Logged out", data: {} });
  for (const c of clearedCookies()) res.cookies.set(c);
  return res;
}
