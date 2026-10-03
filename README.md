# CourierHub — Frontend

Next.js (App Router) frontend for the **Courier & Logistics Management Platform**.

Customers book and pay for shipments, couriers update delivery status, and admins manage hubs, assignments, users, and reports. The UI provides **three distinct role-based workflows** with protected routes, real API data, and Stripe test-mode payments.

---

## Live links

| Item | URL |
|------|-----|
| **Live Frontend** | https://courier-frontend-hi8r.onrender.com |
| **Backend API** | https://courier-logistics-platform.onrender.com |
| **API Docs (Swagger)** | https://courier-logistics-platform.onrender.com/api-docs |
| **Backend Health** | https://courier-logistics-platform.onrender.com/health |
| **Frontend Repository** | https://github.com/pritom00/courier-frontend |
| **Backend Repository** | https://github.com/pritom00/courier-logistics-platform |

> **Render free tier note:** The backend may sleep after inactivity. If demo login fails at first, open the [health endpoint](https://courier-logistics-platform.onrender.com/health), wait for a JSON response (about 20–40 seconds), then try login again on the frontend.

---

## Demo accounts

One-click **Demo Login** buttons are available on the login page for all three roles.

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@courierhub.com` | `Admin@12345` |
| **Customer** | `customer@courierhub.com` | `Customer@123` |
| **Courier** | `courier@courierhub.com` | `Courier@123` |

---

## Features

- Distinct dashboards for **Customer**, **Courier (Provider)**, and **Admin**
- Secure auth via **httpOnly cookies** (BFF pattern — JWT never stored in localStorage)
- Middleware route protection and role-based redirects
- One-click demo login for evaluators
- Real backend API integration (no mock core data)
- URL-synced search, filters, sort, and pagination
- Multi-step **Create Shipment** wizard
- **Stripe** test-mode checkout (success / cancel handling)
- Admin analytics charts (Recharts)
- Loading skeletons, empty states, error boundaries, and toast notifications
- Mobile-first responsive layout

---

## Tech stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS, Radix UI / shadcn-style components |
| Server state | TanStack Query + Next.js server-side fetching |
| Client state | Zustand |
| Forms | React Hook Form + Zod |
| Auth | Custom JWT via httpOnly cookies + middleware |
| Payments | Stripe (`@stripe/react-stripe-js`) — test mode |
| Charts | Recharts (client-only) |
| Toasts | Sonner |
| Icons / font | Lucide React, Geist |

---

## Architecture

- **Middleware (`src/middleware.ts`)** — Guards `/admin`, `/dashboard`, `/provider`, and `/payment` by role. Supports silent token refresh.
- **BFF pattern** — `src/app/api/auth/*` and `src/app/api/proxy/[...path]` run on the server, attach tokens from httpOnly cookies, and forward requests to the backend.
- **Server Components by default** — List and detail pages fetch data on the server. `"use client"` is used only for interactive UI (forms, filters, checkout, charts).
- **URL as source of truth** — Search, status filters, sort, and pagination live in the query string via `useSearchParams` / `useUrlState`.
- **Resilience** — `loading.tsx` skeletons, `error.tsx` boundaries, custom `not-found`, and Sonner toasts for API errors.

---

## Project structure

```text
src/
  app/
    (marketing)/     # Public pages: home, about, services, pricing, contact
    (auth)/          # Login, register
    admin/           # Admin dashboard, manage, reports, hubs, profile
    dashboard/       # Customer shipments, payments, profile
    provider/        # Courier deliveries, earnings, profile
    payment/         # success / cancel
    api/             # BFF: auth + proxy
  components/        # UI + feature components
  hooks/             # useUrlState and shared hooks
  lib/               # api client, auth, validators, types, config
middleware.ts        # Role-based route protection

Main routesArea
Path
Access
Home
/
Public
About
/about
Public
Services
/services
Public
Pricing
/pricing
Public
Contact
/contact
Public
Login
/login
Public (demo buttons)
Register
/register
Public
Customer dashboard
/dashboard
Customer
Customer payments
/dashboard/payments
Customer
Customer profile
/dashboard/profile
Customer
Courier deliveries
/provider
Courier
Courier earnings
/provider/earnings
Courier
Courier profile
/provider/profile
Courier
Admin overview
/admin
Admin
Admin manage
/admin/manage
Admin
Admin reports
/admin/reports
Admin
Payment success
/payment/success
Customer
Payment cancel
/payment/cancel
Customer

Getting started (local)bash

npm install
cp .env.example .env.local

Fill in environment variables (see below), then:bash

npm run dev

App runs at http://localhost:3000.Production build:bash

npm run build && npm start

Environment variablesVariable
Required
Description
API_URL
Yes
Backend API base URL including /api/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
Yes
Stripe publishable key (same account as backend secret)
NEXT_PUBLIC_SITE_URL
Recommended
Public site URL (metadata, sitemap)
NEXT_PUBLIC_CONTACT_EMAIL
Optional
Contact page email
JWT_ACCESS_SECRET
Optional
If set, middleware verifies JWT signatures

Example:env

API_URL=https://courier-logistics-platform.onrender.com/api/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxx
NEXT_PUBLIC_SITE_URL=https://courier-frontend-hi8r.onrender.com

Payment flowCustomer creates a shipment (multi-step wizard).
On the shipment detail page, click Pay now.
Frontend calls POST /payments/initiate and renders Stripe Payment Element.
Pay with test card: 4242 4242 4242 4242 (any future expiry, any CVC).
Browser redirects to /payment/success (or cancel route if abandoned).
Stripe webhook on the backend marks the payment as PAID (source of truth).

Verification scriptbash

# Local
node scripts/verify-frontend.mjs

# Live
node scripts/verify-frontend.mjs --url=https://courier-frontend-hi8r.onrender.com

Checks public pages, SEO files, unauthenticated redirects, proxy 401 behavior, and demo logins (backend must be awake).Roles at a glanceRole
Can do
Customer
Create/edit shipments, pay, view payments, update profile
Courier
View assigned deliveries, update delivery status, profile
Admin
Dashboard stats, manage resources, assign couriers, hubs, users, audit logs

Role access is enforced in middleware and reflected in sidebar / navigation UI.DesignTheme: brown & white (HSL design tokens in src/app/globals.css)
Utility-first styling with Tailwind CSS
Shared components: tables, filters, status badges, skeletons, page headers
Responsive: mobile-first layouts for all major dashboards

Related backendItem
URL
Repo
https://github.com/pritom00/courier-logistics-platform
Live API
https://courier-logistics-platform.onrender.com
Swagger
https://courier-logistics-platform.onrender.com/api-docs

Backend stack: Node.js, Express, TypeScript, PostgreSQL, Prisma, Zod, JWT, Stripe, Redis.LicenseMIT

