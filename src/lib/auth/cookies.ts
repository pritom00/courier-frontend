import { COOKIES, REFRESH_MAX_AGE } from "@/lib/config";

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface CookieSpec {
  name: string;
  value: string;
  httpOnly: true;
  sameSite: "lax";
  secure: boolean;
  path: "/";
  maxAge: number;
}

const base = () => ({
  httpOnly: true as const,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/" as const,
});

export function authCookies(tokens: TokenPair, accessExp?: number): CookieSpec[] {
  const now = Math.floor(Date.now() / 1000);
  const accessMaxAge = accessExp ? Math.max(accessExp - now, 60) : 15 * 60;
  return [
    { name: COOKIES.access, value: tokens.accessToken, maxAge: accessMaxAge, ...base() },
    { name: COOKIES.refresh, value: tokens.refreshToken, maxAge: REFRESH_MAX_AGE, ...base() },
  ];
}

export function clearedCookies(): CookieSpec[] {
  return [
    { name: COOKIES.access, value: "", maxAge: 0, ...base() },
    { name: COOKIES.refresh, value: "", maxAge: 0, ...base() },
  ];
}
