import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./locale-switcher";

// Sticky top bar: wordmark, AR/FR/EN switch, search, cart, then the delivery notice strip.
export async function SiteHeader({ cartCount = 0 }: { cartCount?: number }) {
  const t = await getTranslations("header");
  return (
    <header className="sticky top-0 z-50 border-b border-gold-border bg-surface/90 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 px-margin py-1">
        <Link href="/" className="font-display text-headline-md font-semibold text-primary">
          Zayna
        </Link>
        <div className="flex items-center gap-1">
          <LocaleSwitcher />
          <Link
            href="/search"
            aria-label={t("search")}
            className="inline-flex size-tap items-center justify-center text-on-surface-variant hover:text-primary"
          >
            <span aria-hidden="true" className="material-symbols-outlined">
              search
            </span>
          </Link>
          <Link
            href="/cart"
            aria-label={`${t("cart")} (${cartCount})`}
            className="relative inline-flex size-tap items-center justify-center text-on-surface-variant hover:text-primary"
          >
            <span aria-hidden="true" className="material-symbols-outlined">
              local_mall
            </span>
            {cartCount > 0 ? (
              <span className="absolute end-1 top-1 inline-flex size-4 items-center justify-center rounded-full bg-primary font-sans text-[10px] font-bold text-on-primary">
                {cartCount}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
      <p className="flex items-center justify-center gap-1 bg-surface-container-low px-margin py-1 font-sans text-label-sm text-on-surface">
        <span aria-hidden="true" className="material-symbols-outlined text-[16px] text-primary">
          local_shipping
        </span>
        {t("shippingNotice")}
      </p>
    </header>
  );
}
