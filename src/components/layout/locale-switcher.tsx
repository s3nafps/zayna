"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";

// AR | FR | EN pill. The active locale gets a gold pill (DESIGN.md header).
export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      role="group"
      aria-label={t("header.switchLocale")}
      className="inline-flex items-center rounded-full bg-surface-container p-0.5"
    >
      {locales.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            lang={code}
            aria-pressed={active}
            onClick={() => router.replace(pathname, { locale: code })}
            className={`min-h-tap min-w-tap rounded-full px-2 font-sans text-label-sm font-semibold transition-colors ${
              active
                ? "bg-primary-container text-on-primary-container shadow-atmospheric"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {t(`locales.${code}`)}
          </button>
        );
      })}
    </div>
  );
}
