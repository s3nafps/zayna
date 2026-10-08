"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

// Owner and agent back-office rail. Fixed 280px on desktop, per DESIGN.md. Shown from the lg breakpoint up.
// Items whose page is not built yet render as disabled, so nothing links to a 404.
const ITEMS = [
  { href: "/admin", key: "dashboard", icon: "dashboard", built: true },
  { href: "/admin/orders", key: "orders", icon: "shopping_bag", built: true },
  { href: "/admin/cod", key: "cod", icon: "payments", built: false },
  { href: "/admin/products", key: "products", icon: "watch", built: false },
  { href: "/admin/carriers", key: "carriers", icon: "local_shipping", built: false },
  { href: "/admin/shipping-rates", key: "shippingRates", icon: "map", built: false },
  { href: "/admin/customers", key: "customers", icon: "group", built: false },
  { href: "/admin/settings", key: "settings", icon: "settings", built: false },
] as const;

export function AdminSidebar() {
  const t = useTranslations("admin");
  const pathname = usePathname();

  return (
    <aside className="hidden w-[280px] shrink-0 flex-col gap-6 border-e border-gold-border bg-surface-container-low p-4 lg:flex">
      <p className="font-display text-headline-md font-semibold text-primary">{t("brand")}</p>
      <nav aria-label={t("brand")}>
        <ul className="flex flex-col gap-1">
          {ITEMS.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            const className = `flex min-h-tap items-center gap-3 rounded-lg px-3 font-sans text-label-lg font-semibold ${
              active
                ? "bg-primary-container/20 text-on-primary-container"
                : "text-on-surface-variant hover:bg-blush hover:text-on-surface"
            }`;
            const label = (
              <>
                <span aria-hidden="true" className="material-symbols-outlined">{item.icon}</span>
                {t(`nav.${item.key}`)}
              </>
            );
            return (
              <li key={item.key}>
                {item.built ? (
                  <Link href={item.href} aria-current={active ? "page" : undefined} className={className}>
                    {label}
                  </Link>
                ) : (
                  <span
                    aria-disabled="true"
                    title={t("comingSoon")}
                    className="flex min-h-tap items-center gap-3 rounded-lg px-3 font-sans text-label-lg font-semibold text-on-surface-variant opacity-50"
                  >
                    {label}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
