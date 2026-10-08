---
name: Warm Luxury & Maghreb Heritage
colors:
  surface: '#fff8f3'
  surface-dim: '#dfd9d4'
  surface-bright: '#fff8f3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f9f2ed'
  surface-container: '#f3ede7'
  surface-container-high: '#ede7e2'
  surface-container-highest: '#e7e1dc'
  on-surface: '#1d1b18'
  on-surface-variant: '#4d4635'
  inverse-surface: '#32302d'
  inverse-on-surface: '#f6f0ea'
  outline: '#7f7663'
  outline-variant: '#d1c5af'
  surface-tint: '#755b00'
  primary: '#755b00'
  on-primary: '#ffffff'
  primary-container: '#c9a227'
  on-primary-container: '#4b3a00'
  inverse-primary: '#ecc246'
  secondary: '#635d5b'
  on-secondary: '#ffffff'
  secondary-container: '#e7dedb'
  on-secondary-container: '#67615f'
  tertiary: '#006d44'
  on-tertiary: '#ffffff'
  tertiary-container: '#54b985'
  on-tertiary-container: '#00462a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffe08e'
  primary-fixed-dim: '#ecc246'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#584400'
  secondary-fixed: '#e9e1de'
  secondary-fixed-dim: '#cdc5c2'
  on-secondary-fixed: '#1e1b19'
  on-secondary-fixed-variant: '#4b4644'
  tertiary-fixed: '#92f7be'
  tertiary-fixed-dim: '#76daa3'
  on-tertiary-fixed: '#002111'
  on-tertiary-fixed-variant: '#005232'
  background: '#fff8f3'
  on-background: '#1d1b18'
  surface-variant: '#e7e1dc'
typography:
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-xl-mobile:
    fontFamily: Playfair Display
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
    letterSpacing: 0em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: 0em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: 0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: 0em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.03em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  currency-display:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 0.75rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system expresses approachable North African luxury tailored for the Algerian digital commerce ecosystem. The aesthetic fuses classical French high-jewelry refinement with warm Algerian hospitality and bridal heritage. 

Key attributes:
- **Atmosphere:** Warm, luminous, tactile, and dignified. It eschews cold tech minimalism in favor of rich ivory surfaces, subtle blush undercurrents, and radiant bullion accents.
- **Audience:** Algerian women, brides-to-be, and gift buyers seeking fine 18k gold, vermeil, and handcrafted jewelry, alongside boutique merchants managing orders, confirmations, and shipments across 58 wilayas.
- **Visual Style:** Elegant Editorial Minimal with Tactile Luxury touches. Surfaces feel like archival ivory paper, gold detailing appears fine-spun like filigree, and interface density prioritizes mobile single-hand checkout convenience with explicit cultural assurances.

## Colors

The color architecture is built around warm, non-glare sunlight and precious metal values:

- **Primary (`#C9A227`):** Antique radiant gold for critical interactive calls to action, brand insignias, star ratings, and selective active states.
  - Deep Gold Variant (`#997A15`): Used for high-contrast text links, dark-state borders, and pressed states.
  - Light Gold Border Accent (`#E6D5AC`): Fine decorative dividers and structural container borders.
- **Secondary (`#F4EBE8`):** Gentle rose-nude / blush used for soft component backgrounds, product showcase tiles, promotional pill backdrops, and subtle secondary cards.
- **Tertiary (`#1B8A5A`):** Algerian emerald green, reserved strictly for trust architecture: "Paiement à la livraison / الدفع عند الاستلام" (Cash on Delivery) validation, Yalidine/ZR delivery confirmations, and inventory availability indicators.
  - Status Amber (`#D97706`): Denotes customer verification pending ("Confirmation d'appel nécessaire").
- **Neutral (`#1C1A17`):** Velvety charcoal noir for maximum typographic legibility on pale surfaces, supported by Muted Charcoal (`#6B665F`) for meta labels and legal typography.
- **Background Tiers:** Deep warm ivory canvas (`#FAF8F5`), rising to alabaster card surfaces (`#FFFFFF`) with secondary recessed tiers (`#F5F1EB`).

## Typography

The type system balances Parisian haute joaillerie editorial sensibilities with contemporary digital ergonomics and bi-directional script balance (LTR for French/English, RTL for Arabic).

- **Headlines:** Set in `Playfair Display`. Provides high-contrast serifs, aristocratic terminals, and delicate ligatures appropriate for precious metals and gemstones. When rendered in Arabic contexts, fallback pairings smoothly utilize `Amiri` or `Cairo` for matching calligraphic elegance.
- **Body & Labels:** Set in `Plus Jakarta Sans`. Delivers clear optical performance across compact mobile screens, numbers, Wilaya selection dropdowns, and form fields. Maintains visual weight parity across French, English, and Arabic script modes.
- **Price Presentation:** Prices follow the national trade standard `4 500 DA` (or `٤٥٠٠ د.ج`), featuring a non-breaking space between the numeric value and the currency symbol. Currency figures adopt medium/bold tabular numerals via `currency-display` to ensure immediate clarity in checkout screens.

## Layout & Spacing

This design system is tailored for a mobile-first 390px baseline viewport, transitioning smoothly to multi-column tablet and desktop merchant dashboards.

- **Mobile Viewport (360px - 430px):** Single-column stack governed by a 4-column fluid layout with an outer canvas padding (`margin`) of `1rem` (16px) and an inner element column gap (`gutter`) of `0.75rem` (12px). Product feeds render in a strict 2-column card grid.
- **Desktop & Merchant Console (1024px+):** Expands to an asymmetric 12-column layout with 24px gutters and 40px outer margins. The desktop layout establishes a fixed 280px navigation rail for merchant logistics (Wilaya tracking, delivery sheet generation).
- **Rhythmic Stacking:** Vertical space follows an 8-point baseline grid. High-value showcase components (e.g., ring customization selectors, COD certification banners) enforce `space-lg` to create visual breathing room that feels upscale rather than transactional.

## Elevation & Depth

Depth avoids aggressive dropshadows and harsh dark occlusions, mirroring instead soft studio lighting on velvet and gold leaf.

- **Atmospheric Glow:** Cards elevate through warm, hyper-diffused ambient penumbras tinted with yellow-gold undertones: `box-shadow: 0 4px 20px -2px rgba(201, 162, 39, 0.08), 0 2px 6px -1px rgba(28, 26, 23, 0.04)`.
- **Low-Contrast Filigree Outlines:** Surfaces utilize a 1px perimeter border tinted with Light Gold (`#E6D5AC`) at 60% opacity to establish structural boundaries against the ivory canvas without visual weight.
- **Floating Modals & Checkout Sheets:** Mobile checkout bottom sheets employ a high-blur frost backdrop (`backdrop-filter: blur(12px)`) with a warm ivory-white wash (`rgba(250, 248, 245, 0.92)`), anchoring the customer's focus cleanly over the catalog layer.

## Shapes

The design system employs a soft tailored contour (`roundedness: 1`), honoring the architectural geometry of jewelry settings:

- **Buttons, Text Inputs, and Shipping Selectors:** 4px (`0.25rem`) border radius, preserving clean lines and structured discipline.
- **Containers & Product Cards:** 8px (`0.5rem` / `rounded-lg`) corner radii for tactile warmth without devolving into childish or casual hyper-rounded forms.
- **Special Badges & Language Chips:** Full pill encapsulation (`rounded-full`) exclusively for badges, stock status indicators, and the language toggle to differentiate them from actionable form controls.

## Components

### Buttons
- **Primary Action (e.g., "Commander via Cash on Delivery", "Ajouter au Panier"):** Rich Gold background (`#C9A227`), near-black label text (`#1C1A17`), height 48px, subtle 1px border (`#997A15`), uppercase letter spacing. Hover/active shifts to Deep Gold (`#997A15`) with ivory text (`#FAF8F5`).
- **Secondary Action (e.g., "Retrait Stop Desk", "Guide des tailles"):** Transparent background, 1px perimeter border in `#E6D5AC`, text in `#1C1A17`. Hover triggers `#F4EBE8` blush fill.

### Algerian Delivery & Trust Badges
- **COD Trust Banner:** Contained inside an Emerald-tinted surface (`rgba(27, 138, 90, 0.08)`) framed by a 1px border (`#1B8A5A`). Features bilingual confirmation: *"Paiement à la livraison / الدفع عند الاستلام — Inspectez votre colis avant de payer"*.
- **Carrier Shipping Selectors (Yalidine, ZR Express, Maystro):** Segmented card controls with 1px border `#E6D5AC`. Selected state switches to 1.5px `#C9A227` border with a subtle gold shimmer fill (`rgba(201, 162, 39, 0.05)`). Supports split radio choices for *"À domicile"* (Home) vs. *"Stop Desk / Bureau"* (Pickup).

### Form Inputs & Location Selectors
- **Input Fields:** 48px height for finger-friendly touch targets on mobile. Background is `#FFFFFF` with a 1px `#E6D5AC` border. Focused state changes border to `#C9A227` with a 2px outer glow (`rgba(201, 162, 39, 0.15)`).
- **Wilaya & Commune Selector:** Dual-tier dropdown pairing Wilaya numerical codes (01 Adrar to 58 El Menia) with both Latin and Arabic spellings (e.g., `16 - Alger / الجزائر`).

### Cards & Jewelry Display
- **Product Tiles:** Ivory card background (`#FFFFFF`) with a 1px border (`#E6D5AC`). Product photography features a consistent 4:5 vertical portrait aspect ratio resting on a neutral blush ground (`#F4EBE8`). Pricing prominently displays `DA` in tabular bold lettering alongside gold carat specifications (`18k`, `Vermeil`, `Argent 925`).

### Language & Header Navigation
- **Top Utility Header:** Compact sticky bar featuring the three-way language switch (`AR | FR | EN`), where the active locale is signaled by a solid gold underline accent or pill tag. Layout direction dynamically flips between `dir="ltr"` and `dir="rtl"` based on the active selection.