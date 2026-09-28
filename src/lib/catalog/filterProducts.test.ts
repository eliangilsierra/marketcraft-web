import { describe, expect, it } from 'vitest';
import { filterAndSortProducts } from './filterProducts';
import type { Product } from '@/types';

function makeProduct(overrides: Partial<Product>): Product {
  return {
    id: '1',
    slug: 'producto',
    title: 'Producto',
    description: 'Descripción',
    priceCOP: 100_000,
    images: [],
    categoryId: 'cat-1',
    rating: 4,
    stock: 10,
    ...overrides,
  };
}

describe('filterAndSortProducts', () => {
  const products: Product[] = [
    makeProduct({
      id: '1',
      title: 'Laptop Pro',
      description: 'Portátil potente',
      priceCOP: 3_000_000,
      categoryId: 'electronica',
      rating: 4.5,
      featured: true,
    }),
    makeProduct({
      id: '2',
      title: 'Camiseta Básica',
      description: 'Algodón suave',
      priceCOP: 50_000,
      categoryId: 'ropa',
      rating: 4.8,
    }),
    makeProduct({
      id: '3',
      title: 'Mouse Gamer',
      description: 'Inalámbrico',
      priceCOP: 120_000,
      categoryId: 'electronica',
      rating: 3.9,
    }),
    makeProduct({
      id: '4',
      title: 'Silla Ergonómica',
      description: 'Para oficina',
      priceCOP: 800_000,
      categoryId: 'hogar',
      rating: 4.2,
      featured: true,
    }),
  ];

  it('filters by case-insensitive search across title and description', () => {
    const result = filterAndSortProducts(products, { search: 'INALÁMBRICO' });
    expect(result.map((p) => p.id)).toEqual(['3']);
  });

  it('filters by category', () => {
    const result = filterAndSortProducts(products, { categoryId: 'electronica' });
    expect(result.map((p) => p.id).sort()).toEqual(['1', '3']);
  });

  it('filters by price range', () => {
    const result = filterAndSortProducts(products, { minPrice: 100_000, maxPrice: 1_000_000 });
    expect(result.map((p) => p.id).sort()).toEqual(['3', '4']);
  });

  it('combines search, category, and price filters', () => {
    const result = filterAndSortProducts(products, {
      categoryId: 'electronica',
      minPrice: 0,
      maxPrice: 200_000,
    });
    expect(result.map((p) => p.id)).toEqual(['3']);
  });

  it('sorts by price ascending', () => {
    const result = filterAndSortProducts(products, { sort: 'price-asc' });
    expect(result.map((p) => p.id)).toEqual(['2', '3', '4', '1']);
  });

  it('sorts by price descending', () => {
    const result = filterAndSortProducts(products, { sort: 'price-desc' });
    expect(result.map((p) => p.id)).toEqual(['1', '4', '3', '2']);
  });

  it('sorts by rating descending', () => {
    const result = filterAndSortProducts(products, { sort: 'rating' });
    expect(result.map((p) => p.id)).toEqual(['2', '1', '4', '3']);
  });

  it('sorts by newest (highest numeric id first)', () => {
    const result = filterAndSortProducts(products, { sort: 'newest' });
    expect(result.map((p) => p.id)).toEqual(['4', '3', '2', '1']);
  });

  it('defaults to featured-first, then rating', () => {
    const result = filterAndSortProducts(products, {});
    expect(result.map((p) => p.id)).toEqual(['1', '4', '2', '3']);
  });

  it('does not mutate the input array', () => {
    const original = [...products];
    filterAndSortProducts(products, { sort: 'price-asc' });
    expect(products).toEqual(original);
  });
});
