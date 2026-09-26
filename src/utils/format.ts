/**
 * Format currency in Uzbek So'm (UZS)
 * e.g. 65000 -> "65 000 so'm"
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('uz-UZ').format(amount).replace(/,/g, ' ') + " so'm";
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(original: number, current: number): number {
  if (!original || original <= current) return 0;
  return Math.round(((original - current) / original) * 100);
}

/**
 * Truncate text nicely
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
