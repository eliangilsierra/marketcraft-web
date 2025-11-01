import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  favorites: string[];
  addFavorite: (productId: string) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (productId: string) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (productId) => {
        set((state) => ({
          favorites: state.favorites.includes(productId)
            ? state.favorites
            : [...state.favorites, productId],
        }));
      },
      removeFavorite: (productId) => {
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== productId),
        }));
      },
      isFavorite: (productId) => {
        return get().favorites.includes(productId);
      },
      toggleFavorite: (productId) => {
        const { isFavorite, addFavorite, removeFavorite } = get();
        if (isFavorite(productId)) {
          removeFavorite(productId);
        } else {
          addFavorite(productId);
        }
      },
    }),
    {
      name: 'favorites-storage',
    }
  )
);
