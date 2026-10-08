import type { Config } from "tailwindcss";

// Design tokens for Zayna. Source: design/stitch/warm_luxury_maghreb_heritage/DESIGN.md and the
// Stitch tailwind.config in each screen. Decisions A1 to A3 in PLAN.md apply:
// - Existing colors use the Stitch config values, because those are what the screens render.
// - Blush, gold-border, deep-gold and status-amber come from the DESIGN.md prose, which the config lacks.
// - Pill radius (full) is 9999px for badges and language chips.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#fff8f3",
        "surface-dim": "#dfd9d4",
        "surface-bright": "#fff8f3",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f9f2ed",
        "surface-container": "#f3ede7",
        "surface-container-high": "#ede7e2",
        "surface-container-highest": "#e7e1dc",
        "surface-variant": "#e7e1dc",
        background: "#fff8f3",
        "on-background": "#1d1b18",
        "on-surface": "#1d1b18",
        "on-surface-variant": "#4d4635",
        "inverse-surface": "#32302d",
        "inverse-on-surface": "#f6f0ea",
        outline: "#7f7663",
        "outline-variant": "#d1c5af",
        "surface-tint": "#755b00",
        primary: "#755b00",
        "on-primary": "#ffffff",
        "primary-container": "#c9a227",
        "on-primary-container": "#4b3a00",
        "inverse-primary": "#ecc246",
        "primary-fixed": "#ffe08e",
        "primary-fixed-dim": "#ecc246",
        "on-primary-fixed": "#241a00",
        "on-primary-fixed-variant": "#584400",
        secondary: "#635d5b",
        "on-secondary": "#ffffff",
        "secondary-container": "#e7dedb",
        "on-secondary-container": "#67615f",
        "secondary-fixed": "#e9e1de",
        "secondary-fixed-dim": "#cdc5c2",
        "on-secondary-fixed": "#1e1b19",
        "on-secondary-fixed-variant": "#4b4644",
        tertiary: "#006d44",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#54b985",
        "on-tertiary-container": "#00462a",
        "tertiary-fixed": "#92f7be",
        "tertiary-fixed-dim": "#76daa3",
        "on-tertiary-fixed": "#002111",
        "on-tertiary-fixed-variant": "#005232",
        error: "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
        // From DESIGN.md prose only (A1)
        blush: "#f4ebe8",
        "gold-border": "#e6d5ac",
        "deep-gold": "#997a15",
        "status-amber": "#d97706",
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "9999px",
      },
      spacing: {
        gutter: "0.75rem",
        "gutter-desktop": "1.5rem",
        margin: "1rem",
        "margin-desktop": "2.5rem",
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2.5rem",
        // 48px touch target from DESIGN.md
        tap: "3rem",
      },
      fontFamily: {
        // Arabic falls back to Amiri (display) and Cairo (body) through the same stack.
        display: ['"Playfair Display"', "Amiri", "serif"],
        sans: ['"Plus Jakarta Sans"', "Cairo", "system-ui", "sans-serif"],
      },
      fontSize: {
        "headline-xl": ["40px", { lineHeight: "48px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-xl-mobile": ["30px", { lineHeight: "38px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "0em", fontWeight: "500" }],
        "headline-lg-mobile": ["24px", { lineHeight: "32px", letterSpacing: "0em", fontWeight: "500" }],
        "headline-md": ["20px", { lineHeight: "28px", letterSpacing: "0.01em", fontWeight: "600" }],
        "body-lg": ["16px", { lineHeight: "26px", letterSpacing: "0em", fontWeight: "400" }],
        "body-md": ["14px", { lineHeight: "22px", letterSpacing: "0em", fontWeight: "400" }],
        "body-sm": ["12px", { lineHeight: "18px", letterSpacing: "0.01em", fontWeight: "400" }],
        "label-lg": ["14px", { lineHeight: "20px", letterSpacing: "0.02em", fontWeight: "600" }],
        "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.03em", fontWeight: "600" }],
        "label-sm": ["10px", { lineHeight: "14px", letterSpacing: "0.04em", fontWeight: "600" }],
        "currency-display": ["18px", { lineHeight: "24px", letterSpacing: "0.02em", fontWeight: "700" }],
      },
      boxShadow: {
        // Gold-tinted atmospheric glow from DESIGN.md
        atmospheric: "0 4px 20px -2px rgba(201, 162, 39, 0.08), 0 2px 6px -1px rgba(28, 26, 23, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
