import { describe, expect, it } from 'vitest';
import { calculateDiscountPrice, formatCOP } from './currency';

describe('formatCOP', () => {
  it('formats a value as Colombian pesos with no decimals', () => {
    expect(formatCOP(1_500_000)).toMatch(/\$\s*1\.500\.000/);
  });

  it('formats zero', () => {
    expect(formatCOP(0)).toMatch(/\$\s*0/);
  });
});

describe('calculateDiscountPrice', () => {
  it('applies a percentage discount', () => {
    expect(calculateDiscountPrice(100_000, 20)).toBe(80_000);
  });

  it('rounds to the nearest whole unit', () => {
    expect(calculateDiscountPrice(99_999, 33)).toBe(Math.round(99_999 * 0.67));
  });

  it('returns the original price for a 0% discount', () => {
    expect(calculateDiscountPrice(50_000, 0)).toBe(50_000);
  });
});
