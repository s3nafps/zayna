// Money is always an integer amount of DZD (Algerian dinar). Never use floats.

const NBSP = " ";
const ARABIC_INDIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

export type MoneyLocale = "fr" | "en" | "ar";

export type FormatMoneyOptions = {
  locale?: MoneyLocale;
  // Arabic-Indic digits for Arabic screens. Off by default (see brief §5).
  arabicDigits?: boolean;
};

// 4500 becomes "4 500 DA", with a non-breaking space as the thousands separator and before the currency.
// Arabic uses "د.ج" as the currency suffix.
export function formatDzd(amount: number, options: FormatMoneyOptions = {}): string {
  if (!Number.isSafeInteger(amount)) {
    throw new RangeError(`Money must be a safe integer DZD amount, received ${amount}`);
  }
  const { locale = "fr", arabicDigits = false } = options;
  const sign = amount < 0 ? "-" : "";
  const grouped = String(Math.abs(amount)).replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
  const digits = arabicDigits
    ? grouped.replace(/\d/g, (digit) => ARABIC_INDIC_DIGITS[Number(digit)] ?? digit)
    : grouped;
  const currency = locale === "ar" ? "د.ج" : "DA";
  return `${sign}${digits}${NBSP}${currency}`;
}
