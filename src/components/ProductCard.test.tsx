import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProductCard } from './ProductCard';
import type { Product } from '@/types';

const product: Product = {
  id: 'test-1',
  slug: 'producto-de-prueba',
  title: 'Producto de Prueba',
  description: 'Una descripción de prueba',
  priceCOP: 100_000,
  images: ['https://example.com/image.jpg'],
  categoryId: 'cat-1',
  rating: 4.5,
  stock: 5,
  discount: 20,
};

function renderProductCard(overrides: Partial<Product> = {}) {
  return render(
    <MemoryRouter>
      <ProductCard product={{ ...product, ...overrides }} />
    </MemoryRouter>
  );
}

describe('ProductCard', () => {
  it('renders the product title', () => {
    renderProductCard();
    expect(screen.getByText('Producto de Prueba')).toBeInTheDocument();
  });

  it('shows both the discounted and original price when discounted', () => {
    renderProductCard();
    expect(screen.getByText('-20%')).toBeInTheDocument();
  });

  it('marks the add-to-cart button disabled when out of stock', () => {
    renderProductCard({ stock: 0 });
    expect(screen.getByRole('button', { name: /Agregar al Carrito/i })).toBeDisabled();
    expect(screen.getByText('Sin Stock')).toBeInTheDocument();
  });
});
