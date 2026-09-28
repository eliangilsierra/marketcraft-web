# MarketPlace - E-commerce Moderno con Datos Mock

Un marketplace funcional y moderno construido con React, TypeScript, Tailwind CSS y shadcn/ui. Incluye catálogo completo, carrito de compras, checkout simulado, gestión de pedidos y panel de vendedor con datos mock.

## 🚀 Características

### Funcionalidades Principales

- ✅ **Catálogo Completo**: 80+ productos con búsqueda, filtros y ordenamiento
- ✅ **Detalle de Producto**: Galería de imágenes, variantes, gestión de stock
- ✅ **Carrito Inteligente**: Control de stock, cálculo de envío, persistencia local
- ✅ **Checkout Simulado**: Formulario completo con confirmación de pedido
- ✅ **Gestión de Pedidos**: Historial con detalles y estados
- ✅ **Panel Vendedor**: CRUD de productos con validaciones
- ✅ **Sistema de Favoritos**: Con persistencia en localStorage
- ✅ **Autenticación Mock**: Login con roles (USER/SELLER)

### Características Técnicas

- 🎨 **Diseño Moderno**: Inspirado en marketplaces profesionales
- 🌙 **Modo Oscuro**: Soporte completo con tema personalizado
- 📱 **100% Responsivo**: Optimizado para móvil, tablet y desktop
- 💾 **Persistencia Local**: Carrito, favoritos y auth en localStorage
- 🇨🇴 **Localización es-CO**: Formato de moneda (COP) y fechas en español
- ⚡ **Performance**: Carga rápida con lazy loading de imágenes
- ♿ **Accesibilidad**: ARIA labels y navegación por teclado
- 🎯 **SEO**: Meta tags optimizados y estructura semántica

## 🛠️ Stack Tecnológico

- **Framework**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui + lucide-react
- **Estado**: Zustand con persistencia
- **Formularios**: React Hook Form + Zod
- **Mock Data**: Faker.js con seeds reproducibles
- **Utilidades**: date-fns, formateo COP, navegación React Router

## 📂 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Navbar.tsx      # Barra de navegación con búsqueda
│   ├── Footer.tsx      # Pie de página
│   ├── ProductCard.tsx # Tarjeta de producto
│   └── EmptyState.tsx  # Estados vacíos
├── pages/              # Páginas de la aplicación
│   ├── Home.tsx        # Inicio con hero y destacados
│   ├── Catalogo.tsx    # Catálogo con filtros
│   ├── ProductoDetalle.tsx # Detalle del producto
│   ├── Carrito.tsx     # Carrito de compras
│   ├── Checkout.tsx    # Proceso de pago
│   ├── Pedidos.tsx     # Historial de pedidos
│   ├── Vendedor.tsx    # Panel de vendedor
│   ├── Login.tsx       # Autenticación
│   └── Favoritos.tsx   # Lista de favoritos
├── lib/
│   ├── state/          # Stores de Zustand
│   │   ├── useAuthStore.ts
│   │   ├── useCartStore.ts
│   │   ├── useFavoritesStore.ts
│   │   └── useOrderStore.ts
│   └── utils/          # Utilidades
│       └── currency.ts # Formateo COP
├── mocks/
│   └── seeds.ts        # Datos mock (productos, categorías)
└── types/
    └── index.ts        # Tipos TypeScript
```

## 🎯 Páginas y Rutas

| Ruta              | Descripción                                        |
| ----------------- | -------------------------------------------------- |
| `/`               | Inicio con hero, categorías y productos destacados |
| `/catalogo`       | Catálogo completo con filtros y paginación         |
| `/producto/:slug` | Detalle del producto con galería y variantes       |
| `/carrito`        | Carrito de compras con resumen                     |
| `/checkout`       | Proceso de pago (simulado)                         |
| `/pedidos`        | Historial de pedidos del usuario                   |
| `/vendedor`       | Panel CRUD para vendedores                         |
| `/login`          | Login/registro (mock)                              |
| `/favoritos`      | Lista de productos favoritos                       |

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ y npm

### Instalación

```bash
# Clonar el repositorio
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:8080`

## 🧪 Datos de Prueba

### Autenticación Mock

- **Email**: cualquier email válido
  - Si incluye "seller" → Rol SELLER
  - De lo contrario → Rol USER
- **Contraseña**: cualquier valor (mock)

### Categorías

10 categorías con productos distribuidos:

- Electrónica
- Ropa y Moda
- Hogar y Muebles
- Deportes
- Libros
- Juguetes
- Belleza y Cuidado
- Alimentos y Bebidas
- Mascotas
- Jardín

### Productos

- 80+ productos generados con Faker
- Precios: COP $20.000 - $5.000.000
- Ratings: 3.5 - 5.0 estrellas
- Stock variable: 0 - 150 unidades
- ~30% con descuentos del 5-40%
- ~15% marcados como destacados

## 💡 Características Especiales

### Carrito Inteligente

- Validación de stock en tiempo real
- No permite agregar más del stock disponible
- Cálculo automático de envío (gratis >$100.000)
- Persistencia en localStorage

### Sistema de Favoritos

- Toggle rápido desde tarjetas de producto
- Persistencia local
- Página dedicada para gestión

### Panel de Vendedor

- Crear productos con validación
- Editar productos existentes
- Eliminar productos
- Vista previa con stock

### Filtros y Búsqueda

- Búsqueda por título/descripción
- Filtro por categoría
- Rango de precios con slider
- Ordenamiento múltiple:
  - Destacados
  - Precio (asc/desc)
  - Mejor calificados
  - Más recientes

## 🎨 Sistema de Diseño

### Paleta de Colores

- **Primario**: Azul océano (HSL 200, 95%, 45%)
- **Secundario**: Coral/naranja (HSL 20, 90%, 55%)
- **Éxito**: Verde esmeralda (HSL 142, 76%, 36%)
- Soporte completo para modo oscuro

### Componentes

Todos los componentes utilizan el design system definido en:

- `src/index.css`: Variables CSS (HSL)
- `tailwind.config.ts`: Configuración de Tailwind

### Sombras y Efectos

- `shadow-soft`: Sombra suave para elementos
- `shadow-card`: Sombra para tarjetas
- `shadow-float`: Sombra elevada
- Transiciones suaves en hover

## 📦 Dependencias Principales

```json
{
  "zustand": "State management con persistencia",
  "msw": "Mock Service Worker (preparado)",
  "@faker-js/faker": "Generación de datos mock",
  "react-hook-form": "Gestión de formularios",
  "zod": "Validación de esquemas",
  "date-fns": "Formateo de fechas",
  "sonner": "Sistema de toasts",
  "lucide-react": "Iconos",
  "shadcn/ui": "Componentes UI"
}
```

## 🚧 Próximas Mejoras (Opcionales)

- [ ] Cupones de descuento ("PRIMERA-COMPRA")
- [ ] Banner de promociones temporales
- [ ] Calificaciones de usuarios reales
- [ ] Chat de soporte
- [ ] Comparador de productos
- [ ] Integración con API real (intercambiar mock)

## 📝 Notas Técnicas

### Intercambiar Mock por HTTP Real

El proyecto está preparado para intercambiar los datos mock por una API real:

1. Implementar servicios HTTP en `/lib/api`
2. Cambiar imports en stores y pages
3. Configurar variable de entorno `NEXT_PUBLIC_API_MODE`

### Seeds Reproducibles

Los datos mock son reproducibles gracias a `faker.seed(12345)` en `src/mocks/seeds.ts`

### Persistencia

- **Cart**: `cart-storage` (localStorage)
- **Auth**: `auth-storage` (localStorage)
- **Favorites**: `favorites-storage` (localStorage)
- **Orders**: `order-storage` (localStorage)

## 📄 Licencia

Este proyecto es un demo educativo creado con Lovable.

---

**¡Listo para producción!** 🎉

El marketplace está completamente funcional con datos mock y preparado para integración con backend real.
