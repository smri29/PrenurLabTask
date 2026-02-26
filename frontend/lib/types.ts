export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
}

export interface CartItem {
  productId: Product;
  quantity: number;
}

export type OrderStatus = 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderUser {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface OrderItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  _id: string;
  userId: string | OrderUser;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}
