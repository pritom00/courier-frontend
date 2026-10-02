import { NextResponse, type NextRequest } from "next/server";
import { API_URL, COOKIES } from "@/lib/config";

// Only these backend areas are reachable through the proxy (auth is handled by /api/auth/*).
const ALLOWED = new Set(["users", "hubs", "shipments", "payments", "admin"]);

async function handler(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;

  if (!path.length || !ALLOWED.has(path[0]) || path.some((s) => s === "." || s === ".." || s.includes("\\"))) {
    return NextResponse.json({ success: false, message: "Route not allowed", errors: [] }, { status: 403 });
  }

   // CSRF defence in depth (cookies are SameSite=Lax): state-changing calls must be same-site.
  // Compared by hostname only (not full origin) because Render terminates TLS at its edge and
  // forwards internally over plain HTTP, so req.nextUrl's computed protocol can be "http" even
  // though the browser's real, correct Origin header says "https" - comparing full origins would
  // incorrectly block legitimate same-site requests in that setup.
  if (req.method !== "GET") {
    const origin = req.headers.get("origin");
    if (origin) {
      let originHost = "";
      try {
        originHost = new URL(origin).host;
      } catch {
        originHost = "";
      }
      if (originHost !== req.nextUrl.host) {
        return NextResponse.json({ success: false, message: "Cross-origin request blocked", errors: [] }, { status: 403 });
      }
    }
  }

  const token = req.cookies.get(COOKIES.access)?.value;
  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  const target = `${API_URL}/${path.map(encodeURIComponent).join("/")}${req.nextUrl.search}`;

  try {
    const upstream = await fetch(target, {
      method: req.method,
      headers: {
        ...(hasBody ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: hasBody ? await req.text() : undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(55_000),
    });
    const text = await upstream.text();
    return new NextResponse(text, { status: upstream.status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ success: false, message: "The API is unreachable. Please retry.", errors: [] }, { status: 503 });
  }
}

export { handler as GET, handler as POST, handler as PATCH, handler as PUT, handler as DELETE };
