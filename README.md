# CourierHub — Frontend

Next.js (App Router) frontend for the Courier & Logistics Management Platform. Connects to the deployed backend API and implements distinct workflows for three roles: **Customer**, **Courier ("Provider")**, and **Admin**.

Theme: brown & white, defined as HSL design tokens in `src/app/globals.css` and consumed throughout via Tailwind.

## Tech stack

- **Next.js 15** (App Router), **React 19**, **TypeScript** (strict, no `any`)
- **Tailwind CSS** + custom shadcn/ui-style components on **Radix UI** primitives
- **TanStack Query** (client-side data fetching/caching) + Next.js server-side data fetching for initial page loads
- **Zustand** (global client state: session identity, mobile nav)
- **React Hook Form + Zod** (all forms; validation rules mirror the backend's Zod schemas)
- **Stripe** (`@stripe/react-stripe-js`) — real test-mode checkout, not simulated
- **Recharts** — admin analytics (loaded client-only via `next/dynamic`, see note below)
- **jose** — JWT decoding/verification in middleware (Edge-safe)
- **Sonner** — toast notifications
- **Geist** — font

## Architecture

- **Middleware (`src/middleware.ts`)** guards `/admin`, `/dashboard`, `/provider`, `/payment` by role, silently refreshes an expiring access token using the refresh token, and protects `/api/proxy/*`.
- **BFF pattern**: the browser never holds the JWT. `src/app/api/auth/*` and `src/app/api/proxy/[...path]` run server-side, storing tokens in httpOnly cookies and forwarding `Authorization: Bearer` to the real API.
- **Server Components by default.** Every list/detail page fetches its own data server-side (`src/lib/api/server.ts`, `src/lib/api/queries.ts`) using `cookies()` for the token. `"use client"` is added only where interactivity is required (forms, dropdowns, charts, checkout).
- **URL is the source of truth for list state** — pagination, filters, search, and sort all live in `useSearchParams` via `src/hooks/use-url-state.ts`, so any view is bookmarkable/shareable.
- Every route segment that fetches data has a `loading.tsx` (skeleton) and every layout tier has an `error.tsx` boundary; a global `not-found.tsx` and root `error.tsx` cover the rest.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in API_URL and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
npm run dev                  # http://localhost:3000
```

Production build: `npm run build && npm start`

### Required environment variables

| Variable | Where used | Notes |
|---|---|---|
| `API_URL` | Server-side only | The deployed backend, including `/api/v1` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Browser | Must be from the **same** Stripe account/sandbox as the backend's secret key |
| `JWT_ACCESS_SECRET` | Middleware (optional) | If set to the backend's secret, middleware verifies token signatures instead of just decoding |
| `NEXT_PUBLIC_SITE_URL` | Metadata/sitemap | Your deployed URL |

### Demo accounts (one-click login on `/login`)

| Role | Email | Password |
|---|---|---|
| Admin | `admin@courierhub.com` | `Admin@12345` |
| Customer | `customer@courierhub.com` | `Customer@123` |
| Courier | `courier@courierhub.com` | `Courier@123` |

## One-command verification

```bash
node scripts/verify-frontend.mjs                          # tests localhost:3000
node scripts/verify-frontend.mjs --url=https://your-app.vercel.app
```

Checks: every public page loads, `sitemap.xml`/`robots.txt` are correct, all three protected areas redirect unauthenticated visitors to `/login?next=...`, the API proxy returns a structured 401 with no session, unknown routes 404, all three demo accounts can log in, and each role is redirected away from the other roles' areas while reaching its own.

> This script must be run somewhere with real network access to your backend. See `DEVELOPMENT.md` for why.

## Payment flow

`Checkout` (`src/components/features/payments/checkout.tsx`) calls the backend's `/payments/initiate` to create a real Stripe PaymentIntent, then renders Stripe's `PaymentElement`. On submit, `stripe.confirmPayment()` redirects the browser to `/payment/success` (or Stripe redirects to `/payment/cancel` logic is handled by the user backing out). The backend's webhook — not this frontend — is the source of truth for the payment actually being marked `PAID`; the success page is a UI confirmation, not the source of truth.

## Known environment-specific notes

- `recharts` bundles its own `react-is@18.x`, which breaks Next 15 + React 19's server-side page-data collection during `next build`. Fixed by loading the two chart components exclusively through `next/dynamic` with `ssr: false` (`src/app/admin/charts-client.tsx`) so they only ever execute in the browser.
- This project's build was verified in a sandboxed environment whose network allowlist blocks `*.onrender.com`. All build-time checks (TypeScript, ESLint, `next build`, middleware/route-protection behavior) were verified there against a real running server; anything requiring an actual round-trip to the live backend (login, dashboard data, checkout) could not be exercised in that sandbox and should be verified with `scripts/verify-frontend.mjs` from a machine with normal network access. See `DEVELOPMENT.md`.
