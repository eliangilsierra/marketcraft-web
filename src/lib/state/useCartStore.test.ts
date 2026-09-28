import { beforeEach, describe, expect, it } from 'vitest';
import { useCartStore } from './useCartStore';
import { getAllProducts } from '@/lib/repositories/productRepository';
import { calculateDiscountPrice } from '@/lib/utils/currency';

describe('useCartStore', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it('adds a new item to the cart', () => {
    const [product] = getAllProducts();
    useCartStore.getState().addItem(product.id, 2);
    expect(useCartStore.getState().items).toEqual([
      { productId: product.id, qty: 2, variant: undefined },
    ]);
  });

  it('merges quantities for the same product and variant', () => {
    const product = getAllProducts().find((p) => p.stock >= 3)!;
    useCartStore.getState().addItem(product.id, 1);
    useCartStore.getState().addItem(product.id, 2);
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].qty).toBe(3);
  });

  it('keeps different variants of the same product as separate line items', () => {
    const product = getAllProducts().find((p) => p.stock >= 2)!;
    useCartStore.getState().addItem(product.id, 1, { Color: 'Negro' });
    useCartStore.getState().addItem(product.id, 1, { Color: 'Blanco' });
    expect(useCartStore.getState().items).toHaveLength(2);
  });

  it('treats the same variant as identical regardless of key order', () => {
    const product = getAllProducts().find((p) => p.stock >= 2)!;
    useCartStore.getState().addItem(product.id, 1, { Color: 'Negro', Talla: 'M' });
    useCartStore.getState().addItem(product.id, 1, { Talla: 'M', Color: 'Negro' });
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].qty).toBe(2);
  });

  it('refuses to add more than the available stock', () => {
    const product = getAllProducts().find((p) => p.stock > 0 && p.stock < 100)!;
    useCartStore.getState().addItem(product.id, product.stock + 1);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('removes an item from the cart', () => {
    const [product] = getAllProducts();
    useCartStore.getState().addItem(product.id, 1);
    useCartStore.getState().removeItem(product.id);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('removing the quantity down to zero removes the line item', () => {
    const [product] = getAllProducts();
    useCartStore.getState().addItem(product.id, 2);
    useCartStore.getState().updateQuantity(product.id, 0);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('computes the total using discounted prices where applicable', () => {
    const discounted = getAllProducts().find((p) => p.discount && p.stock > 0)!;
    useCartStore.getState().addItem(discounted.id, 1);
    const expected = calculateDiscountPrice(discounted.priceCOP, discounted.discount!);
    expect(useCartStore.getState().getTotal()).toBe(expected);
  });

  it('counts total items across line items', () => {
    const products = getAllProducts().filter((p) => p.stock > 0);
    useCartStore.getState().addItem(products[0].id, 2);
    useCartStore.getState().addItem(products[1].id, 3);
    expect(useCartStore.getState().getItemCount()).toBe(5);
  });
});
