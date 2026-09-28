import { useNavigate } from 'react-router-dom';
import { Package, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/EmptyState';
import { useAuthStore } from '@/lib/state/useAuthStore';
import { useOrderStore } from '@/lib/state/useOrderStore';
import { products } from '@/mocks/seeds';
import { formatCOP } from '@/lib/utils/currency';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const statusLabels = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

const statusVariants = {
  pending: 'secondary' as const,
  confirmed: 'default' as const,
  shipped: 'default' as const,
  delivered: 'default' as const,
  cancelled: 'destructive' as const,
};

export default function Pedidos() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const getOrdersByUserId = useOrderStore((state) => state.getOrdersByUserId);

  if (!isAuthenticated || !user) {
    navigate('/login');
    return null;
  }

  const orders = getOrdersByUserId(user.id);

  if (orders.length === 0) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <EmptyState
            icon={<Package className="h-16 w-16" />}
            title="No tienes pedidos"
            description="Realiza tu primera compra y aparecerá aquí"
            action={{ label: 'Ir al Catálogo', href: '/catalogo' }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Mis Pedidos</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-bold text-lg">Pedido #{order.id}</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(order.createdAt), "PPP 'a las' p", { locale: es })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={statusVariants[order.status]}>{statusLabels[order.status]}</Badge>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Detalles
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Detalles del Pedido #{order.id}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        {/* Order Info */}
                        <div>
                          <h4 className="font-semibold mb-2">Información del Pedido</h4>
                          <div className="text-sm space-y-1 text-muted-foreground">
                            <p>
                              <span className="font-medium">Estado:</span>{' '}
                              <Badge variant={statusVariants[order.status]}>
                                {statusLabels[order.status]}
                              </Badge>
                            </p>
                            <p>
                              <span className="font-medium">Fecha:</span>{' '}
                              {format(new Date(order.createdAt), "PPP 'a las' p", { locale: es })}
                            </p>
                          </div>
                        </div>

                        {/* Shipping Address */}
                        {order.shippingAddress && (
                          <div>
                            <h4 className="font-semibold mb-2">Dirección de Envío</h4>
                            <div className="text-sm text-muted-foreground">
                              <p>{order.shippingAddress.name}</p>
                              <p>{order.shippingAddress.address}</p>
                              <p>{order.shippingAddress.city}</p>
                              <p>Tel: {order.shippingAddress.phone}</p>
                            </div>
                          </div>
                        )}

                        {/* Products */}
                        <div>
                          <h4 className="font-semibold mb-3">Productos</h4>
                          <div className="space-y-3">
                            {order.items.map((item) => {
                              const product = products.find((p) => p.id === item.productId);
                              if (!product) return null;

                              return (
                                <div
                                  key={item.productId}
                                  className="flex gap-3 border rounded-lg p-3"
                                >
                                  <img
                                    src={product.images[0]}
                                    alt={product.title}
                                    className="w-16 h-16 object-cover rounded"
                                  />
                                  <div className="flex-1">
                                    <p className="font-medium text-sm">{product.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                      Cantidad: {item.qty}
                                    </p>
                                    {item.variant && (
                                      <p className="text-xs text-muted-foreground">
                                        {Object.entries(item.variant)
                                          .map(([key, value]) => `${key}: ${value}`)
                                          .join(', ')}
                                      </p>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">
                                      {formatCOP(product.priceCOP * item.qty)}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div className="border-t pt-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Subtotal</span>
                              <span className="font-medium">{formatCOP(order.subtotalCOP)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Envío</span>
                              <span className="font-medium">
                                {order.shippingCOP === 0 ? 'Gratis' : formatCOP(order.shippingCOP)}
                              </span>
                            </div>
                            <div className="flex justify-between text-lg font-bold pt-2 border-t">
                              <span>Total</span>
                              <span className="text-primary">{formatCOP(order.totalCOP)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
                  </span>
                  <span className="font-bold text-lg text-primary">
                    {formatCOP(order.totalCOP)}
                  </span>
                </div>
                {order.shippingAddress && (
                  <p className="text-sm text-muted-foreground">
                    Envío a: {order.shippingAddress.city}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
