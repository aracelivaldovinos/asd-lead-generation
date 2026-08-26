# ASD Lead Generation

Education lead generation platform that connects prospective students to schools. It powers the school discovery and RFI (Request for Information) conversion funnel — both as an embeddable widget for publisher sites and as a standalone Next.js web app.

## What it does

- Displays school program listings fetched from an upstream API
- Collects RFI form submissions and routes them through a multi-step flow
- Supports a CTA pre-filter (postal code, graduation year, education level) before showing listings
- Tracks attribution (UTM params, market context) and writes a preping cookie on submission

---

## Monorepo Structure

```
apps/
  web/        — Next.js 16 app (SSR listings page + BFF API routes)
  widget/     — Vite IIFE bundle (embeddable on third-party sites)

packages/
  domain/     — Pure TypeScript: types, transforms, business logic (no framework deps)
  services/   — React Query hooks wrapping the BFF API
  ui/         — React + Tailwind component library (shared by web and widget)
```

### Package dependency graph

```
domain ← services ← ui ← web
                         ← widget
```

`domain` has zero runtime dependencies — all business rules live here and are fully unit testable. `services` wraps the BFF with React Query. `ui` contains all React components. Both `web` and `widget` consume all three packages.

---

## Prerequisites

- **Node.js** 18+
- **pnpm** 10 — install with `npm i -g pnpm@10`

---

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Set up environment variables

Create `apps/web/.env.local` with the following variables:

| Variable | Description |
|---|---|
| `API_BASE_URL` | Upstream provider API base URL |
| `NEXT_PUBLIC_APP_URL` | Public URL of the web app (e.g. `http://localhost:3000`) |
| `SITE_KEY` | Site identifier sent to the upstream API |
| `REDIRECT_SERVER` | Click tracking redirect URL |
| `DEV_POSTAL_CODE` | Fallback postal code for local geo (no Vercel headers locally) |
| `DEV_CITY` | Fallback city for local geo |
| `DEV_STATE` | Fallback state for local geo |
| `THANK_YOU_PROVIDERS` | Comma-separated provider bands shown on the thank you screen (e.g. `zeta,mm,eddy`) |
| `REAL_TIME_PHONE_URL` | Phone validation API endpoint |
| `REAL_TIME_PHONE_TOKEN` | Phone validation API token |
| `NEUTRINO_API_USER_ID` | Email validation API user |
| `NEUTRINO_API_EMAIL_VALIDATION_API_KEY` | Email validation API key |

> Phone and email validation only run in `NODE_ENV=production`. Locally they always pass.

### 3. Run the web app

```bash
pnpm --filter web dev
```

App runs at [http://localhost:3000](http://localhost:3000).

### 4. Run the widget (dev build)

The widget doesn't have a dev server — build it and point it at your local web app:

```bash
# Set the API URL the widget will call
echo "VITE_API_URL=http://localhost:3000" > apps/widget/.env.local

pnpm --filter widget build
```

Output: `apps/widget/dist/widget.js` (single IIFE file with CSS injected).

---

## Running all packages at once

```bash
pnpm dev
```

Turborepo runs `dev` in all apps in parallel.

---

## Testing

```bash
# Run all tests
pnpm test

# Run tests for a specific package
pnpm --filter @asd/ui test --run
pnpm --filter @asd/domain test --run
pnpm --filter web test --run
```

> Tests use Vitest. The `packages/domain` build must be up to date before running web tests — `pnpm test` handles this automatically via Turborepo's `dependsOn` config.

---

## Storybook (UI components)

```bash
pnpm --filter @asd/ui storybook
```

Runs at [http://localhost:6006](http://localhost:6006).

---

## Building for production

```bash
pnpm build
```

Turborepo resolves build order automatically (`domain` → `services` → `ui` → `web` + `widget`).

---

## Widget Embed Usage

Include the built `widget.js` on any page and mount widgets using CSS class selectors and `data-` attributes:

```html
<script src="https://your-cdn.com/widget.js" defer></script>

<!-- CTA widget (pre-filter form) -->
<div
  class="asd-cta-widget"
  data-api-url="https://your-web-app.com"
  data-title="Find Your Program"
  data-button-label="Search Schools"
  data-question-keys="postalCode,hsGraduation,education"
></div>

<!-- Listings widget -->
<div
  class="asd-listings-widget"
  data-api-url="https://your-web-app.com"
></div>
```

Attribution params are read from a `window.ASD_SETTINGS` object or from URL query params:

```html
<script>
  window.ASD_SETTINGS = {
    marketContext: "allcollegesearch",
    utm_medium: "direct",
    utm_source: "organic",
  };
</script>
```

---

## API Routes (BFF)

All upstream provider calls are proxied through the Next.js app — the widget and browser never call the upstream API directly.

| Route | Method | Description |
|---|---|---|
| `/api/filters` | GET | Returns filter options and pre-filter questions |
| `/api/listings` | GET | Returns school program listings |
| `/api/rfi` | GET | Fetches RFI form questions for a program |
| `/api/rfi/[programId]` | POST | Submits an RFI form |
| `/api/geo` | GET | Returns geo data (postal code, city, state) |
| `/api/email-phone/check` | POST | Validates email address and phone number |

---

## Key Architectural Decisions

**Domain package as single source of truth.** All business logic (banding, transforms, constants) lives in `packages/domain` with zero framework dependencies. Business rule changes only touch one package.

**BFF pattern.** The widget and web app call the Next.js BFF, not the upstream provider API directly. The BFF handles session cookies (`asd_s_meta`), fingerprinting (`x-asd-fp`), geo enrichment, and response transformation.

**Progressive loading on web.** The server fetches only the primary provider group (group 1) for fast SSR. The client fires group 2 in the background. `initialData` seeds group 1 from SSR so there's no double-fetch on load.

**Shared components.** `packages/ui` is consumed by both the Next.js app and the Vite widget — no component duplication. Tailwind is compiled separately per app using their own configs that point at `packages/ui/src`.
