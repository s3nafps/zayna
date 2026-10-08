const NBSP = " ";

// Plain counts with non-breaking space grouping, the same as money.
export function formatCount(value: number): string {
  if (!Number.isSafeInteger(value)) {
    throw new RangeError(`Count must be a safe integer, received ${value}`);
  }
  const sign = value < 0 ? "-" : "";
  return sign + String(Math.abs(value)).replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
}

// Percent with one decimal. Null means there is no denominator yet, so show a dash.
export function formatRate(rate: number | null): string {
  if (rate === null) {
    return "—";
  }
  return `${(rate * 100).toFixed(1).replace(".", ",")} %`;
}
