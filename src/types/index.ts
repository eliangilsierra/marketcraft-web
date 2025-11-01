export type UserRole = 'USER' | 'SELLER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

export interface ProductVariant {
  name: string;
  values: string[];
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceCOP: number;
  images: string[];
  categoryId: string;
  rating: number;
  stock: number;
  variants?: ProductVariant[];
  featured?: boolean;
  discount?: number;
}

export interface CartItem {
  productId: string;
  qty: number;
  variant?: Record<string, string>;
}

export interface CartItemWithProduct extends CartItem {
  product: Product;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotalCOP: number;
  shippingCOP: number;
  totalCOP: number;
  status: OrderStatus;
  createdAt: Date;
  shippingAddress?: {
    name: string;
    address: string;
    city: string;
    phone: string;
  };
}

export interface Filters {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price-asc' | 'price-desc' | 'rating' | 'newest';
}

export interface PaginationParams {
  page: number;
  perPage: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
