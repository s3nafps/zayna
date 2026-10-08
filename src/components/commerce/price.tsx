import { useLocale } from "next-intl";
import { formatDzd, type MoneyLocale } from "@/lib/money";

export type PriceProps = {
  amount: number;
  compareAt?: number;
  arabicDigits?: boolean;
};

// Server component: uses the active locale for the currency suffix.
export function Price({ amount, compareAt, arabicDigits = false }: PriceProps) {
  const locale = useLocale() as MoneyLocale;
  const options = { locale, arabicDigits };
  return (
    <span className="inline-flex items-baseline gap-2 tabular">
      <span className="font-sans text-currency-display font-bold text-on-surface">
        {formatDzd(amount, options)}
      </span>
      {compareAt !== undefined && compareAt > amount ? (
        <span className="font-sans text-body-sm text-on-surface-variant line-through">
          {formatDzd(compareAt, options)}
        </span>
      ) : null}
    </span>
  );
}
