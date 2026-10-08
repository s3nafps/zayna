# CLAUDE.md — Zayna

Project conventions for Claude Code. Read this and `PLAN.md` before changing code.

## What this is

Zayna is a jewelry e-commerce platform for the Algerian market. All products are stainless steel (owner decision; this supersedes the 18k gold, vermeil and 925 silver listed in the brief's §0). Product material is a Shopify metafield, never hard-coded copy. Payment is **Cash on Delivery only**. Delivery goes through Algerian couriers to home or stop-desk pickup across all 58 wilayas. The UI is in Arabic (RTL), French (default) and English.

**Shopify is the source of truth** for products, inventory, customers and orders. We build around it. We don't replace it. The storefront reads from the Storefront API and creates orders through our COD form using the Admin API.

## Status

Phase 1 (foundation), the back-office login and dashboard, and the Android shell are built on the branch: scaffold, tokens, i18n, shared components, Prisma schema and wilaya seed, tests, Docker and CI. Phases 2 onward are not started. `PLAN.md` has the phased checklist and the open decisions. Check it before starting work, and tick items off as they land.

## Commands

```
pnpm dev              # Next.js dev server
pnpm build            # prisma generate + production build (run before test:e2e)
pnpm lint             # ESLint, then the logical-properties check
pnpm typecheck        # prisma generate + tsc --noEmit (strict)
pnpm format:check     # Prettier
pnpm test             # Vitest unit tests
pnpm test:e2e         # Playwright, desktop and Pixel 7 projects. Needs a build first
pnpm db:migrate       # prisma migrate deploy (uses DATABASE_URL from .env)
pnpm db:seed          # 58 wilayas, the owner account from ADMIN_SEED_*; communes when data/communes.json exists
ZAYNA_SEED_FIXTURES=1 pnpm db:seed:fixtures   # dev only: 48 fake orders for the dashboard and orders list
CATALOG_SOURCE=mock  # storefront catalogue: mock (dev only, made-up products) or none. Unset means mock outside production
pnpm android:sync     # writes www/app-config.js from APP_URL, then cap sync android
pnpm android:debug   # debug APK at android/app/build/outputs/apk/debug/app-debug.apk (needs the Android SDK)
pnpm worker           # Redis reachability check. Real jobs arrive in Phase 4
docker compose up     # app, worker, postgres, redis, caddy
```

Local Playwright on a machine with a preinstalled Chromium: `CHROMIUM_PATH=/path/to/chrome pnpm test:e2e`. CI installs its own browser.

`/[locale]/preview/components` shows every shared component with test fixtures. It returns 404 unless `ZAYNA_PREVIEW=1`. The e2e suite sets it.

Not yet available: `pnpm carrier:smoke` (Phase 4).

## Architecture

**One Next.js app (App Router, TypeScript strict)** with two areas:

- `src/app/(store)/[locale]/...`: storefront, locales `ar`, `fr`, `en`, default `fr`. Locale is always in the URL. Browser language does not pick it
- `src/app/(admin)/admin/...`: owner and agent back-office, not localized in the URL. Routes are in `PLAN.md`
- `src/proxy.ts`: next-intl locale routing for the storefront. Excludes `/admin`, `/api` and assets
- `src/components/`: shared UI. `src/lib/`: pure helpers (money, wilaya labels, status tones). `src/i18n/`: locales and navigation. `messages/`: FR, AR and EN strings with matching keys
- `prisma/schema.prisma` and `src/lib/prisma.ts` (Prisma 7 with the Postgres driver adapter). Generated client goes to `src/generated/prisma` and is gitignored

**Shopify** (`src/shopify/`, `server-only`):

- Storefront API: catalog, collections, search, translated content (Translate & Adapt, falling back to FR)
- Admin GraphQL API: order creation, tags and metafields, fulfillments. The API version is one pinned constant
- Token manager: client-credentials grant, cached in Redis, refreshed before expiry. Legacy `SHOPIFY_ADMIN_TOKEN` supported
- Webhooks: HMAC verified on every request. Handlers are idempotent (store webhook IDs)

**Couriers** (`src/carriers/`, `server-only`):

- `CarrierAdapter` interface (brief §7). One adapter per platform: `yalidine` (also Guepex/Yalitec via base URL), `procolis` (ZR Express legacy and smaller couriers), `ecotrack` (tenant URL), `maystro`, `noest`, `custom`
- The settings UI renders each provider's form from its `credentialSchema`
- Credentials are AES-256-GCM encrypted with `CARRIER_ENCRYPTION_KEY`. Decrypted only inside adapter calls, server-side. The browser sees last 4 characters at most

**Jobs** (BullMQ + Redis, `worker` service): push-to-carrier, tracking polls, Shopify sync retries, bulk label generation

**Data** (PostgreSQL + Prisma): see brief §4. Models include `Order`, `OrderEvent`, `Carrier`, `Shipment`, `Wilaya`, `Commune`, `StopDesk`, `ShippingRate`, `PhoneReputation`, `User`

**Internal order statuses:**
`NEW → CONFIRMED | UNREACHABLE | CANCELLED → PREPARING → SHIPPED → IN_TRANSIT → OUT_FOR_DELIVERY | AT_STOPDESK → DELIVERED → COD_SETTLED`, plus `RETURNED` and `FAILED`. Each courier adapter maps its own raw statuses onto these. Map them in `mapStatus()`, never in UI code.

**Auth** (admin only): Auth.js with credentials. Roles `owner` and `agent`. Agents can confirm orders and ship. Only owners see API settings. Customers have no accounts.

## Conventions

### Money, phones, dates

- **Money is always integer DZD.** No floats, no decimals. Format for display as `4 500 DA` with a non-breaking space. Arabic may use `٤٥٠٠ د.ج` if configured
- **Phones are stored normalized** as `0[5-7]XXXXXXXX`. Input accepts `+213`. Normalize once, in one function, with tests
- **Dates are shown in Africa/Algiers time**

### Layout and RTL

- **Logical properties only**: `ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`, `text-start`, `text-end`. Never `left`, `right`, `ml-`, `mr-`, `pl-`, `pr-`, `text-left`, `text-right`
- Every screen must be checked in Arabic. Mirror the layout, flip directional icons, keep numbers and prices readable
- Mobile first at 360–430px. Desktop admin at 1024px and up
- Touch targets are at least 48px. Every input has a label. Gold-on-ivory text must meet contrast

### Design tokens

- Tokens live in `tailwind.config.ts`, ported from `design/stitch/warm_luxury_maghreb_heritage/DESIGN.md` and the Stitch `tailwind.config`. **No raw hex values in components.** Use token names
- Known conflicts between `DESIGN.md` prose and YAML are listed in `PLAN.md` (A1–A3). Don't pick a side silently
- `design/stitch/` is a read-only reference. Convert each `code.html` into componentized React. **Never paste raw HTML.** Don't ship the export's image URLs

### Mock data

- **Don't hard-code mock data from the mockups.** Every name, number, KPI, price, date and review comes from the DB or Shopify
- **Business copy that isn't confirmed stays out of the code.** Store it in translation files (`messages/fr.json`, `ar.json`, `en.json`) with a `TODO(owner)` where it needs confirmation. See `PLAN.md` group B
- Mockup numbers like "38 ms latency" and "4.9/5" are demo data. Remove them

### Validation and security

- **Zod on every API boundary**: route handlers, server actions, webhooks, adapter responses
- **Never trust client prices.** Re-price server-side on every checkout submit
- `import 'server-only'` in every Shopify and carrier module
- CSRF protection on every mutation. Rate limiting on public forms and login
- **No PII in logs.** No phone numbers, addresses or credentials. Log IDs and status codes
- Secrets come from env only. Courier credentials are entered in `/admin/carriers` and stored encrypted, never in env

### Couriers

- **Verify every endpoint against the official docs before coding it. Don't invent endpoints or field names.** If docs are unavailable, write `TODO(docs)` and report it in the PR
- Respect rate limits: read quotas from response headers, queue and back off
- **Idempotency:** push-to-carrier uses order ID as the idempotency key. Double clicks never create two parcels
- Yalidine-family couriers share one adapter. Only the base URL changes
- Tests use recorded fixtures. **No live calls in CI.** `scripts/carrier-smoke.ts` is manual only

### Shopify write-back

- Internal status goes to Shopify as tags and/or metafields
- When a parcel ships: create a fulfillment with tracking number and carrier
- When DELIVERED: mark the Shopify order paid
- When RETURNED: tag it, and restock if configured
- Request the minimum scopes: read/write orders, read products, read inventory, write fulfillments, and customers only if needed

### Testing

- **Vitest** for unit tests and adapter tests with recorded fixtures
- **Playwright** for checkout (FR and AR/RTL) and the admin order flow
- Every PR passes lint, typecheck and tests before review

### Git and PRs

- One branch and one PR per phase. Stop after each phase for review
- **Never push to `main` directly**
- PR description: short summary, screenshots of new screens in FR and AR, and a list of anything that needs the owner's input (credentials, docs, decisions)
- Follow the branch named in the session instructions

## Never do

- Add card or online payment. Payment is COD only
- Expose Shopify or courier credentials to the browser
- Hard-code mock data from the mockups
- Invent courier API endpoints or field names
- Trust client-side prices
- Use left/right-specific CSS
- Create duplicate parcels. Always idempotent
- Push to `main` directly

## When the brief and the docs disagree

Follow the official Shopify or courier documentation. Report what changed in the PR.
