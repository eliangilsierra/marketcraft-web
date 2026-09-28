import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  register: (
    name: string,
    email: string,
    password: string,
    role: 'USER' | 'SELLER'
  ) => Promise<User>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, _password: string) => {
        // Mock login
        await new Promise((resolve) => setTimeout(resolve, 500));

        const mockUser: User = {
          id: '1',
          name: email.split('@')[0],
          email,
          role: email.includes('seller') ? 'SELLER' : 'USER',
        };

        set({ user: mockUser, isAuthenticated: true });
        return mockUser;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      register: async (name: string, email: string, _password: string, role: 'USER' | 'SELLER') => {
        // Mock register
        await new Promise((resolve) => setTimeout(resolve, 500));

        const mockUser: User = {
          id: String(Date.now()),
          name,
          email,
          role,
        };

        set({ user: mockUser, isAuthenticated: true });
        return mockUser;
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
