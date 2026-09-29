export type UserRole = 'user' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  role: UserRole;
  createdAt: string;
}

export interface Product {
  _id: string;
  name: string;
  category: 'Electronics' | 'Fashion' | 'Accessories' | 'Home & Living' | 'Footwear';
  description: string;
  price: number;
  image: string;
  stock: number;
  featured?: boolean;
  rating?: number;
  highlightBadge?: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

export type OrderStatus = 'Order Placed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category?: string;
}

export interface Order {
  _id: string;
  user: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMethod: 'Cash on Delivery';
  status: OrderStatus;
  createdAt: string;
}

export interface AdminStats {
  totalProducts: number;
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: Order[];
}
