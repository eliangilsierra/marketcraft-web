import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/EmptyState';
import { useCartStore } from '@/lib/state/useCartStore';
import { getProductById } from '@/lib/repositories/productRepository';
import { formatCOP, calculateDiscountPrice } from '@/lib/utils/currency';
import { Separator } from '@/components/ui/separator';
import { calculateShippingCOP } from '@/lib/shipping';
import { FREE_SHIPPING_THRESHOLD_COP } from '@/lib/constants';

export default function Carrito() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();

  const cartItemsWithProducts = items.map((item) => {
    const product = getProductById(item.productId);
    return { ...item, product: product! };
  });

  const subtotal = getTotal();
  const shipping = calculateShippingCOP(subtotal);
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <EmptyState
            icon={<ShoppingBag className="h-16 w-16" />}
            title="Tu carrito está vacío"
            description="Agrega productos al carrito para comenzar tu compra"
            action={{ label: 'Ir al Catálogo', href: '/catalogo' }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Carrito de Compras</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItemsWithProducts.map((item) => {
              if (!item.product) return null;
              const finalPrice = item.product.discount
                ? calculateDiscountPrice(item.product.priceCOP, item.product.discount)
                : item.product.priceCOP;

              return (
                <Card key={item.productId} className="p-4">
                  <div className="flex gap-4">
                    <Link to={`/producto/${item.product.slug}`} className="flex-shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link to={`/producto/${item.product.slug}`}>
                        <h3 className="font-semibold hover:text-primary transition-colors line-clamp-2">
                          {item.product.title}
                        </h3>
                      </Link>
                      {item.variant && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {Object.entries(item.variant)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(', ')}
                        </p>
                      )}
                      <p className="text-lg font-bold text-primary mt-2">{formatCOP(finalPrice)}</p>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.productId)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>

                      <div className="flex items-center border rounded-lg">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.productId, item.qty - 1)}
                          disabled={item.qty <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-12 text-center text-sm font-medium">{item.qty}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.productId, item.qty + 1)}
                          disabled={item.qty >= item.product.stock}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-6">Resumen del Pedido</h2>

              <div className="space-y-3">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({items.reduce((sum, item) => sum + item.qty, 0)} productos)</span>
                  <span className="font-medium">{formatCOP(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Envío</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Gratis' : formatCOP(shipping)}
                  </span>
                </div>
                {shipping === 0 && <p className="text-sm text-success">🎉 ¡Tienes envío gratis!</p>}
                {subtotal < FREE_SHIPPING_THRESHOLD_COP && shipping > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Te faltan {formatCOP(FREE_SHIPPING_THRESHOLD_COP - subtotal)} para envío gratis
                  </p>
                )}
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between text-xl font-bold mb-6">
                <span>Total</span>
                <span className="text-primary">{formatCOP(total)}</span>
              </div>

              <Button size="lg" className="w-full" asChild>
                <Link to="/checkout">Proceder al Pago</Link>
              </Button>

              <Button variant="outline" className="w-full mt-3" asChild>
                <Link to="/catalogo">Continuar Comprando</Link>
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
