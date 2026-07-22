/*
  Money is represented everywhere as an integer number of cents (CAD).
  Never use floating-point arithmetic for currency. All rounding is explicit
  and centralised here so pricing, tax and promotions stay consistent between
  the client preview and the authoritative server-side recalculation.
*/

export type Cents = number;
export const CURRENCY = "CAD" as const;

/** Round to the nearest whole cent using half-up rounding. */
export function roundCents(value: number): Cents {
  return Math.round(value);
}

/** Apply a percentage (e.g. 9.975 for QC tax) to a cents amount, rounded. */
export function applyRate(amount: Cents, ratePercent: number): Cents {
  return roundCents((amount * ratePercent) / 100);
}

/** Format cents as a localized currency string. */
export function formatMoney(
  cents: Cents,
  locale: "en" | "fr" = "en",
  { withSymbol = true }: { withSymbol?: boolean } = {},
): string {
  const value = cents / 100;
  const formatter = new Intl.NumberFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    style: withSymbol ? "currency" : "decimal",
    currency: CURRENCY,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(value);
}

/** Convenience for compact "from $X" starting-price labels. */
export function formatFrom(cents: Cents, locale: "en" | "fr" = "en"): string {
  const value = cents / 100;
  const rounded = Number.isInteger(value) ? value.toFixed(0) : value.toFixed(2);
  return locale === "fr" ? `${rounded} $` : `$${rounded}`;
}
