import { Heart } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { EmptyState } from '@/components/EmptyState';
import { useFavoritesStore } from '@/lib/state/useFavoritesStore';
import { products } from '@/mocks/seeds';

export default function Favoritos() {
  const favorites = useFavoritesStore((state) => state.favorites);
  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  if (favoriteProducts.length === 0) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <EmptyState
            icon={<Heart className="h-16 w-16" />}
            title="No tienes favoritos"
            description="Agrega productos a tu lista de favoritos para verlos aquí"
            action={{ label: 'Explorar Productos', href: '/catalogo' }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Mis Favoritos</h1>
          <p className="text-muted-foreground">
            {favoriteProducts.length} {favoriteProducts.length === 1 ? 'producto' : 'productos'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
