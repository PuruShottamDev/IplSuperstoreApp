export type AppRoute = 'catalog' | 'product_detail' | 'cart' | 'orders' | 'api_hub';

export type ProductCategory = 'All Categories' | 'Jerseys' | 'Caps & Flags' | 'Autographs' | 'Fan Gear';

export interface Franchise {
  id: string;
  name: string;
  short: string;
  color: string;
  bg: string;
  border: string;
}

export interface Product {
  id: string;
  name: string;
  franchise: string;
  category: string;
  priceINR: number;
  mrpINR: number;
  rating: number;
  reviews: number;
  stock: number;
  badge: string;
  sizes: string[];
  image: string;
  description: string;
  material: string;
  sku: string;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export interface OrderItem {
  id?: string;
  title: string;
  franchise?: string;
  category?: string;
  image?: string;
  sku?: string;
  size: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  status: 'In Transit' | 'Delivered' | 'Processing';
  stageIndex: number;
  courier: string;
  location: string;
  itemsSummary: string;
  items: OrderItem[];
  subtotalINR?: number;
  gstINR?: number;
  shippingINR?: number;
  totalINR: number;
  paymentMethod?: string;
  shippingAddress?: string;
  nfcCertificate?: string;
  trackingCode: string;
}
