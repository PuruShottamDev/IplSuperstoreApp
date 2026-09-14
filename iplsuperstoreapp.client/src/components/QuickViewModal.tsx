import React, { useState } from 'react';
import { X, ShoppingCart, BadgeCheck, Star } from 'lucide-react';
import type { Product } from '../types';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  currency: 'INR' | 'USD';
  onAddToCart: (product: Product, size: string, e: React.MouseEvent) => void;
  onViewFullDetails: (product: Product) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  currency,
  onAddToCart,
  onViewFullDetails,
}) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'Standard');

  const formatPrice = (inr: number) => {
    if (currency === 'USD') {
      return `$${(inr / 83.5).toFixed(2)}`;
    }
    return `₹${inr.toLocaleString('en-IN')}`;
  };

  return (
    <div
      id="quickview-modal-backdrop"
      className="modal-backdrop"
      onClick={onClose}
    >
      <div
        id="quickview-modal-content"
        className="modal-content-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="close-quickview-btn"
          onClick={onClose}
          className="modal-close-btn"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="modal-layout-grid">
          {/* Product Image */}
          <div style={{ aspectRatio: '1 / 1', backgroundColor: '#f1f5f9', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', position: 'relative' }}>
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '3px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid #e2e8f0' }}>
              <BadgeCheck className="w-3.5 h-3.5" style={{ color: '#0b57d0' }} />
              <span>{product.badge}</span>
            </div>
          </div>

          {/* Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                <strong style={{ color: '#0b57d0' }}>{product.franchise} OFFICIAL</strong>
                <span>•</span>
                <span>{product.category}</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: '#0f172a', margin: '6px 0 0 0' }}>
                {product.name}
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#b45309', fontWeight: 600 }}>
              <Star className="w-4 h-4" style={{ fill: '#f59e0b', color: '#f59e0b' }} />
              <span>{product.rating}</span>
              <span style={{ color: '#94a3b8', fontWeight: 400 }}>({product.reviews} fan reviews)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '24px', color: '#0f172a' }}>
                {formatPrice(product.priceINR)}
              </span>
              <span style={{ fontSize: '12px', color: '#94a3b8', textDecoration: 'line-through' }}>
                {formatPrice(product.mrpINR)}
              </span>
              <span className="product-discount-tag">
                20% OFF
              </span>
            </div>

            <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
              {product.description}
            </p>

            {/* Size Selector */}
            <div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>Select Size:</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                {product.sizes.map(sz => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`btn-size-choice ${selectedSize === sz ? 'active' : ''}`}
                    style={{ padding: '6px 12px', fontSize: '11px' }}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '8px' }}>
              <button
                id="modal-add-bag-btn"
                onClick={(e) => {
                  onAddToCart(product, selectedSize, e);
                  onClose();
                }}
                className="btn-proceed-pay"
                style={{ padding: '10px', fontSize: '12px' }}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add ({selectedSize}) to Bag</span>
              </button>

              <button
                id="modal-view-full-btn"
                onClick={() => {
                  onViewFullDetails(product);
                  onClose();
                }}
                style={{ textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#0b57d0' }}
              >
                Open Full Dedicated Product Page →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
