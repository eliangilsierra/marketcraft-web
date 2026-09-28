/**
 * Stable, order-independent key for a cart item's selected variant.
 * `JSON.stringify` alone is unsafe here because object key order isn't
 * guaranteed to match between two calls that select the same variant.
 */
export function variantKey(variant?: Record<string, string>): string {
  if (!variant) return '';
  return Object.keys(variant)
    .sort()
    .map((key) => `${key}:${variant[key]}`)
    .join('|');
}
