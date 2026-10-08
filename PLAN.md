# Zayna — Delivery Plan

Build plan for the Zayna COD jewelry platform. Section references (§) point to the build brief. The visual reference is `design/stitch/`, and `design/stitch/warm_luxury_maghreb_heritage/DESIGN.md` is the design system.

**Status:** Phase 0 (planning) is in review. No application code exists yet.

## How this plan works

- One branch and one PR per phase. Stop after each phase for review.
- `[ ]` = not started, `[x]` = done.
- Items marked **(needs owner)** are blocked on input listed in [Decisions and inputs needed](#decisions-and-inputs-needed).
- Every screen is built from its Stitch mockup, but no mockup content is hard-coded. Numbers, names, prices and copy come from the database, Shopify, or translation files (see `CLAUDE.md`).

---

## Phase 0 — Planning (this PR)

- [x] Read the brief (§0–§11)
- [x] Read all 10 Stitch screens and `DESIGN.md`
- [x] Write `PLAN.md` and `CLAUDE.md`
- [ ] Owner review. Answer the blocking decisions (group A and B, plus D2 and D1)

---

## Screen map

Stitch folder → route. Rows marked _no mockup_ are built in the same design language.

| Screen                                                                 | Route                            | Phase                                           |
| ---------------------------------------------------------------------- | -------------------------------- | ----------------------------------------------- |
| Storefront home (`accueil_zayna_jewelry`)                              | `/[locale]`                      | 2                                               |
| Product page (`fiche_produit_collier_fatima`)                          | `/[locale]/products/[handle]`    | 2                                               |
| Collection listing with filters _(no mockup)_                          | `/[locale]/collections/[handle]` | 2                                               |
| Search _(no mockup)_                                                   | `/[locale]/search`               | 2                                               |
| Cart _(no mockup)_                                                     | `/[locale]/cart`                 | 2                                               |
| COD checkout (`commander_paiement_livraison_cod`)                      | `/[locale]/checkout`             | 2                                               |
| Order confirmation (`confirmation_de_commande_zayna_jewelry`)          | `/[locale]/order/[id]/thanks`    | 2                                               |
| Order tracking (`suivi_de_commande_zayna_jewelry`)                     | `/[locale]/track`                | 2                                               |
| Admin login _(no mockup)_                                              | `/admin/login`                   | 3                                               |
| Owner dashboard, desktop (`tableau_de_bord_espace_propri_taire_zayna`) | `/admin`                         | 3                                               |
| Seller dashboard, mobile (`espace_vendeur_tableau_de_bord`)            | `/admin` (mobile layout)         | 3                                               |
| Orders (`gestion_des_commandes_zayna_admin`)                           | `/admin/orders`                  | 3                                               |
| Products _(no mockup, read-only)_                                      | `/admin/products`                | 3                                               |
| Settings _(no mockup)_                                                 | `/admin/settings`                | 3 (store, origin, users); 6 (message templates) |
| Carriers (`int_grations_transporteurs_zayna_admin`)                    | `/admin/carriers`                | 4 (Yalidine); 5 (others)                        |
| Shipping rates (`grille_tarifaire_58_wilayas_zayna_admin`)             | `/admin/shipping-rates`          | 5                                               |
| COD reconciliation _(sidebar item "COD", no mockup)_                   | `/admin/cod`                     | 5                                               |
| Customers _(no mockup)_                                                | `/admin/customers`               | 6                                               |

---

## Phase 1 — Foundation

- [ ] Scaffold Next.js (App Router, TypeScript strict), with lint, format and typecheck scripts
- [ ] Port design tokens into `tailwind.config.ts`: colors, radii, spacing, font scale, gold-tinted shadows. Conflicts resolved per **A1–A3**
- [ ] Fonts: Playfair Display and Plus Jakarta Sans (Latin); Cairo (body) and Amiri (display) for Arabic, switched on `dir="rtl"`; Material Symbols Outlined for icons (**A4**)
- [ ] `next-intl` with `/ar`, `/fr`, `/en` routing, default `fr`, `dir="rtl"` for Arabic
- [ ] Lint rule (or check script) that rejects `left`/`right`/`ml-`/`mr-`/`pl-`/`pr-`/`text-left`-style classes. Use logical properties only
- [ ] Shared components: header with AR/FR/EN switcher, bottom nav, product card, price, COD trust badge, wilaya/commune selector, status pill, admin sidebar, KPI card, data table
- [ ] Prisma schema from §4, with the first migration
- [ ] Seed the 58 wilayas (code 01–58, FR and AR names) from a bundled JSON. Communes are seeded from the source in **D3**
- [ ] Dockerfile and `docker-compose.yml` (app, postgres, redis, worker) behind Caddy
- [ ] GitHub Actions: lint, typecheck and test on PR; build and push the image on `main`
- [ ] Vitest and Playwright set up, each with one passing smoke test
- [ ] Screenshots of shared components in FR and AR (Playwright) for the PR

## Phase 2 — Storefront

- [ ] Shopify Storefront API client (`server-only`), pinned API version in one constant (verify the current stable version first)
- [ ] Catalog reads: products, collections, search. Translated fields for AR/FR/EN, falling back to FR
- [ ] Home, from Shopify collections. ISR with time-based revalidation (webhook-driven revalidation arrives in Phase 3)
- [ ] Collection listing with filters _(no mockup)_
- [ ] Product page: gallery, variants (size, metal), COD badge, "Commander" and add-to-cart, live wilaya fee estimator
- [ ] Search _(no mockup)_
- [ ] Cart _(no mockup)_: cookie-based. Prices are never trusted from the client
- [ ] Checkout (one page, §5): Zod validation, server-side re-pricing, live shipping fee from `ShippingRate`, phone normalization, optional note
- [ ] Stop Desk option hidden behind a flag until Phase 4 supplies centers. HOME only until then
- [ ] Shopify Admin token manager: client-credentials grant, cached in Redis, refreshed before the 24h expiry. Support static `SHOPIFY_ADMIN_TOKEN` as well
- [ ] Create the order in Shopify (`orderCreate`, or `draftOrderCreate` + `draftOrderComplete(paymentPending: true)` if unavailable). Set: pending financial status, COD gateway, shipping line, address with wilaya as province and commune as city, phone, tags `cod` / `zayna-app` / source, inventory decremented
- [ ] Save our `Order`, then redirect to the thanks page
- [ ] Thanks page (`/order/[id]/thanks`) and tracking page (order number + phone, timeline). Tracking shows no driver contact details (see **B9**)
- [ ] Anti-fraud: rate limit by IP and by phone (Redis), honeypot field, duplicate detection (same phone + same items within 24h → flag), blocklist check, high-return-ratio flag
- [ ] Optional SMS OTP behind a setting, off by default
- [ ] Vitest: phone normalization, price calculation, anti-fraud rules, Shopify mapping (recorded fixtures)
- [ ] Playwright: checkout in FR and AR/RTL

## Phase 3 — Back-office core

- [ ] Auth for admin only, with roles `owner` and `agent`. Use Auth.js (credentials). Lucia's library is deprecated, so don't use it. Secure cookies, CSRF on every mutation, rate-limited login
- [ ] Admin login page
- [ ] Shopify webhooks: `orders/create`, `orders/updated`, `orders/cancelled`, `products/update`, `inventory_levels/update`. Verify HMAC on every request. Store webhook IDs and make handlers idempotent
- [ ] Revalidate storefront ISR on `products/update`
- [ ] Backfill script: last 90 days of orders into the DB
- [ ] Orders list: status tabs with counts, filters (wilaya, carrier, date, source), search (order number, name, phone)
- [ ] Order detail drawer: `tel:` call button; Confirmed / Unreachable (+1 attempt) / Cancelled one-tap actions; edit address, wilaya and delivery type before shipping; notes; full event timeline
- [ ] Write internal status back to Shopify as tags and/or metafields
- [ ] Manual order creation for Facebook/Instagram DM orders. Creates the Shopify order too
- [ ] Dashboard KPIs from the DB: new today, to confirm, shipped/in route, delivered and delivery rate, returns and return rate, COD in transit (DA). 7-day chart. Top wilayas. Desktop and mobile layouts (`/admin`)
- [ ] `/admin/products`: read-only list from Shopify with stock and a link to edit in Shopify
- [ ] `/admin/settings`: store info, origin wilaya, users and roles
- [ ] `OrderEvent` audit log written for every status change and call attempt
- [ ] Playwright: admin order flow (confirm an order, then check the event timeline)

## Phase 4 — Couriers

- [ ] `src/carriers/` adapter interface from §7. `credentialSchema` drives the configure form
- [ ] Credential storage: AES-256-GCM with `CARRIER_ENCRYPTION_KEY`. Decrypt only inside adapter calls. Show last 4 characters only. Never log credentials
- [ ] `/admin/carriers`: provider cards, configure modal with masked inputs, test connection, default-carrier toggle, auto-sync toggle
- [ ] Yalidine adapter. Verify every endpoint against the official docs first. REST API, `X-API-ID` / `X-API-TOKEN` headers
- [ ] Yalidine rate limits: read quotas from response headers, queue and back off
- [ ] Yalidine webhooks, including the subscription verification handshake, with polling as a fallback
- [ ] Yalidine resources: wilayas, communes, centers (stop desks), delivery fees, parcels, histories
- [ ] Guepex / Yalitec and other Yalidine-family couriers: same adapter, base URL configurable
- [ ] Rates import (uses the adapter's fee endpoint) to replace the seeded `ShippingRate` rows
- [ ] Stop Desk unlocked in storefront checkout from Yalidine centers
- [ ] BullMQ jobs: push-to-carrier (idempotency key = order id), tracking poll every 30–60 min for non-final parcels (skipped when webhooks are active)
- [ ] Bulk ship and merged 10x15 label PDF (`pdf-lib`)
- [ ] Shopify fulfillment write-back: tracking number and carrier. On DELIVERED, mark the Shopify order paid. On RETURNED, tag it and restock if configured
- [ ] Vitest adapter tests with recorded Yalidine fixtures. No live calls in CI
- [ ] `scripts/carrier-smoke.ts`: `testConnection` plus a dry-run rate lookup from `.env.local`. Manual use only

## Phase 5 — More couriers

- [ ] Procolis adapter (legacy ZR Express API, token + key). Covers several smaller couriers
- [ ] ZR Express new platform adapter, if its docs are available (**D5**)
- [ ] Ecotrack adapter (bearer token, tenant URL `https://<courier>.ecotrack.dz`). Covers DHD, Conexlog and others
- [ ] Maystro Delivery adapter (single token)
- [ ] Noest Express adapter (API token + user GUID)
- [ ] Custom provider: name, base URL, auth type (API key header / bearer / ID + token), manual status mapping table
- [ ] `/admin/shipping-rates`: 58 wilayas × enabled carriers × home/desk. Import from carrier, disable a wilaya, bulk ± adjustment
- [ ] `/admin/cod`: delivered parcels with expected vs collected cash per carrier. Mark carrier payouts as settled
- [ ] Recorded fixtures and unit tests for each adapter

## Phase 6 — Polish

- [ ] Notifications: WhatsApp click-to-chat and SMS templates in AR/FR for confirmation, shipped, and arrived at stop desk. Editable in settings
- [ ] `/admin/customers`: derived from orders (order count, delivered/returned ratio, blocklist flag). Phone reputation feeds the anti-fraud checks
- [ ] Meta Pixel and Conversions API "Purchase" event on order confirmation, behind env vars
- [ ] Performance pass: Lighthouse on a mid-range Android over 4G. `next/image` for Shopify CDN images
- [ ] RTL and accessibility audit: every storefront and admin screen in AR and FR. 48px touch targets, labelled inputs, contrast for gold-on-ivory
- [ ] `DEPLOY.md`: Ubuntu VPS with Docker, Caddy and Postgres backups. Include a tested restore

---

## Decisions and inputs needed

Items are grouped by what they block. Each has my recommendation. If you don't object, I'll build it that way.

### A. Design tokens (blocks Phase 1)

- **A1. Brand colors disagree within `DESIGN.md`.** The prose and the YAML token block give different values for secondary (blush `#F4EBE8` vs `#635D5B`), tertiary (emerald `#1B8A5A` vs `#006D44`) and background (ivory `#FAF8F5` vs `#FFF8F3`). The screens render the YAML/config values. **Recommend:** use the Stitch config values for existing tokens, and add `blush` `#F4EBE8` as a named token, because product tiles need it.
- **A2. Pill radius.** The Stitch Tailwind config sets `rounded-full` to `0.75rem`, but `DESIGN.md` calls for full pills on badges and language chips. **Recommend:** `full` = `9999px`. Keep the config's `DEFAULT`/`lg`/`xl` (2 / 4 / 8px), which match the button and card radii in `DESIGN.md`. Ignore the YAML radii, which disagree with both.
- **A3. Arabic fonts.** `DESIGN.md` allows Amiri or Cairo, and the brief says Cairo or Tajawal. **Recommend:** Cairo for body text and Amiri for display headings.
- **A4. Icons.** Every screen uses Material Symbols Outlined. **Recommend:** keep it, and self-host the font files instead of loading them at runtime.
- **A5. Logo and imagery.** The logo and all photos in the export are Stitch-generated URLs on `lh3.googleusercontent.com`, and the `screen.png` files are missing. **Need:** the real logo file, product photography or Shopify media, and a hero photo. The export's image URLs will not ship.

### B. Business content in the mockups (blocks Phase 2 copy)

The storefront shows these claims to customers, so they need to be confirmed. Several contradict each other.

- **B1. Metal claims. Resolved by owner: all products are stainless steel.** The mockups' gold, vermeil and 925 silver claims ("Or 18k garanti", "Or 18k véritable", "Or 18k massif", "Vermeil 18k", "Argent 925 Doré") are dropped from all copy. Brief §0 lists 18k gold, vermeil and 925 silver as the catalog. That is superseded by this decision. **Still open (small):** the Khamsa Fatima spec says "plaqué Or 18K" (gold plating). Gold plating is still a gold claim, so I'll drop it too unless you say otherwise. Material stays a per-product Shopify metafield, so the app shows whatever the product record says, and no metal name is hard-coded.
- **B2. Return/exchange window.** The home page says 7 days. The product page, checkout and confirmation say 3 days. **Need:** one value.
- **B3. Warranty.** "Garantie brillance 12 mois" appears on the product page. **Need:** confirm or drop.
- **B4. Shipping fees and "Livraison incluse".** Mockups use 500 DA home and 350 DA stop desk. The product page says "Livraison incluse" and totals 7 300 DA, but checkout charges 500 DA. Other copy says fees run 400–900 DA. **Recommend:** follow the brief. Fees come from `ShippingRate` and are shown at checkout. Drop "Livraison incluse". **Need:** the real rates (see D2).
- **B5. Discounts.** Checkout and confirmation show "Réduction Bienvenue Zayna −300 DA". Banners show "−15%", and a product shows "−10% PROMO". Discounts aren't in the brief. **Recommend:** only Shopify discounts or compare-at prices, so Shopify order totals stay correct. If there are no coupons, remove the welcome discount. Either way the server re-prices.
- **B6. Support contact.** Mockups show three different numbers (WhatsApp `+213 550 12 34 56`, call `0661 45 89 20`, and `023 XX XX XX`) and two sets of hours (09–19 and 09–20). **Need:** the real numbers and hours.
- **B7. Operational promises.** "Appel sous 2 h", "24 h / 48 h / 72 h by zone", "Assurance valeur déclarée jusqu'à 450 000 DA", "Garantie livraison 0 DA en cas de casse", and COD commissions of 1.5–2% deducted from payouts. **Need:** confirm each. The commission rules drive Phase 5 reconciliation.
- **B8. Social proof.** The home page shows "4.9/5", "4 800 commandes livrées" and three named reviews marked "Achat vérifié". These are demo data. **Recommend:** leave reviews out of the MVP, since they aren't in the brief. Add them only when they're real.
- **B9. Driver details shown to customers.** The tracking page shows the driver's first name and phone number. The admin mockup also shows a driver's name, phone and van plate. **Recommend:** customers never see a driver's phone. They see the carrier name, status and carrier tracking link.
- **B10. Storefront nav "Vendeur" link.** The public header links to `/admin`. **Recommend:** remove it. Admin is reached by URL and login only.
- **B11. Arabic and English copy.** All mockup copy is French, with some Arabic labels. **Need:** a native speaker to review the AR and EN translations. I'll draft them, and nothing ships untranslated.

### C. Scope calls I've made (tell me if you disagree)

- **C1. Wishlist hearts** on product cards and the product page are not in the brief. **Decision:** out of MVP.
- **C2. Secondary phone** (optional) on checkout is in the mockup but not the brief. **Decision:** include it as an optional field, stored separately from the primary phone.
- **C3. Commune input.** The mockup uses free text. The brief says a dropdown filtered by wilaya. **Decision:** follow the brief. This depends on the commune source in D3.
- **C4. Stop Desk at checkout.** It needs centers from the default carrier, so it's enabled in Phase 4. Until then checkout offers HOME only.
- **C5. Zones on the rate grid** (Centre, Ouest, Est, Sud, Grand Sud). The brief has no zone concept. **Decision:** add a display-only `zone` field on `Wilaya` for grouping.
- **C6. COD reconciliation route.** The brief doesn't give one, and the sidebar says "COD". **Decision:** `/admin/cod`.
- **C7. Dashboard.** One route, `/admin`, that changes layout by breakpoint. It uses the desktop mockup at 1024px and up, and the seller mockup below that.
- **C8. Package manager.** **Recommend:** pnpm, with the current Node LTS.

### D. Access and data (blocks the named phases)

- **D1. Shopify (blocks Phase 2).** I need the store domain. I need a Dev Dashboard app with client ID and secret, installed on the store, since the token expires every 24 hours. I need a Storefront API token from a Headless channel. I also need to confirm that a payment gateway named exactly "Cash on Delivery (COD)" exists in the store, because orders reference it.
- **D2. Default-carrier rate card (blocks Phase 2 checkout).** Home and stop-desk prices for all 58 wilayas. Without them checkout can't price an order. **Option:** I seed placeholder rates marked TEST and block production launch until they're replaced.
- **D3. Commune list (blocks Phase 1 seed).** I need a list of all communes with FR and AR names. I can't verify commune names offline. **Options:** an export you approve, or the Yalidine communes endpoint once Yalidine is connected (Phase 4).
- **D4. Yalidine (blocks Phase 4).** API ID, API token, and sandbox access if available.
- **D5. Other couriers (blocks Phase 5).** ZR Express (new platform and/or legacy Procolis), Ecotrack tenant URL(s), Maystro token, Noest token and user GUID. Which ZR API you use decides which adapter I build first.
- **D6. Deployment (blocks Phase 6).** VPS host, domain and DNS, and SSH access. Confirm whether Postgres backups should be copied off the server.
- **D7. Optional.** Meta Pixel ID and Conversions API token, and the WhatsApp Business number.

### E. Verification I'll do (no owner action)

- Confirm the current stable Shopify Admin API version. Confirm that `orderCreate` exists in it. Confirm the client-credentials token flow in the Dev Dashboard docs.
- Verify each courier's docs before coding its adapter (Yalidine first). Anything I can't verify gets a `TODO(docs)` marker and goes in the PR.
- If the brief conflicts with an official doc, follow the doc and report the change.

### Branch note

The environment requires development on `claude/upbeat-maxwell-tqd81m`. This phase is on that branch. Tell me if you'd rather have per-phase branch names.
