import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/types';
import { getProductById } from '@/lib/repositories/productRepository';
import { calculateDiscountPrice } from '@/lib/utils/currency';
import { variantKey } from '@/lib/cart/variantKey';

interface CartState {
  items: CartItem[];
  addItem: (productId: string, qty?: number, variant?: Record<string, string>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (productId, qty = 1, variant) => {
        const product = getProductById(productId);
        if (!product) return;

        set((state) => {
          const existingItem = state.items.find(
            (item) =>
              item.productId === productId && variantKey(item.variant) === variantKey(variant)
          );

          if (existingItem) {
            const newQty = existingItem.qty + qty;
            if (newQty > product.stock) {
              return state; // No agregar más del stock disponible
            }
            return {
              items: state.items.map((item) =>
                item.productId === productId && variantKey(item.variant) === variantKey(variant)
                  ? { ...item, qty: newQty }
                  : item
              ),
            };
          }

          if (qty > product.stock) {
            return state; // No agregar más del stock disponible
          }

          return {
            items: [...state.items, { productId, qty, variant }],
          };
        });
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },
      updateQuantity: (productId, qty) => {
        const product = getProductById(productId);
        if (!product || qty < 0 || qty > product.stock) return;

        if (qty === 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, qty } : item
          ),
        }));
      },
      clearCart: () => {
        set({ items: [] });
      },
      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          const product = getProductById(item.productId);
          if (!product) return total;
          const price = product.discount
            ? calculateDiscountPrice(product.priceCOP, product.discount)
            : product.priceCOP;
          return total + price * item.qty;
        }, 0);
      },
      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.qty, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
