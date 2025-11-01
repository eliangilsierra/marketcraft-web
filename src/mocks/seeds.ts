import { faker } from '@faker-js/faker/locale/es';
import type { Category, Product, User } from '@/types';

// Seed fijo para reproducibilidad
faker.seed(12345);

export const categories: Category[] = [
  { id: '1', name: 'Electrónica', slug: 'electronica' },
  { id: '2', name: 'Ropa y Moda', slug: 'ropa-moda' },
  { id: '3', name: 'Hogar y Muebles', slug: 'hogar-muebles' },
  { id: '4', name: 'Deportes', slug: 'deportes' },
  { id: '5', name: 'Libros', slug: 'libros' },
  { id: '6', name: 'Juguetes', slug: 'juguetes' },
  { id: '7', name: 'Belleza y Cuidado', slug: 'belleza-cuidado' },
  { id: '8', name: 'Alimentos y Bebidas', slug: 'alimentos-bebidas' },
  { id: '9', name: 'Mascotas', slug: 'mascotas' },
  { id: '10', name: 'Jardín', slug: 'jardin' },
];

const productTitles = {
  '1': [
    'Smartphone Galaxy Pro',
    'Laptop HP Pavilion',
    'Audífonos Bluetooth',
    'Tablet Android 12',
    'Smartwatch Deportivo',
    'Cámara Digital 4K',
    'Teclado Mecánico RGB',
    'Mouse Gamer Inalámbrico',
  ],
  '2': [
    'Camiseta Básica Algodón',
    'Jeans Slim Fit',
    'Zapatillas Deportivas',
    'Chaqueta de Cuero',
    'Vestido Casual Elegante',
    'Camisa Formal Hombre',
    'Sudadera con Capucha',
    'Pantalón Cargo',
  ],
  '3': [
    'Sofá Modular 3 Puestos',
    'Mesa de Centro Madera',
    'Lámpara de Pie Moderna',
    'Cojines Decorativos Set',
    'Espejo Pared Grande',
    'Estantería Minimalista',
    'Silla Ergonómica',
    'Cortinas Blackout',
  ],
  '4': [
    'Balón de Fútbol Profesional',
    'Pesas Ajustables 20kg',
    'Yoga Mat Premium',
    'Bicicleta de Montaña',
    'Raqueta de Tenis',
    'Cuerda para Saltar',
    'Guantes de Boxeo',
    'Botella Térmica 1L',
  ],
  '5': [
    'Cien Años de Soledad',
    'El Principito Edición Ilustrada',
    'Sapiens de Yuval Harari',
    'Hábitos Atómicos',
    'El Alquimista Paulo Coelho',
    'Padre Rico Padre Pobre',
    '1984 George Orwell',
    'Harry Potter Colección',
  ],
  '6': [
    'LEGO Set Ciudad',
    'Muñeca Interactiva',
    'Puzzle 1000 Piezas',
    'Carro de Control Remoto',
    'Peluche Gigante Oso',
    'Juego de Mesa Monopoly',
    'Patineta para Niños',
    'Kit de Ciencia Experimentos',
  ],
  '7': [
    'Set de Maquillaje Completo',
    'Crema Facial Antiedad',
    'Perfume Floral 100ml',
    'Plancha de Cabello Cerámica',
    'Kit de Uñas Profesional',
    'Mascarilla Facial Hidratante',
    'Cepillo Eléctrico Dental',
    'Sérum Vitamina C',
  ],
  '8': [
    'Café Premium Colombiano 500g',
    'Aceite de Oliva Extra Virgen',
    'Chocolate Artesanal',
    'Miel de Abeja Orgánica',
    'Té Verde Matcha',
    'Pasta Italiana Gourmet',
    'Vino Tinto Reserva',
    'Snacks Saludables Mix',
  ],
  '9': [
    'Alimento Perro Adulto 15kg',
    'Arena para Gatos 10kg',
    'Juguete Interactivo Mascota',
    'Cama para Perro Grande',
    'Collar GPS Localizador',
    'Rascador para Gatos',
    'Comedero Automático',
    'Correa Retráctil 5m',
  ],
  '10': [
    'Set de Herramientas Jardín',
    'Macetas Decorativas Set 5',
    'Semillas Orgánicas Mix',
    'Manguera Extensible 30m',
    'Fertilizante Natural 5kg',
    'Tijeras de Podar Profesional',
    'Regadera Automática',
    'Luces Solares Jardín',
  ],
};

function generateProducts(): Product[] {
  const products: Product[] = [];
  let idCounter = 1;

  categories.forEach((category) => {
    const titles = productTitles[category.id as keyof typeof productTitles] || [];
    const productsPerCategory = Math.floor(80 / categories.length) + faker.number.int({ min: 0, max: 2 });

    for (let i = 0; i < productsPerCategory; i++) {
      const title = titles[i % titles.length] || faker.commerce.productName();
      const basePrice = faker.number.int({ min: 20000, max: 5000000 });
      const hasDiscount = faker.datatype.boolean({ probability: 0.3 });

      products.push({
        id: String(idCounter++),
        slug: faker.helpers.slugify(title).toLowerCase(),
        title,
        description: faker.commerce.productDescription(),
        priceCOP: basePrice,
        images: Array.from({ length: faker.number.int({ min: 1, max: 4 }) }, (_, idx) => 
          `https://picsum.photos/seed/${idCounter}-${idx}/800/800`
        ),
        categoryId: category.id,
        rating: faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }),
        stock: faker.number.int({ min: 0, max: 150 }),
        featured: faker.datatype.boolean({ probability: 0.15 }),
        discount: hasDiscount ? faker.number.int({ min: 5, max: 40 }) : undefined,
        variants: faker.datatype.boolean({ probability: 0.4 })
          ? [
              {
                name: 'Color',
                values: faker.helpers.arrayElements(['Negro', 'Blanco', 'Azul', 'Rojo', 'Verde'], { min: 2, max: 4 }),
              },
            ]
          : undefined,
      });
    }
  });

  return products;
}

export const products = generateProducts();

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan@ejemplo.com',
    role: 'USER',
  },
  {
    id: '2',
    name: 'María González',
    email: 'maria@ejemplo.com',
    role: 'SELLER',
  },
];
