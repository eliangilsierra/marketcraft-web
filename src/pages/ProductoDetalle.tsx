import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Truck, Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { products, categories } from '@/mocks/seeds';
import { formatCOP, calculateDiscountPrice } from '@/lib/utils/currency';
import { useCartStore } from '@/lib/state/useCartStore';
import { useFavoritesStore } from '@/lib/state/useFavoritesStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { ProductCard } from '@/components/ProductCard';

export default function ProductoDetalle() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.slug === slug);
  const addItem = useCartStore((state) => state.addItem);
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
          <Button onClick={() => navigate('/catalogo')}>Volver al catálogo</Button>
        </div>
      </div>
    );
  }

  const category = categories.find((c) => c.id === product.categoryId);
  const favorite = isFavorite(product.id);
  const finalPrice = product.discount
    ? calculateDiscountPrice(product.priceCOP, product.discount)
    : product.priceCOP;
  const relatedProducts = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (product.stock === 0) {
      toast.error('Producto sin stock');
      return;
    }
    if (quantity > product.stock) {
      toast.error(`Solo hay ${product.stock} unidades disponibles`);
      return;
    }
    addItem(product.id, quantity, selectedVariants);
    toast.success(
      `${quantity} ${quantity === 1 ? 'producto agregado' : 'productos agregados'} al carrito`
    );
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product.id);
    toast.success(favorite ? 'Eliminado de favoritos' : 'Agregado a favoritos');
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
              <img
                src={product.images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {product.discount && (
                <Badge variant="secondary" className="absolute top-4 left-4 text-lg px-4 py-2">
                  -{product.discount}%
                </Badge>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={cn(
                      'aspect-square rounded-lg overflow-hidden border-2 transition-all',
                      selectedImage === idx
                        ? 'border-primary'
                        : 'border-transparent hover:border-muted-foreground/20'
                    )}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              {category && (
                <Link
                  to={`/catalogo?category=${category.id}`}
                  className="text-sm text-primary hover:underline"
                >
                  {category.name}
                </Link>
              )}
              <h1 className="text-4xl font-bold mt-2 mb-4">{product.title}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-muted-foreground">
                    ({Math.floor(Math.random() * 200 + 50)} reseñas)
                  </span>
                </div>
              </div>
              <div className="flex items-baseline gap-4">
                {product.discount ? (
                  <>
                    <span className="text-4xl font-bold text-primary">{formatCOP(finalPrice)}</span>
                    <span className="text-2xl text-muted-foreground line-through">
                      {formatCOP(product.priceCOP)}
                    </span>
                  </>
                ) : (
                  <span className="text-4xl font-bold text-primary">
                    {formatCOP(product.priceCOP)}
                  </span>
                )}
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4">
                {product.variants.map((variant) => (
                  <div key={variant.name}>
                    <label className="text-sm font-medium mb-2 block">{variant.name}</label>
                    <Select
                      value={selectedVariants[variant.name] || ''}
                      onValueChange={(value) =>
                        setSelectedVariants((prev) => ({ ...prev, [variant.name]: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Selecciona ${variant.name.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {variant.values.map((value) => (
                          <SelectItem key={value} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity and Stock */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Cantidad</label>
                <span className="text-sm text-muted-foreground">
                  {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
                </span>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Agregar al Carrito
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleToggleFavorite}
                className={cn(favorite && 'text-destructive border-destructive')}
              >
                <Heart className={cn('h-5 w-5', favorite && 'fill-current')} />
              </Button>
            </div>

            {/* Benefits */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Envío gratis</p>
                    <p className="text-sm text-muted-foreground">
                      En compras superiores a $100.000
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Compra protegida</p>
                    <p className="text-sm text-muted-foreground">Devoluciones en 30 días</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-6">Productos Relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
