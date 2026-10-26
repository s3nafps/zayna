"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

// Mobile bottom navigation. No seller link: the back-office is not linked from the storefront (PLAN B10).
const ITEMS = [
  { href: "/", key: "home", icon: "auto_awesome" },
  { href: "/collections/all", key: "shop", icon: "grid_view" },
  { href: "/cart", key: "cart", icon: "local_mall" },
  { href: "/track", key: "track", icon: "inventory_2" },
] as const;

export function BottomNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <nav
      aria-label={t("home")}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gold-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
    >
      <ul className="grid grid-cols-4">
        {ITEMS.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <li key={item.key}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-tap flex-col items-center justify-center gap-0.5 font-sans text-label-sm font-semibold ${
                  active ? "text-primary" : "text-on-surface-variant"
                }`}
              >
                <span aria-hidden="true" className="material-symbols-outlined">
                  {item.icon}
                </span>
                {t(item.key)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
