export function cn(...inputs: Array<string | false | null | undefined>) {
 return inputs.filter(Boolean).join(" ");
}

export function formatPrice(value: number, currency = "USD") {
 const abs = Math.abs(value);
 const digits = abs >= 1000 ? 2 : abs >= 1 ? 2 : 4;
 return new Intl.NumberFormat("en-US", {
 style: "currency",
 currency,
 minimumFractionDigits: digits,
 maximumFractionDigits: digits,
 }).format(value);
}

export function formatNumber(value: number, digits = 2) {
 return new Intl.NumberFormat("en-US", {
 minimumFractionDigits: digits,
 maximumFractionDigits: digits,
 }).format(value);
}

export function formatPercent(value: number) {
 const sign = value > 0 ? "+" : "";
 return `${sign}${value.toFixed(2)}%`;
}

export function formatCompact(value: number) {
 return new Intl.NumberFormat("en-US", {
 notation: "compact",
 maximumFractionDigits: 2,
 }).format(value);
}
