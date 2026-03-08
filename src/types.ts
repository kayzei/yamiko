export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  sizes: string[];
  colors: string[];
  is_featured: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: number;
  status: string;
  total_price: number;
  payment_status: string;
  created_at: string;
}
