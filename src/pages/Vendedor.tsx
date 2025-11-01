import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore } from '@/lib/state/useAuthStore';
import { categories } from '@/mocks/seeds';
import { formatCOP } from '@/lib/utils/currency';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { Product } from '@/types';

export default function Vendedor() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceCOP: '',
    categoryId: '',
    stock: '',
    images: 'https://picsum.photos/seed/product/800/800',
  });

  if (!isAuthenticated || !user || user.role !== 'SELLER') {
    navigate('/login');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.priceCOP || !formData.categoryId || !formData.stock) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    const productData: Product = {
      id: editingProduct?.id || String(Date.now()),
      slug: formData.title.toLowerCase().replace(/\s+/g, '-'),
      title: formData.title,
      description: formData.description || 'Descripción del producto',
      priceCOP: parseInt(formData.priceCOP),
      images: [formData.images],
      categoryId: formData.categoryId,
      rating: 4.5,
      stock: parseInt(formData.stock),
    };

    if (editingProduct) {
      setMyProducts(myProducts.map((p) => (p.id === editingProduct.id ? productData : p)));
      toast.success('Producto actualizado');
    } else {
      setMyProducts([...myProducts, productData]);
      toast.success('Producto creado');
    }

    setFormData({
      title: '',
      description: '',
      priceCOP: '',
      categoryId: '',
      stock: '',
      images: 'https://picsum.photos/seed/product/800/800',
    });
    setEditingProduct(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      priceCOP: String(product.priceCOP),
      categoryId: product.categoryId,
      stock: String(product.stock),
      images: product.images[0],
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (productId: string) => {
    setMyProducts(myProducts.filter((p) => p.id !== productId));
    toast.success('Producto eliminado');
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
    setFormData({
      title: '',
      description: '',
      priceCOP: '',
      categoryId: '',
      stock: '',
      images: 'https://picsum.photos/seed/product/800/800',
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Panel de Vendedor</h1>
            <p className="text-muted-foreground">
              Gestiona tus productos ({myProducts.length})
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleDialogClose()}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Producto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priceCOP">Precio (COP) *</Label>
                    <Input
                      id="priceCOP"
                      name="priceCOP"
                      type="number"
                      value={formData.priceCOP}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock *</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="categoryId">Categoría *</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="images">URL de Imagen</Label>
                  <Input
                    id="images"
                    name="images"
                    value={formData.images}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingProduct ? 'Actualizar' : 'Crear'} Producto
                  </Button>
                  <Button type="button" variant="outline" onClick={handleDialogClose}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {myProducts.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No tienes productos</h3>
              <p className="text-muted-foreground mb-6">
                Crea tu primer producto y comienza a vender
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{product.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xl font-bold text-primary">
                      {formatCOP(product.priceCOP)}
                    </p>
                    <p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit className="mr-1 h-3 w-3" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
