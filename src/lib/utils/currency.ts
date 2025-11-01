/**
 * Formatea un número a pesos colombianos (COP)
 */
export function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calcula el precio con descuento
 */
export function calculateDiscountPrice(price: number, discountPercent: number): number {
  return Math.round(price * (1 - discountPercent / 100));
}
