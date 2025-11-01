import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { categories, products } from '@/mocks/seeds';
import { Card } from '@/components/ui/card';

export default function Home() {
  const featuredProducts = products.filter((p) => p.featured).slice(0, 8);
  const discountedProducts = products.filter((p) => p.discount).slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-sm font-medium text-primary mb-6">
              <Sparkles className="h-4 w-4" />
              Bienvenido a MarketPlace
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Encuentra todo lo que necesitas
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Miles de productos, los mejores precios y envíos a toda Colombia
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" asChild>
                <Link to="/catalogo">
                  Ver Catálogo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/vendedor">Vender en MarketPlace</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Categorías Populares</h2>
              <p className="text-muted-foreground">Explora por categoría</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.slice(0, 10).map((category) => (
              <Link key={category.id} to={`/catalogo?category=${category.id}`}>
                <Card className="p-6 hover:shadow-card transition-all duration-300 hover:-translate-y-1 text-center group">
                  <ShoppingBag className="h-8 w-8 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Productos Destacados</h2>
              <p className="text-muted-foreground">Los más populares de la semana</p>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/catalogo">
                Ver todos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Offers */}
      {discountedProducts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="inline-flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full text-sm font-medium text-secondary mb-3">
                  <TrendingUp className="h-4 w-4" />
                  Ofertas Especiales
                </div>
                <h2 className="text-3xl font-bold mb-2">No te pierdas estas ofertas</h2>
                <p className="text-muted-foreground">Descuentos por tiempo limitado</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {discountedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">¿Tienes productos para vender?</h2>
          <p className="text-xl mb-8 opacity-90">
            Únete a miles de vendedores y alcanza millones de compradores
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/login">Comenzar a Vender</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
