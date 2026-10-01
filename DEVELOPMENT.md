# Development notes

## Local setup checklist

1. `npm install`
2. Copy `.env.example` to `.env.local`, fill in `API_URL` (your deployed backend) and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (test-mode publishable key, same Stripe account as the backend's secret key)
3. `npm run dev`

## Why some things can only be verified on your machine

This project was built and iterated on inside a sandboxed container whose network egress allowlist only permits a fixed set of package-registry domains (npm, GitHub, PyPI, etc.) — it does **not** permit reaching `onrender.com`, which is where the backend for this project is deployed. Every check that doesn't require a live backend round-trip (TypeScript, ESLint, the full `next build`, and all middleware/route-protection behavior) was verified there against a real running `next start` server. Login, dashboard data rendering, shipment creation, and Stripe checkout could not be exercised from that sandbox and were not just assumed correct — they're implemented against the documented, already-tested backend contract, but you should run `node scripts/verify-frontend.mjs` yourself once, pointed at your real API, before considering the integration proven.

## Testing the Stripe flow

1. Get a **publishable** test key (`pk_test_...`) from the same Stripe account as the backend's `STRIPE_SECRET_KEY`.
2. Set `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in `.env.local`.
3. Create a shipment as the demo customer, go to pay, and use a [Stripe test card](https://docs.stripe.com/testing) (e.g. `4242 4242 4242 4242`, any future expiry, any CVC).
4. The backend's webhook (configured separately, see the backend repo) is what actually marks the payment `PAID` — the `/payment/success` page you land on is a UI confirmation, not the source of truth.

## Adding a new protected page

1. Put it under the right route group: `dashboard/` (Customer), `admin/` (Admin), `provider/` (Courier).
2. The route group's `layout.tsx` already calls `requireRole(...)` — you get auth for free.
3. Fetch data with `serverFetch` (`src/lib/api/server.ts`) in an `async` Server Component. Wrap it in `<Suspense>` with a skeleton from `src/components/shared/skeletons.tsx` if the parent page renders instantly around it.
4. For anything interactive (forms, dropdowns), use the mutation helpers in `src/lib/api/mutations.ts`, which go through the browser-side `api()` client → `/api/proxy/*` → backend.

## Useful commands

- `npm run typecheck` — `tsc --noEmit` (note: needs a prior `next build` or `next dev` run once, so `next-env.d.ts`/`.next/types` exist)
- `npm run lint` — ESLint, zero warnings expected
- `node scripts/verify-frontend.mjs` — end-to-end smoke test (see README)
