import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  ShieldCheck, 
  Tag, 
  Truck, 
  ArrowLeft 
} from 'lucide-react';
import type { CartItem, AppRoute } from '../types';

interface CartViewProps {
  cart: CartItem[];
  updateQuantity: (id: string, size: string, delta: number) => void;
  currency: 'INR' | 'USD';
  setCurrentRoute: (route: AppRoute) => void;
  onCheckout: () => void;
  showToast: (msg: string) => void;
}

export const CartView: React.FC<CartViewProps> = ({
  cart,
  updateQuantity,
  currency,
  setCurrentRoute,
  onCheckout,
  showToast,
}) => {
  const [promoInput, setPromoInput] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  const formatPrice = (inr: number) => {
    if (currency === 'USD') {
      return `$${(inr / 83.5).toFixed(2)}`;
    }
    return `₹${inr.toLocaleString('en-IN')}`;
  };

  const subtotal = cart.reduce((acc, curr) => acc + curr.product.priceINR * curr.quantity, 0);
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const gst = Math.round((subtotal - discountAmount) * 0.18);
  const shipping = subtotal >= 2999 || subtotal === 0 ? 0 : 250;
  const grandTotal = subtotal - discountAmount + gst + shipping;

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (code === 'DHONI7' || code === 'KOHLI18') {
      setDiscountPercent(15);
      setAppliedPromo(code);
      showToast(`Promo code "${code}" applied: 15% Fan Discount!`);
      setPromoInput('');
    } else if (code === 'IPL2025') {
      setDiscountPercent(10);
      setAppliedPromo(code);
      showToast(`Promo code "${code}" applied: 10% Matchday Special!`);
      setPromoInput('');
    } else {
      showToast('Invalid promo code. Try DHONI7, KOHLI18 or IPL2025');
    }
  };

  return (
    <main className="ipl-main-content">
      <div className="cart-page-wrapper">
        
        {/* Page Title Row */}
        <div className="cart-title-row">
          <div className="cart-title-left">
            <div className="cart-title-icon-box">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h1 className="cart-h1">Fan Shopping Bag</h1>
              <span className="cart-route-info">
                Route: /cart • In-Memory React Cart State
              </span>
            </div>
          </div>

          <button
            id="cart-back-to-store-btn"
            onClick={() => setCurrentRoute('catalog')}
            className="cart-continue-link"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="free-shipping-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#0f172a' }}>
              <Truck className="w-4 h-4" style={{ color: '#0b57d0' }} />
              {subtotal >= 2999
                ? 'FREE Express Matchday Delivery Unlocked!'
                : `Add ${formatPrice(2999 - subtotal)} more for FREE Express Shipping`}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#64748b' }}>
              {Math.min(100, Math.round((subtotal / 2999) * 100))}%
            </span>
          </div>
          <div className="shipping-progress-track">
            <div
              className="shipping-progress-fill"
              style={{ width: `${Math.min(100, Math.round((subtotal / 2999) * 100))}%` }}
            ></div>
          </div>
        </div>

        {/* Cart Item Cards */}
        {cart.length === 0 ? (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '64px 24px', textAlign: 'center' }}>
            <ShoppingBag className="w-12 h-12" style={{ color: '#cbd5e1', margin: '0 auto 16px auto' }} />
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>
              Your Bag is Empty
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
              Explore official matchday kits, autographed bats, and commemorative caps.
            </p>
            <button
              onClick={() => setCurrentRoute('catalog')}
              className="btn-hero-primary"
            >
              Start Shopping Now
            </button>
          </div>
        ) : (
          <div className="cart-items-card">
            {cart.map((item, idx) => (
              <div
                key={`${item.product.id}-${item.size}`}
                id={`cart-item-row-${idx}`}
                className="cart-item-row"
              >
                <div className="cart-item-info-group">
                  <div className="cart-item-thumb">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="cart-item-img"
                    />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="franchise-code-tag" style={{ backgroundColor: '#dbeafe', color: '#0041a2' }}>
                        {item.product.franchise}
                      </span>
                      <span className="cart-item-details-line">
                        SKU: {item.product.sku}
                      </span>
                    </div>
                    <h3 className="cart-item-name">
                      {item.product.name}
                    </h3>
                    <div className="cart-item-details-line">
                      Size: <strong style={{ color: '#0f172a' }}>{item.size}</strong> • {formatPrice(item.product.priceINR)} each
                    </div>
                  </div>
                </div>

                <div className="cart-item-controls">
                  {/* Quantity Stepper */}
                  <div className="quantity-stepper">
                    <button
                      id={`qty-minus-${item.product.id}`}
                      onClick={() => updateQuantity(item.product.id, item.size, -1)}
                      className="btn-qty"
                      title="Decrease Quantity"
                    >
                      -
                    </button>
                    <span className="qty-number">
                      {item.quantity}
                    </span>
                    <button
                      id={`qty-plus-${item.product.id}`}
                      onClick={() => updateQuantity(item.product.id, item.size, 1)}
                      className="btn-qty"
                      title="Increase Quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Price & Remove */}
                  <div>
                    <div className="cart-item-price-total">
                      {formatPrice(item.product.priceINR * item.quantity)}
                    </div>
                    <button
                      id={`cart-remove-${item.product.id}`}
                      onClick={() => updateQuantity(item.product.id, item.size, -item.quantity)}
                      className="btn-remove-cart-item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Promo & Summary Calculation Section */}
        {cart.length > 0 && (
          <div className="cart-summary-grid">
            
            {/* Promo Code Box */}
            <div className="promo-code-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>
                <Tag className="w-4 h-4" style={{ color: '#0b57d0' }} />
                <span>Fan Discount Promo Code</span>
              </div>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '6px 0 0 0' }}>
                Use code <strong style={{ color: '#0b57d0' }}>DHONI7</strong> or <strong style={{ color: '#0b57d0' }}>KOHLI18</strong> for 15% OFF, or <strong style={{ color: '#0b57d0' }}>IPL2025</strong> for 10% OFF.
              </p>

              <div className="promo-input-row">
                <input
                  id="promo-code-input"
                  type="text"
                  placeholder="ENTER PROMO CODE"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="promo-input"
                />
                <button
                  id="apply-promo-btn"
                  onClick={handleApplyPromo}
                  className="btn-apply-promo"
                >
                  Apply
                </button>
              </div>

              {appliedPromo && (
                <div style={{ fontSize: '11px', color: '#047857', backgroundColor: '#ecfdf5', padding: '6px 12px', borderRadius: '6px', border: '1px solid #a7f3d0' }}>
                  ✓ Promo <strong>{appliedPromo}</strong> applied ({discountPercent}% Discount)
                </div>
              )}
            </div>

            {/* Order Summary Breakdown */}
            <div className="summary-breakdown-card">
              <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a', marginBottom: '14px' }}>
                Order Summary
              </div>

              <div className="summary-line">
                <span>Merchandise Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="summary-line" style={{ color: '#059669', fontWeight: 600 }}>
                  <span>Fan Club Discount ({discountPercent}%)</span>
                  <span>- {formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="summary-line">
                <span>GST (18% Sports Merchandise)</span>
                <span>{formatPrice(gst)}</span>
              </div>

              <div className="summary-line">
                <span>Matchday Courier Delivery</span>
                <span>{shipping === 0 ? <strong style={{ color: '#059669' }}>FREE</strong> : formatPrice(shipping)}</span>
              </div>

              <div className="summary-total-line">
                <span>Total Amount:</span>
                <span style={{ color: '#0b57d0' }}>{formatPrice(grandTotal)}</span>
              </div>

              <button
                id="btn-proceed-checkout"
                onClick={onCheckout}
                className="btn-proceed-pay"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11px', color: '#64748b', marginTop: '12px' }}>
                <ShieldCheck className="w-3.5 h-3.5" style={{ color: '#059669' }} />
                <span>BCCI Certified 256-Bit SSL Checkout Security</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  );
};
