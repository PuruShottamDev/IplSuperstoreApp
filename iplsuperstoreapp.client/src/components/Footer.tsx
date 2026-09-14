import React from 'react';
import type { AppRoute } from '../types';

interface FooterProps {
  setCurrentRoute: (route: AppRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentRoute }) => {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-top-row">
          
          <div>
            <div className="footer-brand-title">
              IPL SUPERSTORE
            </div>
            <p style={{ fontSize: '12px', color: '#64748b', maxWidth: '440px', margin: '6px 0 0 0', lineHeight: 1.5 }}>
              Official BCCI Licensed T20 Fan Merchandise. Powered by React 18, TypeScript, and .NET 8 Web API Architecture.
            </p>
          </div>

          <div className="footer-links-group">
            <button
              id="footer-storefront-link"
              onClick={() => {
                setCurrentRoute('catalog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="footer-link-btn"
            >
              Storefront
            </button>
            <button
              id="footer-cart-link"
              onClick={() => {
                setCurrentRoute('cart');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="footer-link-btn"
            >
              Cart
            </button>
            <button
              id="footer-orders-link"
              onClick={() => {
                setCurrentRoute('orders');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="footer-link-btn"
            >
              Order Tracking
            </button>
            <button
              id="footer-swagger-link"
              onClick={() => {
                setCurrentRoute('api_hub');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="footer-link-btn"
            >
              Swagger Docs
            </button>
            <span style={{ color: '#cbd5e1' }}>|</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#64748b' }}>
              BCCI Authenticity Verification: 100% Guaranteed
            </span>
          </div>

        </div>

        <div className="footer-bottom-row">
          <div>© 2025 IPL FanZone Arena. All rights reserved.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="pulse-dot"></span>
            <span>ASP.NET Core 8 Web API Operational (localhost:7042)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
