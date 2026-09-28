import type { Filters, Product } from '@/types';

/**
 * Pure search/filter/sort over a product list. Extracted from the
 * Catálogo page so it can be unit tested and reused (e.g. by the
 * product repository) independently of any component.
 */
export function filterAndSortProducts(products: Product[], filters: Filters): Product[] {
  let result = products;

  if (filters.search) {
    const query = filters.search.toLowerCase();
    result = result.filter(
      (p) => p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
    );
  }

  if (filters.categoryId) {
    result = result.filter((p) => p.categoryId === filters.categoryId);
  }

  if (filters.minPrice !== undefined) {
    result = result.filter((p) => p.priceCOP >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    result = result.filter((p) => p.priceCOP <= filters.maxPrice!);
  }

  const sorted = [...result];

  switch (filters.sort) {
    case 'price-asc':
      sorted.sort((a, b) => a.priceCOP - b.priceCOP);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.priceCOP - a.priceCOP);
      break;
    case 'rating':
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      sorted.sort((a, b) => Number(b.id) - Number(a.id));
      break;
    default:
      // "Featured" (the default view): featured items first, then by rating.
      sorted.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.rating - a.rating;
      });
  }

  return sorted;
}
