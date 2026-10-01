/**
 * verify-frontend.mjs
 * ------------------------------------------------------------------
 * One-command smoke test for the frontend. Run this against your OWN
 * running instance (local dev/start, or your deployed Vercel URL) -
 * it cannot be run from a restricted sandbox since it needs to reach
 * both the frontend and, through it, the real backend.
 *
 * Usage:
 *   npm run dev            (in one terminal)
 *   node scripts/verify-frontend.mjs               (tests localhost:3000)
 *   node scripts/verify-frontend.mjs --url=https://your-app.vercel.app
 * ------------------------------------------------------------------
 */

const arg = process.argv.find((a) => a.startsWith("--url="));
const BASE = arg ? arg.split("=")[1].replace(/\/$/, "") : "http://localhost:3000";

let pass = 0;
let fail = 0;
const failures = [];

function check(label, condition, extra = "") {
  if (condition) {
    pass++;
    console.log(`  \x1b[32m\u2713\x1b[0m ${label}`);
  } else {
    fail++;
    failures.push(label + (extra ? ` (${extra})` : ""));
    console.log(`  \x1b[31m\u2717\x1b[0m ${label}${extra ? " - " + extra : ""}`);
  }
}

function getCookie(setCookieHeaders, name) {
  for (const h of setCookieHeaders ?? []) {
    const m = h.match(new RegExp(`${name}=([^;]+)`));
    if (m) return `${name}=${m[1]}`;
  }
  return null;
}

async function fetchNoRedirect(path, opts = {}) {
  return fetch(`${BASE}${path}`, { redirect: "manual", ...opts });
}

async function loginAs(email, password) {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json().catch(() => null);
  const setCookie = res.headers.getSetCookie ? res.headers.getSetCookie() : [res.headers.get("set-cookie")].filter(Boolean);
  const access = getCookie(setCookie, "access_token");
  const refresh = getCookie(setCookie, "refresh_token");
  const cookieHeader = [access, refresh].filter(Boolean).join("; ");
  return { ok: res.ok && json?.success, json, cookieHeader };
}

async function main() {
  console.log(`\nRunning frontend verification against: ${BASE}\n`);

  console.log("Public pages");
  for (const path of ["/", "/about", "/services", "/pricing", "/contact", "/login", "/register"]) {
    const res = await fetch(`${BASE}${path}`);
    check(`GET ${path} -> 200`, res.status === 200);
  }

  console.log("\nSEO / metadata");
  const sitemapRes = await fetch(`${BASE}/sitemap.xml`);
  check("GET /sitemap.xml -> 200", sitemapRes.status === 200);
  const robotsRes = await fetch(`${BASE}/robots.txt`);
  const robotsText = await robotsRes.text();
  check("GET /robots.txt -> 200", robotsRes.status === 200);
  check("robots.txt disallows /admin, /dashboard, /provider", ["/admin", "/dashboard", "/provider"].every((p) => robotsText.includes(p)));

  console.log("\nRoute protection (no session)");
  for (const [path, expectedNext] of [["/dashboard", "%2Fdashboard"], ["/admin", "%2Fadmin"], ["/provider", "%2Fprovider"]]) {
    const res = await fetchNoRedirect(path);
    const location = res.headers.get("location") ?? "";
    check(`GET ${path} (no session) -> 307 to /login`, res.status === 307 && location.includes("/login"));
    check(`  ...preserves ?next=${expectedNext}`, location.includes(expectedNext));
  }
  const proxyRes = await fetch(`${BASE}/api/proxy/users/me`);
  const proxyJson = await proxyRes.json().catch(() => null);
  check("GET /api/proxy/users/me (no session) -> 401 structured error", proxyRes.status === 401 && proxyJson?.success === false);

  console.log("\n404 handling");
  const notFoundRes = await fetch(`${BASE}/this-route-does-not-exist`);
  check("GET /unknown-route -> 404", notFoundRes.status === 404);

  console.log("\nAuth: demo logins (requires the real backend to be reachable)");
  const admin = await loginAs("admin@courierhub.com", "Admin@12345");
  check("Demo login as Admin succeeds", admin.ok, admin.json?.message);
  const customer = await loginAs("customer@courierhub.com", "Customer@123");
  check("Demo login as Customer succeeds", customer.ok, customer.json?.message);
  const courier = await loginAs("courier@courierhub.com", "Courier@123");
  check("Demo login as Courier succeeds", courier.ok, courier.json?.message);

  if (admin.ok) {
    console.log("\nRole-based access (Admin session)");
    const adminPage = await fetchNoRedirect("/admin", { headers: { cookie: admin.cookieHeader } });
    check("Admin session -> /admin loads (200)", adminPage.status === 200);
    const wrongDash = await fetchNoRedirect("/dashboard", { headers: { cookie: admin.cookieHeader } });
    check("Admin session -> /dashboard redirects away (wrong role)", wrongDash.status === 307 && (wrongDash.headers.get("location") ?? "").includes("/admin"));
    const me = await fetch(`${BASE}/api/proxy/users/me`, { headers: { cookie: admin.cookieHeader } });
    const meJson = await me.json().catch(() => null);
    check("Admin /api/proxy/users/me returns real profile", me.ok && meJson?.data?.role === "ADMIN");
  }

  if (customer.ok) {
    console.log("\nRole-based access (Customer session)");
    const dash = await fetchNoRedirect("/dashboard", { headers: { cookie: customer.cookieHeader } });
    check("Customer session -> /dashboard loads (200)", dash.status === 200);
    const wrongAdmin = await fetchNoRedirect("/admin", { headers: { cookie: customer.cookieHeader } });
    check("Customer session -> /admin redirects away (wrong role)", wrongAdmin.status === 307);
    const newShipmentPage = await fetchNoRedirect("/dashboard/shipments/new", { headers: { cookie: customer.cookieHeader } });
    check("Customer session -> /dashboard/shipments/new loads (200)", newShipmentPage.status === 200);
  }

  if (courier.ok) {
    console.log("\nRole-based access (Courier session)");
    const prov = await fetchNoRedirect("/provider", { headers: { cookie: courier.cookieHeader } });
    check("Courier session -> /provider loads (200)", prov.status === 200);
  }

  console.log("\n" + "=".repeat(50));
  console.log(`RESULTS: ${pass} passed, ${fail} failed`);
  console.log("=".repeat(50));
  if (failures.length) {
    console.log("\nFailed checks:");
    failures.forEach((f) => console.log(`  - ${f}`));
    process.exitCode = 1;
  } else {
    console.log("\nAll checks passed. \u2705");
  }
}

main().catch((err) => {
  console.error("\nScript crashed:", err.message);
  process.exit(1);
});
