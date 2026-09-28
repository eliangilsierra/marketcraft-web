import { products } from '@/mocks/seeds';
import type { Filters, Product } from '@/types';
import { filterAndSortProducts } from '@/lib/catalog/filterProducts';
import {
  DISCOUNTED_PRODUCTS_LIMIT,
  FEATURED_PRODUCTS_LIMIT,
  RELATED_PRODUCTS_LIMIT,
} from '@/lib/constants';

/**
 * Product data access, kept behind this module so every page reads
 * products through the same seam rather than importing the mock array
 * directly. Swapping the mock for a real API means changing only the
 * function bodies below — every caller stays the same.
 *
 * These functions are synchronous today because the mock data is an
 * in-memory array; a real HTTP-backed implementation would return
 * Promises instead, which callers would need to await.
 */

export function getAllProducts(): Product[] {
  return products;
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByIds(ids: string[]): Product[] {
  const idSet = new Set(ids);
  return products.filter((p) => idSet.has(p.id));
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function searchProducts(filters: Filters): Product[] {
  return filterAndSortProducts(products, filters);
}

export function getFeaturedProducts(limit = FEATURED_PRODUCTS_LIMIT): Product[] {
  return products.filter((p) => p.featured).slice(0, limit);
}

export function getDiscountedProducts(limit = DISCOUNTED_PRODUCTS_LIMIT): Product[] {
  return products.filter((p) => p.discount).slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = RELATED_PRODUCTS_LIMIT): Product[] {
  return products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, limit);
}
