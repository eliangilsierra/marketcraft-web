import { describe, expect, it } from 'vitest';
import {
  getAllProducts,
  getFeaturedProducts,
  getProductById,
  getProductBySlug,
  getProductsByIds,
  getRelatedProducts,
  searchProducts,
} from './productRepository';

describe('productRepository', () => {
  it('exposes a non-empty product catalog', () => {
    expect(getAllProducts().length).toBeGreaterThan(0);
  });

  it('finds a product by id and by slug consistently', () => {
    const [first] = getAllProducts();
    expect(getProductById(first.id)).toEqual(first);
    expect(getProductBySlug(first.slug)).toEqual(first);
  });

  it('returns undefined for an unknown id or slug', () => {
    expect(getProductById('does-not-exist')).toBeUndefined();
    expect(getProductBySlug('does-not-exist')).toBeUndefined();
  });

  it('getProductsByIds preserves only requested, existing products', () => {
    const [first, second] = getAllProducts();
    const result = getProductsByIds([first.id, 'missing', second.id]);
    expect(result.map((p) => p.id).sort()).toEqual([first.id, second.id].sort());
  });

  it('getFeaturedProducts only returns featured products, up to the limit', () => {
    const result = getFeaturedProducts(3);
    expect(result.length).toBeLessThanOrEqual(3);
    expect(result.every((p) => p.featured)).toBe(true);
  });

  it('getRelatedProducts excludes the product itself and only matches its category', () => {
    const product = getAllProducts().find((p) => p.id !== '1')!;
    const related = getRelatedProducts(product, 4);
    expect(related.every((p) => p.categoryId === product.categoryId)).toBe(true);
    expect(related.some((p) => p.id === product.id)).toBe(false);
  });

  it('searchProducts delegates filtering to filterAndSortProducts', () => {
    const [first] = getAllProducts();
    const result = searchProducts({ categoryId: first.categoryId });
    expect(result.every((p) => p.categoryId === first.categoryId)).toBe(true);
  });
});
