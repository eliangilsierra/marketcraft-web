import { describe, expect, it } from 'vitest';
import { variantKey } from './variantKey';

describe('variantKey', () => {
  it('returns an empty string for no variant', () => {
    expect(variantKey(undefined)).toBe('');
  });

  it('produces the same key regardless of property order', () => {
    const a = variantKey({ Color: 'Negro', Talla: 'M' });
    const b = variantKey({ Talla: 'M', Color: 'Negro' });
    expect(a).toBe(b);
  });

  it('produces different keys for different variant values', () => {
    const a = variantKey({ Color: 'Negro' });
    const b = variantKey({ Color: 'Blanco' });
    expect(a).not.toBe(b);
  });
});
