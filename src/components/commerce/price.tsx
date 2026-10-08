import { useLocale } from "next-intl";
import { formatDzdParts, type MoneyLocale } from "@/lib/money";

export type PriceProps = {
  amount: number;
  compareAt?: number;
  arabicDigits?: boolean;
};

const NBSP = " ";

// Server component: uses the active locale for the currency suffix.
// The number sits in an LTR isolate, so Arabic-Indic digits keep their order inside RTL text.
export function Price({ amount, compareAt, arabicDigits = false }: PriceProps) {
  const locale = useLocale() as MoneyLocale;
  const options = { locale, arabicDigits };
  const current = formatDzdParts(amount, options);
  const previous = compareAt !== undefined && compareAt > amount ? formatDzdParts(compareAt, options) : null;
  return (
    <span className="inline-flex items-baseline gap-2 tabular">
      <span className="font-sans text-currency-display font-bold text-on-surface">
        <bdi dir="ltr">{current.digits}</bdi>
        {NBSP}
        {current.currency}
      </span>
      {previous ? (
        <span className="font-sans text-body-sm text-on-surface-variant line-through">
          <bdi dir="ltr">{previous.digits}</bdi>
          {NBSP}
          {previous.currency}
        </span>
      ) : null}
    </span>
  );
}
