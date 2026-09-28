import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';
import Home from './pages/Home';

const Catalogo = lazy(() => import('./pages/Catalogo'));
const ProductoDetalle = lazy(() => import('./pages/ProductoDetalle'));
const Carrito = lazy(() => import('./pages/Carrito'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Pedidos = lazy(() => import('./pages/Pedidos'));
const Vendedor = lazy(() => import('./pages/Vendedor'));
const Login = lazy(() => import('./pages/Login'));
const Favoritos = lazy(() => import('./pages/Favoritos'));
const NotFound = lazy(() => import('./pages/NotFound'));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <ErrorBoundary>
              <Suspense fallback={null}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/catalogo" element={<Catalogo />} />
                  <Route path="/producto/:slug" element={<ProductoDetalle />} />
                  <Route path="/carrito" element={<Carrito />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/pedidos" element={<Pedidos />} />
                  <Route path="/vendedor" element={<Vendedor />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/favoritos" element={<Favoritos />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
