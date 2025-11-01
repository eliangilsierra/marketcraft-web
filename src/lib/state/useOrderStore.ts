import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order } from '@/types';

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  getOrdersByUserId: (userId: string) => Order[];
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (order) => {
        set((state) => ({
          orders: [order, ...state.orders],
        }));
      },
      getOrdersByUserId: (userId) => {
        return get().orders.filter((order) => order.userId === userId);
      },
    }),
    {
      name: 'order-storage',
    }
  )
);
