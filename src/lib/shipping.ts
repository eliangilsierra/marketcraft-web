import { FREE_SHIPPING_THRESHOLD_COP, STANDARD_SHIPPING_COP } from '@/lib/constants';

export function calculateShippingCOP(subtotalCOP: number): number {
  return subtotalCOP > FREE_SHIPPING_THRESHOLD_COP ? 0 : STANDARD_SHIPPING_COP;
}
