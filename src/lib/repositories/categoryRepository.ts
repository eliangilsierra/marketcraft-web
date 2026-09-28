import { categories } from '@/mocks/seeds';
import type { Category } from '@/types';

export function getAllCategories(): Category[] {
  return categories;
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}
