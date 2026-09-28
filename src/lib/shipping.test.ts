import { describe, expect, it } from 'vitest';
import { calculateShippingCOP } from './shipping';
import { FREE_SHIPPING_THRESHOLD_COP, STANDARD_SHIPPING_COP } from './constants';

describe('calculateShippingCOP', () => {
  it('charges standard shipping below the free-shipping threshold', () => {
    expect(calculateShippingCOP(FREE_SHIPPING_THRESHOLD_COP - 1)).toBe(STANDARD_SHIPPING_COP);
  });

  it('charges standard shipping exactly at the threshold', () => {
    expect(calculateShippingCOP(FREE_SHIPPING_THRESHOLD_COP)).toBe(STANDARD_SHIPPING_COP);
  });

  it('is free just above the threshold', () => {
    expect(calculateShippingCOP(FREE_SHIPPING_THRESHOLD_COP + 1)).toBe(0);
  });
});
