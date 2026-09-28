import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import type { Product } from '@/types';
import { formatCOP, calculateDiscountPrice } from '@/lib/utils/currency';
import { useCartStore } from '@/lib/state/useCartStore';
import { useFavoritesStore } from '@/lib/state/useFavoritesStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const favorite = isFavorite(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock === 0) {
      toast.error('Producto sin stock');
      return;
    }
    addItem(product.id);
    toast.success('Producto agregado al carrito');
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavorite(product.id);
    toast.success(favorite ? 'Eliminado de favoritos' : 'Agregado a favoritos');
  };

  const finalPrice = product.discount
    ? calculateDiscountPrice(product.priceCOP, product.discount)
    : product.priceCOP;

  return (
    <Link to={`/producto/${product.slug}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.discount && (
            <Badge variant="secondary" className="absolute top-3 left-3">
              -{product.discount}%
            </Badge>
          )}
          {product.stock === 0 && (
            <Badge variant="destructive" className="absolute top-3 left-3">
              Sin Stock
            </Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'absolute top-3 right-3 bg-card/80 backdrop-blur-sm hover:bg-card',
              favorite && 'text-destructive hover:text-destructive'
            )}
            onClick={handleToggleFavorite}
          >
            <Heart className={cn('h-4 w-4', favorite && 'fill-current')} />
          </Button>
        </div>

        <CardContent className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>

          <div className="flex items-center gap-1 mb-2 text-sm">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{product.rating}</span>
            <span className="text-muted-foreground">({Math.floor(Math.random() * 200 + 50)})</span>
          </div>

          <div className="mt-auto">
            {product.discount ? (
              <div>
                <p className="text-sm text-muted-foreground line-through">
                  {formatCOP(product.priceCOP)}
                </p>
                <p className="text-xl font-bold text-primary">{formatCOP(finalPrice)}</p>
              </div>
            ) : (
              <p className="text-xl font-bold text-primary">{formatCOP(product.priceCOP)}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button className="w-full" onClick={handleAddToCart} disabled={product.stock === 0}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Agregar al Carrito
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
