// Money is always an integer amount of DZD (Algerian dinar). Never use floats.

const NBSP = " ";
const ARABIC_INDIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

export type MoneyLocale = "fr" | "en" | "ar";

export type FormatMoneyOptions = {
  locale?: MoneyLocale;
  // Arabic-Indic digits for Arabic screens. Off by default (see brief §5).
  arabicDigits?: boolean;
};

export type MoneyParts = {
  // The number, grouped with non-breaking spaces. Render it isolated LTR so bidi cannot reorder digits.
  digits: string;
  // "DA" for French and English, "د.ج" for Arabic.
  currency: string;
};

export function formatDzdParts(amount: number, options: FormatMoneyOptions = {}): MoneyParts {
  if (!Number.isSafeInteger(amount)) {
    throw new RangeError(`Money must be a safe integer DZD amount, received ${amount}`);
  }
  const { locale = "fr", arabicDigits = false } = options;
  const sign = amount < 0 ? "-" : "";
  const grouped = String(Math.abs(amount)).replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
  const localized = arabicDigits
    ? grouped.replace(/\d/g, (digit) => ARABIC_INDIC_DIGITS[Number(digit)] ?? digit)
    : grouped;
  return {
    digits: `${sign}${localized}`,
    currency: locale === "ar" ? "د.ج" : "DA",
  };
}

// 4500 becomes "4 500 DA", with a non-breaking space as the thousands separator and before the currency.
export function formatDzd(amount: number, options: FormatMoneyOptions = {}): string {
  const { digits, currency } = formatDzdParts(amount, options);
  return `${digits}${NBSP}${currency}`;
}
