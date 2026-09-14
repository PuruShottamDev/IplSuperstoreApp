import React, { useState } from 'react';
import { 
  Home, 
  BadgeCheck, 
  ShoppingCart, 
  Zap, 
  ArrowLeft, 
  QrCode, 
  Truck, 
  Box, 
  ShieldCheck 
} from 'lucide-react';
import type { Product, AppRoute } from '../types';

interface ProductDetailViewProps {
  product: Product;
  currency: 'INR' | 'USD';
  onAddToCart: (product: Product, size: string, e?: React.MouseEvent) => void;
  onBuyNow: (product: Product, size: string) => void;
  setCurrentRoute: (route: AppRoute) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  currency,
  onAddToCart,
  onBuyNow,
  setCurrentRoute,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'Standard');

  const formatPrice = (inr: number) => {
    if (currency === 'USD') {
      return `$${(inr / 83.5).toFixed(2)}`;
    }
    return `₹${inr.toLocaleString('en-IN')}`;
  };

  return (
    <main className="ipl-main-content">
      {/* Route Breadcrumb Bar */}
      <div className="breadcrumb-container">
        <button
          id="breadcrumb-catalog-btn"
          onClick={() => setCurrentRoute('catalog')}
          className="breadcrumb-btn"
        >
          <Home className="w-3.5 h-3.5" />
          <span>/store/catalog</span>
        </button>
        <span>/</span>
        <span style={{ color: '#94a3b8' }}>{product.category.toLowerCase()}</span>
        <span>/</span>
        <span className="breadcrumb-id">{product.id}</span>
      </div>

      <div className="detail-main-card">
        <div className="detail-grid">
          
          {/* Left: Product Image & Spec Badges */}
          <div>
            <div className="detail-image-box">
              <img
                src={product.image}
                alt={product.name}
                className="detail-image"
              />
              <div className="detail-badge-corner">
                <BadgeCheck className="w-4 h-4" style={{ color: '#0b57d0' }} />
                <span>{product.badge}</span>
              </div>
            </div>

            <div className="detail-specs-row">
              <div className="detail-spec-card">
                <div className="spec-card-label">
                  <Box className="w-3 h-3" />
                  <span>SKU Code</span>
                </div>
                <div className="spec-card-val">{product.sku}</div>
              </div>
              <div className="detail-spec-card">
                <div className="spec-card-label">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Inventory</span>
                </div>
                <div className="spec-card-val" style={{ color: '#059669' }}>In Stock ({product.stock})</div>
              </div>
              <div className="detail-spec-card">
                <div className="spec-card-label">
                  <Truck className="w-3 h-3" />
                  <span>Delivery</span>
                </div>
                <div className="spec-card-val">2-4 Matchdays</div>
              </div>
            </div>
          </div>

          {/* Right: Product Purchase Configurator */}
          <div className="detail-info-column">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="detail-franchise-tag">
                  {product.franchise} Official
                </span>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
                  BCCI Licensed Authenticated Product
                </span>
              </div>

              <h1 className="detail-title">
                {product.name}
              </h1>

              <div className="detail-price-box">
                <span className="detail-price-main">
                  {formatPrice(product.priceINR)}
                </span>
                <span className="detail-mrp-main">
                  {formatPrice(product.mrpINR)}
                </span>
                <span className="detail-tax-badge">
                  Inclusive of all taxes & duty
                </span>
              </div>

              {/* Size Selector */}
              <div style={{ marginTop: '20px' }}>
                <label className="size-selector-label">
                  <span>Select Size / Variant:</span>
                  <span style={{ color: '#0b57d0', textTransform: 'lowercase', fontFamily: 'var(--font-mono)' }}>
                    selected: {selectedSize}
                  </span>
                </label>
                <div className="size-buttons-group">
                  {product.sizes.map(sz => (
                    <button
                      key={sz}
                      id={`detail-size-${sz}`}
                      onClick={() => setSelectedSize(sz)}
                      className={`btn-size-choice ${selectedSize === sz ? 'active' : ''}`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Material & Description */}
              <div className="detail-desc-box" style={{ marginTop: '16px' }}>
                <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                  Description & Technical Spec:
                </div>
                <p style={{ margin: '0 0 6px 0' }}>{product.description}</p>
                <div>Material: <strong style={{ color: '#0f172a' }}>{product.material}</strong></div>
              </div>

              {/* Holographic Verification Notice */}
              <div className="detail-nfc-notice" style={{ marginTop: '16px' }}>
                <QrCode className="w-5 h-5" style={{ color: '#0b57d0', flexShrink: 0 }} />
                <span>Cryptographic NFC & hologram tag verifiable at stadium turnstiles.</span>
              </div>
            </div>

            {/* Action Row */}
            <div className="detail-actions-row">
              <button
                id="detail-add-bag-btn"
                onClick={() => onAddToCart(product, selectedSize)}
                className="btn-detail-add-bag"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Fan Bag</span>
              </button>

              <button
                id="detail-buynow-btn"
                onClick={() => onBuyNow(product, selectedSize)}
                className="btn-detail-buynow"
              >
                <Zap className="w-4 h-4" style={{ color: '#fde047', fill: '#fde047' }} />
                <span>Buy Now & Checkout</span>
              </button>

              <button
                id="detail-back-btn"
                onClick={() => setCurrentRoute('catalog')}
                className="btn-detail-back"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Catalog</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
};
