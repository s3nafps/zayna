import { defineRouting } from "next-intl/routing";

export const locales = ["ar", "fr", "en"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "fr",
  localePrefix: "always",
  // Always French at "/". Browser language does not pick the locale (brief §0: default fr).
  localeDetection: false,
});

export function directionFor(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}
