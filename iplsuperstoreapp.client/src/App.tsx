/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useMemo } from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { AppRoute, Product, CartItem, Order } from './types';
import { PRODUCTS_DATA } from './data/products';
import { Header } from './components/Header';
import { CatalogView } from './components/CatalogView';
import { ProductDetailView } from './components/ProductDetailView';
import { CartView } from './components/CartView';
import { OrdersView } from './components/OrdersView';
import { ApiHubView } from './components/ApiHubView';
import { QuickViewModal } from './components/QuickViewModal';
import { Footer } from './components/Footer';
import { api } from './api';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('catalog');
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS_DATA[0]);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>(PRODUCTS_DATA);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [apiEndpoint, setApiEndpoint] = useState<string>('https://localhost:7042/api/v1');
  const [apiLatency, setApiLatency] = useState<number | string>(24);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    let isMounted = true;

    api.getProducts({ pageSize: 100 })
      .then(({ products }) => {
        if (isMounted && products.length > 0) setCatalogProducts(products);
      })
      .catch(() => {
        // Keep the bundled catalog available when the API is offline.
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Initial 3 items in Bag to match screenshot
  const [cart, setCart] = useState<CartItem[]>([
    { product: PRODUCTS_DATA[0], size: 'L', quantity: 1 },
    { product: PRODUCTS_DATA[1], size: 'Standard Fit', quantity: 1 },
    { product: PRODUCTS_DATA[7], size: 'One Size', quantity: 1 }
  ]);

  // Initial orders with full product details
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'IPL-ORD-98421',
      date: 'Today, 11:20 AM',
      status: 'In Transit',
      stageIndex: 3,
      courier: 'BlueDart Air Express',
      location: 'Dispatched from Wankhede Hub • ETA 4:30 PM',
      itemsSummary: '1x CSK 2025 Match Edition Jersey (L), 1x MI Commemorative Fan Cap',
      items: [
        {
          id: PRODUCTS_DATA[0].id,
          title: PRODUCTS_DATA[0].name,
          franchise: PRODUCTS_DATA[0].franchise,
          category: PRODUCTS_DATA[0].category,
          image: PRODUCTS_DATA[0].image,
          sku: PRODUCTS_DATA[0].sku,
          size: 'L',
          qty: 1,
          price: PRODUCTS_DATA[0].priceINR
        },
        {
          id: PRODUCTS_DATA[1].id,
          title: PRODUCTS_DATA[1].name,
          franchise: PRODUCTS_DATA[1].franchise,
          category: PRODUCTS_DATA[1].category,
          image: PRODUCTS_DATA[1].image,
          sku: PRODUCTS_DATA[1].sku,
          size: 'Standard Fit',
          qty: 1,
          price: PRODUCTS_DATA[1].priceINR
        }
      ],
      subtotalINR: 4798,
      gstINR: 864,
      shippingINR: 0,
      totalINR: 5662,
      paymentMethod: 'UPI (GPay / PhonePe) • ID: pay_98a7c2',
      shippingAddress: 'Flat 402, Wankhede Heights, Marine Drive, Mumbai 400020',
      trackingCode: 'BD-AIR-881920'
    }
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleAddToCart = (product: Product, size = 'M', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCart(prev => {
      const idx = prev.findIndex(item => item.product.id === product.id && item.size === size);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx].quantity += 1;
        return updated;
      }
      return [...prev, { product, size, quantity: 1 }];
    });
    showToast(`Added "${product.name.slice(0, 26)}..." (${size}) to Bag!`);
  };

  const handleBuyNow = (product: Product, size: string) => {
    handleAddToCart(product, size);
    setCurrentRoute('cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateQuantity = (id: string, size: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.product.id === id && item.size === size) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const orderId = `IPL-ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const subtotal = cart.reduce((acc, curr) => acc + curr.product.priceINR * curr.quantity, 0);
    const gst = Math.round(subtotal * 0.18);
    const summary = cart.map(i => `${i.quantity}x ${i.product.name.split('-')[0].trim()} (${i.size})`).join(', ');

    const newOrder: Order = {
      id: orderId,
      date: 'Just now',
      status: 'In Transit',
      stageIndex: 3,
      courier: 'BlueDart Air Express',
      location: 'Bengaluru Sort Facility • Dispatch Gate B',
      itemsSummary: summary,
      items: cart.map(i => ({
        id: i.product.id,
        title: i.product.name,
        franchise: i.product.franchise,
        category: i.product.category,
        image: i.product.image,
        sku: i.product.sku,
        size: i.size,
        qty: i.quantity,
        price: i.product.priceINR
      })),
      subtotalINR: subtotal,
      gstINR: gst,
      shippingINR: 0,
      totalINR: subtotal + gst,
      paymentMethod: 'Prepaid Razorpay / UPI • Authenticated',
      shippingAddress: 'Express Fan Delivery • Sector 14, Whitefield, Bengaluru 560066',
      trackingCode: `BD-AIR-${Math.floor(100000 + Math.random() * 900000)}`
    };

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    showToast(`Order #${orderId} verified & dispatched via .NET 8 Checkout Pipeline!`);
    setTimeout(() => {
      setCurrentRoute('orders');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 800);
  };

  const onSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentRoute('product_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cartCount = useMemo(() => cart.reduce((acc, curr) => acc + curr.quantity, 0), [cart]);

  return (
    <div className="ipl-app">
      {/* Dynamic Floating Toast Notification */}
      {toastMessage && (
        <div id="app-toast-popup" className="toast-popup">
          <CheckCircle2 className="w-4 h-4" style={{ color: '#34d399', flexShrink: 0 }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Application Header */}
      <Header
        currentRoute={currentRoute}
        setCurrentRoute={setCurrentRoute}
        cartCount={cartCount}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currency={currency}
        setCurrency={setCurrency}
        apiLatency={apiLatency}
      />

      {/* Main Routed View */}
      {currentRoute === 'catalog' && (
        <CatalogView
          products={catalogProducts}
          onSelectProduct={onSelectProduct}
          onQuickView={(p) => setQuickViewProduct(p)}
          onAddToCart={handleAddToCart}
          currency={currency}
          searchQuery={searchQuery}
          setCurrentRoute={setCurrentRoute}
        />
      )}

      {currentRoute === 'product_detail' && (
        <ProductDetailView
          product={selectedProduct}
          currency={currency}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          setCurrentRoute={setCurrentRoute}
        />
      )}

      {currentRoute === 'cart' && (
        <CartView
          cart={cart}
          updateQuantity={updateQuantity}
          currency={currency}
          setCurrentRoute={setCurrentRoute}
          onCheckout={handleCheckout}
          showToast={showToast}
        />
      )}

      {currentRoute === 'orders' && (
        <OrdersView
          orders={orders}
          currency={currency}
          setCurrentRoute={setCurrentRoute}
          showToast={showToast}
          onSelectProduct={onSelectProduct}
        />
      )}

      {currentRoute === 'api_hub' && (
        <ApiHubView
          setCurrentRoute={setCurrentRoute}
          apiEndpoint={apiEndpoint}
          setApiEndpoint={setApiEndpoint}
          apiLatency={apiLatency}
          setApiLatency={setApiLatency}
          showToast={showToast}
        />
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          currency={currency}
          onAddToCart={handleAddToCart}
          onViewFullDetails={onSelectProduct}
        />
      )}

      {/* Footer */}
      <Footer setCurrentRoute={setCurrentRoute} />
    </div>
  );
}