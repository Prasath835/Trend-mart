import { User, Product, Order, AdminStats, ShippingAddress } from '../types/index.ts';

const TOKEN_KEY = 'trend_mart_auth_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    request<{ user: User; token: string; message: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (payload: { name: string; email: string; phone: string; password: string; address?: string; role?: string }) =>
    request<{ user: User; token: string; message: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getMe: () =>
    request<{ user: User }>('/api/auth/me'),

  logout: () =>
    request<{ message: string }>('/api/auth/logout', { method: 'POST' }),
};

// Products API
export const productAPI = {
  getProducts: (params?: { category?: string; search?: string; sort?: string; minPrice?: number; maxPrice?: number }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.sort) query.append('sort', params.sort);
    if (params?.minPrice !== undefined) query.append('minPrice', String(params.minPrice));
    if (params?.maxPrice !== undefined) query.append('maxPrice', String(params.maxPrice));
    const qs = query.toString();
    return request<{ products: Product[]; total: number }>(`/api/products${qs ? `?${qs}` : ''}`);
  },

  getProductById: (id: string) =>
    request<{ product: Product }>(`/api/products/${id}`),

  createProduct: (data: Omit<Product, '_id' | 'createdAt'>) =>
    request<{ product: Product; message: string }>('/api/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateProduct: (id: string, data: Partial<Product>) =>
    request<{ product: Product; message: string }>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteProduct: (id: string) =>
    request<{ message: string }>(`/api/products/${id}`, {
      method: 'DELETE',
    }),
};

// Orders API
export const orderAPI = {
  createOrder: (payload: {
    items: Array<{ productId: string; name: string; price: number; quantity: number; image: string; category?: string }>;
    shippingAddress: ShippingAddress;
    paymentMethod: 'Cash on Delivery';
  }) =>
    request<{ order: Order; message: string }>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getMyOrders: () =>
    request<{ orders: Order[] }>('/api/orders/my-orders'),

  getOrderById: (id: string) =>
    request<{ order: Order }>(`/api/orders/${id}`),

  getAdminOrders: () =>
    request<{ orders: Order[]; total: number }>('/api/orders/admin/all'),

  updateOrderStatus: (id: string, status: Order['status']) =>
    request<{ order: Order; message: string }>(`/api/orders/admin/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};

// Admin API
export const adminAPI = {
  getCustomers: () =>
    request<{ customers: Array<User & { ordersCount?: number }>; total: number }>('/api/admin/customers'),

  getStats: () =>
    request<AdminStats & { isMongoConnected: boolean }>('/api/admin/stats'),
};
