import React from 'react';
import { Star, ShoppingCart, Eye, BadgeCheck } from 'lucide-react';
import type { Product } from '../types';
import { FRANCHISES } from '../data/products';

interface ProductCardProps {
  product: Product;
  currency: 'INR' | 'USD';
  onSelect: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: string, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  onSelect,
  onQuickView,
  onAddToCart
}) => {
  const franchiseMeta = FRANCHISES.find(f => f.id === product.franchise) || FRANCHISES[0];

  const formatPrice = (inr: number) => {
    if (currency === 'USD') {
      return `$${(inr / 83.5).toFixed(2)}`;
    }
    return `₹${inr.toLocaleString('en-IN')}`;
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onSelect(product)}
      className="product-card"
    >
      <div>
        {/* Product Image Frame */}
        <div className="product-card-image-wrap">
          <img
            src={product.image}
            alt={product.name}
            className="product-card-image"
            loading="lazy"
          />

          {/* Top Hologram / Badge Tag */}
          <div className="product-badge-hologram">
            <BadgeCheck className="w-3.5 h-3.5" style={{ color: '#0b57d0' }} />
            <span>{product.badge}</span>
          </div>

          {/* Franchise Badge */}
          <div
            className="product-badge-team"
            style={{ backgroundColor: franchiseMeta.color }}
          >
            {product.franchise}
          </div>

          {/* Stock Urgency Indicator */}
          {product.stock <= 5 && (
            <div className="product-stock-pill">
              Only {product.stock} Left!
            </div>
          )}
        </div>

        {/* Product Card Details */}
        <div className="product-card-body">
          <div className="product-card-meta">
            <span className="product-category-text">
              {product.category}
            </span>
            <span className="product-rating-text">
              <Star className="w-3.5 h-3.5" style={{ fill: '#f59e0b', color: '#f59e0b' }} />
              <span>{product.rating}</span>
              <span style={{ color: '#94a3b8', fontWeight: 400 }}>({product.reviews})</span>
            </span>
          </div>

          <h3 className="product-title">
            {product.name}
          </h3>

          {/* Pricing */}
          <div className="product-price-row">
            <span className="product-price-value">
              {formatPrice(product.priceINR)}
            </span>
            <span className="product-mrp-value">
              {formatPrice(product.mrpINR)}
            </span>
            <span className="product-discount-tag">
              20% OFF
            </span>
          </div>

          {/* Size Pills */}
          <div className="product-sizes-row">
            {product.sizes.map(sz => (
              <span key={sz} className="product-size-pill">
                {sz}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="product-card-actions">
        <button
          id={`add-bag-btn-${product.id}`}
          onClick={(e) => onAddToCart(product, product.sizes[0] || 'M', e)}
          className="btn-card-add-bag"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Add to Bag</span>
        </button>

        <button
          id={`quickview-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="btn-card-quickview"
          title="Quick View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
