export function formatPrice(amount: number, currency = "SAR", locale = "en"): string {
  const n = Math.round(amount * 100) / 100;
  if (locale === "ar") {
    return `${n.toLocaleString("ar-SA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ر.س`;
  }
  return `${currency} ${n.toFixed(2)}`;
}

export function formatDuration(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}
