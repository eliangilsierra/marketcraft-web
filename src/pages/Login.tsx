import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/lib/state/useAuthStore';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER' as 'USER' | 'SELLER',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(loginData.email, loginData.password);
      toast.success('¡Bienvenido de nuevo!');
      navigate('/');
    } catch (_error) {
      toast.error('Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register(
        registerData.name,
        registerData.email,
        registerData.password,
        registerData.role
      );
      toast.success('¡Cuenta creada con éxito!');
      navigate('/');
    } catch (_error) {
      toast.error('Error al crear cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 font-bold text-2xl text-primary mb-8"
        >
          <Store className="h-8 w-8" />
          Marketcraft
        </Link>

        <Card className="p-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email">Correo Electrónico</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    placeholder="tu@email.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="login-password">Contraseña</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  💡 Tip: Usa cualquier email. Si incluye "seller", tendrás rol de vendedor.
                </p>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="register-name">Nombre Completo</Label>
                  <Input
                    id="register-name"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    placeholder="Juan Pérez"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="register-email">Correo Electrónico</Label>
                  <Input
                    id="register-email"
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    placeholder="tu@email.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="register-password">Contraseña</Label>
                  <Input
                    id="register-password"
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div>
                  <Label>Tipo de Cuenta</Label>
                  <div className="flex gap-4 mt-2">
                    <Button
                      type="button"
                      variant={registerData.role === 'USER' ? 'default' : 'outline'}
                      onClick={() => setRegisterData({ ...registerData, role: 'USER' })}
                      className="flex-1"
                    >
                      Comprador
                    </Button>
                    <Button
                      type="button"
                      variant={registerData.role === 'SELLER' ? 'default' : 'outline'}
                      onClick={() => setRegisterData({ ...registerData, role: 'SELLER' })}
                      className="flex-1"
                    >
                      Vendedor
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Al continuar, aceptas nuestros{' '}
          <a href="#" className="text-primary hover:underline">
            términos y condiciones
          </a>
        </p>
      </div>
    </div>
  );
}
