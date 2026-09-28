import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCartStore } from '@/lib/state/useCartStore';
import { useAuthStore } from '@/lib/state/useAuthStore';
import { useOrderStore } from '@/lib/state/useOrderStore';
import { getProductById } from '@/lib/repositories/productRepository';
import { formatCOP, calculateDiscountPrice } from '@/lib/utils/currency';
import { calculateShippingCOP } from '@/lib/shipping';
import { toast } from 'sonner';
import { CheckCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, clearCart, getTotal } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const addOrder = useOrderStore((state) => state.addOrder);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    paymentMethod: 'credit-card',
  });

  if (items.length === 0) {
    navigate('/carrito');
    return null;
  }

  if (!isAuthenticated) {
    toast.error('Debes iniciar sesión para realizar una compra');
    navigate('/login');
    return null;
  }

  const subtotal = getTotal();
  const shipping = calculateShippingCOP(subtotal);
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Validaciones básicas
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.city
    ) {
      toast.error('Por favor completa todos los campos');
      setIsProcessing(false);
      return;
    }

    // Simular procesamiento de pago
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Crear orden
    const order = {
      id: `ORD-${Date.now()}`,
      userId: user!.id,
      items,
      subtotalCOP: subtotal,
      shippingCOP: shipping,
      totalCOP: total,
      status: 'confirmed' as const,
      createdAt: new Date(),
      shippingAddress: {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        phone: formData.phone,
      },
    };

    addOrder(order);
    clearCart();
    setIsProcessing(false);
    toast.success('¡Pedido realizado con éxito!');
    navigate(`/pedidos`);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Finalizar Compra</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Info */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-6">Información Personal</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre Completo *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Correo Electrónico *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="3001234567"
                    />
                  </div>
                </div>
              </Card>

              {/* Shipping Address */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-6">Dirección de Envío</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Dirección *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      placeholder="Calle 123 #45-67"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Ciudad *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      placeholder="Bogotá"
                    />
                  </div>
                </div>
              </Card>

              {/* Payment Method */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-6">Método de Pago</h2>
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                >
                  <div className="flex items-center space-x-3 border rounded-lg p-4">
                    <RadioGroupItem value="credit-card" id="credit-card" />
                    <Label htmlFor="credit-card" className="cursor-pointer flex-1">
                      Tarjeta de Crédito / Débito (Simulado)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 border rounded-lg p-4">
                    <RadioGroupItem value="pse" id="pse" />
                    <Label htmlFor="pse" className="cursor-pointer flex-1">
                      PSE (Simulado)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 border rounded-lg p-4">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="cursor-pointer flex-1">
                      Pago Contra Entrega
                    </Label>
                  </div>
                </RadioGroup>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-20">
                <h2 className="text-xl font-bold mb-6">Resumen del Pedido</h2>

                <div className="space-y-3 mb-6">
                  {items.map((item) => {
                    const product = getProductById(item.productId);
                    if (!product) return null;
                    const finalPrice = product.discount
                      ? calculateDiscountPrice(product.priceCOP, product.discount)
                      : product.priceCOP;

                    return (
                      <div key={item.productId} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {product.title.substring(0, 30)}... × {item.qty}
                        </span>
                        <span className="font-medium">{formatCOP(finalPrice * item.qty)}</span>
                      </div>
                    );
                  })}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-medium">{formatCOP(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Envío</span>
                    <span className="font-medium">
                      {shipping === 0 ? 'Gratis' : formatCOP(shipping)}
                    </span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between text-xl font-bold mb-6">
                  <span>Total</span>
                  <span className="text-primary">{formatCOP(total)}</span>
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isProcessing}>
                  {isProcessing ? (
                    <>Procesando...</>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Confirmar Pedido
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Al confirmar, aceptas nuestros términos y condiciones
                </p>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
