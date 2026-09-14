import React from 'react';
import { 
  ShoppingBag, 
  Search, 
  ArrowRight, 
  Sparkles, 
  Store, 
  FileText, 
  ShoppingCart, 
  PackageCheck, 
  Terminal, 
  X, 
  ShieldCheck 
} from 'lucide-react';
import type { AppRoute } from '../types';

interface HeaderProps {
  currentRoute: AppRoute;
  setCurrentRoute: (route: AppRoute) => void;
  cartCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currency: 'INR' | 'USD';
  setCurrency: React.Dispatch<React.SetStateAction<'INR' | 'USD'>>;
  apiLatency: number | string;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  setCurrentRoute,
  cartCount,
  searchQuery,
  setSearchQuery,
  currency,
  setCurrency,
  apiLatency,
}) => {
  const routes: { id: AppRoute; label: string; path: string; icon: React.ReactNode }[] = [
    { id: 'catalog', label: 'Storefront', path: '/store/catalog', icon: <Store className="w-3.5 h-3.5" style={{ color: '#059669' }} /> },
    { id: 'product_detail', label: 'Product Details', path: '/store/products/:id', icon: <FileText className="w-3.5 h-3.5" style={{ color: '#0891b2' }} /> },
    { id: 'cart', label: `Cart (${cartCount})`, path: '/cart', icon: <ShoppingCart className="w-3.5 h-3.5" style={{ color: '#0b57d0' }} /> },
    { id: 'orders', label: 'Orders & Tracking', path: '/orders', icon: <PackageCheck className="w-3.5 h-3.5" style={{ color: '#d97706' }} /> },
    { id: 'api_hub', label: 'API & Swagger', path: '/developer/api-hub', icon: <Terminal className="w-3.5 h-3.5" style={{ color: '#4f46e5' }} /> }
  ];

  return (
    <header className="site-header">
      {/* 1. TOP LIVE ARCHITECTURE & TELEMETRY BAR */}
      <div className="top-telemetry-bar">
        <div className="telemetry-inner">
          <div className="telemetry-left">
            <span className="telemetry-badge">
              <span className="pulse-dot"></span>
              <span>React 18 + TS SPA</span>
            </span>
            <span className="telemetry-divider">|</span>
            <span>
              State: <span className="telemetry-state-highlight">const [route, setRoute] = useState&lt;AppRoute&gt;('{currentRoute}')</span>
            </span>
            <span className="telemetry-divider">|</span>
            <span>
              .NET 8 API: <span className="telemetry-api-highlight">https://localhost:7042/api</span> ({apiLatency}ms)
            </span>
          </div>

          <div className="telemetry-right">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck className="w-3.5 h-3.5" style={{ color: '#059669' }} />
              <span>JWT HS256:</span>
              <strong style={{ color: '#047857' }}>Authorized</strong>
            </span>
            <span className="telemetry-divider">|</span>
            <button
              id="header-bag-shortcut-btn"
              onClick={() => setCurrentRoute('cart')}
              className="telemetry-bag-btn"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Bag: {cartCount} items</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN BRAND & ROUTER NAVIGATION */}
      <div className="header-container">
        <div className="header-row">
          {/* Brand Identity */}
          <div
            id="brand-logo-btn"
            className="brand-wrapper"
            onClick={() => setCurrentRoute('catalog')}
          >
            <div className="brand-crest">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="brand-heading-text">
                IPL SUPERSTORE
              </div>
              <span className="brand-sub-tag">
                Official Franchise FanZone • Light Edition
              </span>
            </div>
          </div>

          {/* Desktop Routes Switcher */}
          <nav className="desktop-nav-routes">
            {routes.map(route => {
              const isActive = currentRoute === route.id;
              return (
                <button
                  key={route.id}
                  id={`nav-route-${route.id}`}
                  onClick={() => setCurrentRoute(route.id)}
                  className={`route-tab-btn ${isActive ? 'active' : ''}`}
                >
                  <span className="route-tab-title">
                    {route.icon}
                    <span>{route.label}</span>
                  </span>
                  <span className="route-tab-path">{route.path}</span>
                </button>
              );
            })}
          </nav>

          {/* Search, Currency & CTA Actions */}
          <div className="header-actions">
            {/* Search Input */}
            <div className="search-wrapper">
              <Search className="w-4 h-4 search-icon-left" />
              <input
                id="search-products-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jersey, cap..."
                className="search-field"
              />
              {searchQuery && (
                <button
                  id="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  className="search-clear-btn"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Currency Toggle */}
            <button
              id="currency-toggle-btn"
              onClick={() => setCurrency(c => c === 'INR' ? 'USD' : 'INR')}
              className="currency-btn"
              title="Toggle Currency"
            >
              {currency === 'INR' ? '₹ INR' : '$ USD'}
            </button>

            {/* Shopping Bag Button */}
            <button
              id="header-cart-icon-btn"
              onClick={() => setCurrentRoute('cart')}
              className="cart-icon-btn"
              title="Open Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="cart-badge">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Primary Checkout CTA */}
            <button
              id="header-checkout-btn"
              onClick={() => setCurrentRoute('cart')}
              className="btn-checkout-nav"
            >
              <span>Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="mobile-nav-pills scrollbar-thin">
          {routes.map(route => (
            <button
              key={route.id}
              id={`mobile-nav-${route.id}`}
              onClick={() => setCurrentRoute(route.id)}
              className={`mobile-pill ${currentRoute === route.id ? 'active' : ''}`}
            >
              {route.icon}
              <span>{route.label}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
