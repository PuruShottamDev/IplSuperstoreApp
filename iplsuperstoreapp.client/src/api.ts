/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CartItem, Order, Product } from './types';

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://localhost:7185').replace(/\/$/, '');

type ApiProduct = Partial<Product> & Record<string, unknown>;

const getToken = () => localStorage.getItem('ipl_access_token');
const unwrap = <T>(payload: any): T => payload?.data ?? payload?.items ?? payload;

const mapProduct = (value: ApiProduct): Product => ({
  id: String(value.id ?? value.productId),
  name: String(value.name ?? value.title ?? 'IPL merchandise'),
  franchise: String(value.franchise ?? value.team ?? 'ALL'),
  category: String(value.category ?? value.type ?? 'Fan Gear'),
  priceINR: Number(value.priceINR ?? value.price ?? 0),
  mrpINR: Number(value.mrpINR ?? value.mrp ?? value.priceINR ?? value.price ?? 0),
  rating: Number(value.rating ?? 0),
  reviews: Number(value.reviews ?? value.reviewCount ?? 0),
  stock: Number(value.stock ?? value.stockQuantity ?? 0),
  badge: String(value.badge ?? value.label ?? 'Official Merchandise'),
  sizes: Array.isArray(value.sizes) ? value.sizes.map(String) : ['Standard'],
  image: String(value.image ?? value.imageUrl ?? ''),
  description: String(value.description ?? ''),
  material: String(value.material ?? 'Official IPL merchandise'),
  sku: String(value.sku ?? value.id ?? '')
});

const mapCartItem = (value: any): CartItem => ({
  product: mapProduct(value.product ?? value),
  size: String(value.size ?? value.variant ?? value.product?.sizes?.[0] ?? 'Standard'),
  quantity: Number(value.quantity ?? value.qty ?? 1)
});

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });
  if (!response.ok) throw new Error(`API request failed (${response.status})`);
  if (response.status === 204) return undefined as T;
  return response.json();
};

export const api = {
  async getProducts(params: { search?: string; type?: string; franchise?: string; page?: number; pageSize?: number; sort?: string }) {
    const query = new URLSearchParams();
    Object.entries({ page: 1, pageSize: 20, sort: 'popular', ...params }).forEach(([key, value]) => {
      if (value !== undefined) query.set(key, String(value));
    });
    const payload = await request<any>(`/api/products?${query}`);
    const rawProducts = unwrap<any[]>(payload) || [];
    return {
      products: rawProducts.map(mapProduct),
      totalCount: Number(payload?.totalCount ?? payload?.total ?? rawProducts.length)
    };
  },
  async getProduct(id: string) {
    return mapProduct(await request<ApiProduct>(`/api/products/${encodeURIComponent(id)}`));
  },
  createProduct(product: Partial<Product>) {
    return request<Product>('/api/products', { method: 'POST', body: JSON.stringify(product) });
  },
  updateProduct(id: string, product: Partial<Product>) {
    return request<Product>(`/api/products/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(product) });
  },
  deleteProduct(id: string) {
    return request<void>(`/api/products/${encodeURIComponent(id)}`, { method: 'DELETE' });
  },
  async getCart() {
    const payload = await request<any>('/api/cart');
    const rawItems = payload?.items ?? payload?.cartItems ?? unwrap<any[]>(payload) ?? [];
    return rawItems.map(mapCartItem);
  },
  addCartItem(productId: string, quantity: number) {
    return request('/api/cart/items', { method: 'POST', body: JSON.stringify({ productId, quantity }) });
  },
  updateCartItem(productId: string, quantity: number) {
    return request(`/api/cart/items/${encodeURIComponent(productId)}`, { method: 'PUT', body: JSON.stringify({ quantity }) });
  },
  removeCartItem(productId: string) {
    return request(`/api/cart/items/${encodeURIComponent(productId)}`, { method: 'DELETE' });
  },
  placeOrder() {
    return request('/api/orders', { method: 'POST' });
  },
  async getOrders(page = 1, pageSize = 20) {
    const payload = await request<any>(`/api/orders?page=${page}&pageSize=${pageSize}`);
    return (unwrap<any[]>(payload) || []) as Order[];
  },
  getOrder(id: string) {
    return request<Order>(`/api/orders/${encodeURIComponent(id)}`);
  },
  async login(email: string, password: string) {
    // server expects { username, password } for demo AuthController
    const result = await request<{ token?: string; accessToken?: string }>('/api/auth/login', { method: 'POST', body: JSON.stringify({ username: email, password }) });
    const token = result.token ?? result.accessToken;
    if (token) localStorage.setItem('ipl_access_token', token);
    return result;
  },
  async register(email: string, password: string) {
    const result = await request<{ token?: string; accessToken?: string }>('/api/auth/register', { method: 'POST', body: JSON.stringify({ username: email, password }) });
    const token = result.token ?? result.accessToken;
    if (token) localStorage.setItem('ipl_access_token', token);
    return result;
  }
};