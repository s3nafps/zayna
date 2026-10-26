import { Link } from "@/i18n/navigation";
import { Price } from "./price";

export type ProductCardProps = {
  href: string;
  name: string;
  // Material is a Shopify metafield. Shown as data, never as copy.
  material?: string;
  priceDzd: number;
  compareAtDzd?: number;
  badge?: string;
};

// Product tile from DESIGN.md: ivory card, 1px gold-border, 4:5 image area on blush.
// No image yet: Phase 2 wires Shopify CDN media. Add-to-cart arrives with the cart in Phase 2.
export function ProductCard({ href, name, material, priceDzd, compareAtDzd, badge }: ProductCardProps) {
  return (
    <Link
      href={href}
      className="flex flex-col overflow-hidden rounded-xl border border-gold-border bg-surface-container-lowest shadow-atmospheric"
    >
      <div className="relative aspect-[4/5] bg-blush">
        {badge ? (
          <span className="absolute start-2 top-2 rounded-full bg-primary-container px-2 py-0.5 font-sans text-label-sm font-bold text-on-primary-container">
            {badge}
          </span>
        ) : null}
      </div>
      <div className="flex flex-col gap-1 p-3">
        {material ? <p className="font-sans text-label-sm text-on-surface-variant">{material}</p> : null}
        <h3 className="font-display text-headline-md font-semibold text-on-surface">{name}</h3>
        <Price amount={priceDzd} compareAt={compareAtDzd} />
      </div>
    </Link>
  );
}
