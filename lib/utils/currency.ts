const CURRENCY_SYMBOLS: Record<string, string> = {
  PKR: "₨",
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
  AED: "د.إ",
  SAR: "﷼",
  CNY: "¥",
  JPY: "¥",
  CAD: "C$",
  AUD: "A$",
  CHF: "CHF",
};

export function formatCurrency(amount: number, currency?: string | null): string {
  const cur = (currency || "PKR").toUpperCase();
  const symbol = CURRENCY_SYMBOLS[cur];
  const formatted = amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (symbol) {
    return `${symbol}${formatted}`;
  }
  return `${cur} ${formatted}`;
}

export function getCurrencySymbol(currency?: string | null): string {
  const cur = (currency || "PKR").toUpperCase();
  return CURRENCY_SYMBOLS[cur] || cur;
}
