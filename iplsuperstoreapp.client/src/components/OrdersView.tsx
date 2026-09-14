import React, { useState } from 'react';
import { 
  PackageCheck, 
  Truck, 
  MapPin, 
  //Clock, 
  CheckCircle2, 
  QrCode, 
  //ExternalLink, 
  ShieldCheck, 
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  FileText,
  //CreditCard,
  Download,
  //Eye,
  RefreshCw
} from 'lucide-react';
import type { Order, AppRoute, Product } from '../types';
import { PRODUCTS_DATA } from '../data/products';

interface OrdersViewProps {
  orders: Order[];
  currency: 'INR' | 'USD';
  setCurrentRoute: (route: AppRoute) => void;
  showToast: (msg: string) => void;
  onSelectProduct?: (product: Product) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  currency,
  setCurrentRoute,
  showToast,
  onSelectProduct,
}) => {
  const [selectedVerificationOrder, setSelectedVerificationOrder] = useState<Order | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [expandedOrderIds, setExpandedOrderIds] = useState<Record<string, boolean>>({
    [orders[0]?.id || '']: true // expand first order by default
  });

  const toggleExpand = (id: string) => {
    setExpandedOrderIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const formatPrice = (inr: number) => {
    if (currency === 'USD') {
      return `$${(inr / 83.5).toFixed(2)}`;
    }
    return `₹${inr.toLocaleString('en-IN')}`;
  };

  const handleProductClick = (productId?: string) => {
    if (!productId || !onSelectProduct) return;
    const found = PRODUCTS_DATA.find(p => p.id === productId);
    if (found) {
      onSelectProduct(found);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const stages = [
    { title: 'Placed', desc: 'Payment Verified' },
    { title: 'Confirmed', desc: 'BCCI Hologram Tagged' },
    { title: 'Packed', desc: 'Sealed with RFID' },
    { title: 'In Transit', desc: 'Out for Delivery' },
    { title: 'Delivered', desc: 'Turnstile Verified' },
  ];

  return (
    <main className="ipl-main-content">
      <div className="orders-page-wrapper">
        
        {/* Orders Header Row */}
        <div className="cart-title-row">
          <div className="cart-title-left">
            <div className="cart-title-icon-box" style={{ backgroundColor: '#d97706' }}>
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="cart-h1">Matchday Orders & Live Tracking</h1>
              <span className="cart-route-info">
                Route: /orders • Live Telemetry & Verified Product Manifest
              </span>
            </div>
          </div>

          <button
            id="orders-shop-more-btn"
            onClick={() => setCurrentRoute('catalog')}
            className="cart-continue-link"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Storefront</span>
          </button>
        </div>

        {/* Live Active Orders */}
        {orders.map((order) => {
          const currentStage = order.stageIndex;
          const progressPercent = Math.round(((currentStage + 1) / stages.length) * 100);
          const isExpanded = !!expandedOrderIds[order.id];

          return (
            <div
              key={order.id}
              id={`order-live-card-${order.id}`}
              className="order-live-card"
            >
              {/* Header Info */}
              <div className="order-live-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="franchise-code-tag" style={{ backgroundColor: '#eff6ff', color: '#0b57d0', fontWeight: 700 }}>
                      OFFICIAL DISPATCH
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#64748b' }}>
                      {order.date}
                    </span>
                  </div>
                  <h2 className="order-id-title">
                    Order #{order.id}
                  </h2>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#eff6ff', color: '#0b57d0', padding: '4px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700 }}>
                    <Truck className="w-3.5 h-3.5" />
                    <span>{order.status}</span>
                  </span>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '20px', color: '#0f172a', marginTop: '4px' }}>
                    {formatPrice(order.totalINR)}
                  </div>
                </div>
              </div>

              {/* Progress Track */}
              <div className="stepper-progress-track">
                <div
                  className="stepper-progress-fill"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

              {/* Stepper Labels */}
              <div className="order-stepper-grid">
                {stages.map((stage, idx) => {
                  const isDone = idx < currentStage;
                  const isCurrent = idx === currentStage;
                  return (
                    <div
                      key={stage.title}
                      className={isDone ? 'step-done' : isCurrent ? 'step-current' : 'step-pending'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
                        {isDone && <CheckCircle2 className="w-3 h-3" />}
                        <span>{stage.title}</span>
                      </div>
                      <div style={{ fontSize: '9px', opacity: 0.8 }}>{stage.desc}</div>
                    </div>
                  );
                })}
              </div>

              {/* Courier & Waybill Location */}
              <div style={{ backgroundColor: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginTop: '16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', fontSize: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin className="w-4 h-4" style={{ color: '#0b57d0' }} />
                  <div>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{order.courier}: </span>
                    <span style={{ color: '#64748b' }}>{order.location}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#64748b' }}>
                    Waybill: <strong>{order.trackingCode}</strong>
                  </span>
                  <button
                    id={`verify-nfc-btn-${order.id}`}
                    onClick={() => setSelectedVerificationOrder(order)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: '6px', backgroundColor: '#eff6ff', color: '#0b57d0', fontSize: '11px', fontWeight: 600, border: '1px solid #bfdbfe' }}
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>NFC Certificate</span>
                  </button>
                  <button
                    id={`view-invoice-btn-${order.id}`}
                    onClick={() => setSelectedInvoiceOrder(order)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: '6px', backgroundColor: '#ffffff', color: '#475569', fontSize: '11px', fontWeight: 600, border: '1px solid #cbd5e1' }}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Invoice</span>
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div style={{ marginTop: '14px', fontSize: '12px', color: '#475569' }}>
                <strong>Ordered Gear:</strong> {order.itemsSummary}
              </div>

              {/* Expand / Collapse and Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button onClick={() => toggleExpand(order.id)} className="btn-link">
                    {isExpanded ? <ChevronUp /> : <ChevronDown />} {isExpanded ? 'Hide Details' : 'Show Details'}
                  </button>
                  <button onClick={() => setSelectedInvoiceOrder(order)} className="btn-link">View Invoice</button>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleProductClick(order.items[0]?.id)} className="btn-ghost">View Product</button>
                  <button onClick={() => showToast('Refresh tracking status requested')} className="btn-ghost"><RefreshCw /></button>
                </div>
              </div>

              {/* Expanded Order Details */}
              {isExpanded && (
                <div style={{ marginTop: '12px', backgroundColor: '#fff', border: '1px solid #e6eef8', borderRadius: '8px', padding: '12px' }}>
                  {order.items.map((it, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '8px 0', borderBottom: idx < order.items.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                      <img src={it.image || '/assets/placeholder.png'} alt={it.title} style={{ width: 68, height: 68, objectFit: 'cover', borderRadius: 8 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <strong style={{ fontSize: '14px' }}>{it.title}</strong>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>{it.sku}</span>
                        </div>
                        <div style={{ marginTop: 6, fontSize: '13px', color: '#475569' }}>{it.size} • {formatPrice(it.price)} each</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700 }}>{formatPrice(it.price * it.qty)}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{it.qty} pcs</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          );
        })}

        {/* Smart NFC Modal */}
        {selectedVerificationOrder && (
          <div className="modal-backdrop" onClick={() => setSelectedVerificationOrder(null)}>
            <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShieldCheck className="w-5 h-5" />
                  <div>
                    <h3 style={{ margin: 0 }}>NFC Certificate & Verification</h3>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{selectedVerificationOrder.id} • {selectedVerificationOrder.trackingCode}</div>
                  </div>
                </div>
                <button onClick={() => setSelectedVerificationOrder(null)} style={{ fontSize: 18, color: '#94a3b8' }}>✕</button>
              </div>

              <div style={{ marginTop: 12 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ background: '#f1f5f9', padding: 12, borderRadius: 8 }}>
                    <QrCode className="w-8 h-8" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{selectedVerificationOrder.courier}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{selectedVerificationOrder.location}</div>
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <button onClick={() => { showToast('NFC Certificate verified successfully'); setSelectedVerificationOrder(null); }} className="btn-proceed-pay">Verify & Close</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Invoice Modal */}
        {selectedInvoiceOrder && (
          <div className="modal-backdrop" onClick={() => setSelectedInvoiceOrder(null)}>
            <div className="modal-content-card" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText className="w-5 h-5" style={{ color: '#0b57d0' }} />
                  <div>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                      Official Tax Invoice & Receipt
                    </h3>
                    <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                      Invoice #{selectedInvoiceOrder.id} • {selectedInvoiceOrder.date}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedInvoiceOrder(null)}
                  style={{ color: '#94a3b8', fontSize: '18px', fontWeight: 700 }}
                >
                  ✕
                </button>
              </div>

              {/* Invoice Products Table */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                      <th style={{ padding: '10px 12px' }}>Item & Specifications</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center' }}>Size</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center' }}>Qty</th>
                      <th style={{ padding: '10px 12px', textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoiceOrder.items.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '10px 12px' }}>
                          <strong style={{ color: '#0f172a' }}>{item.title}</strong>
                          <div style={{ fontSize: '10px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                            SKU: {item.sku || 'IPL-AUTHENTIC-2025'}
                          </div>
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{item.size}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 600 }}>{item.qty}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                          {formatPrice(item.price * item.qty)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Summary */}
              <div style={{ backgroundColor: '#f8fafc', padding: '14px', borderRadius: '8px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Subtotal</span>
                  <span>{formatPrice(selectedInvoiceOrder.subtotalINR ?? Math.round(selectedInvoiceOrder.items.reduce((a,b) => a + b.price * b.qty, 0)))}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>GST (18% Sports Merchandise)</span>
                  <span>{formatPrice(selectedInvoiceOrder.gstINR ?? Math.round((selectedInvoiceOrder.subtotalINR ?? selectedInvoiceOrder.items.reduce((a,b) => a + b.price * b.qty, 0)) * 0.18))}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontWeight: 600 }}>
                  <span>Courier Shipping</span>
                  <span>FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #cbd5e1', paddingTop: '8px', marginTop: '4px', fontWeight: 800, fontSize: '16px', color: '#0f172a' }}>
                  <span>Grand Total Paid</span>
                  <span style={{ color: '#0b57d0' }}>{formatPrice(selectedInvoiceOrder.totalINR)}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button
                  onClick={() => {
                    showToast(`Tax Invoice #${selectedInvoiceOrder.id}.pdf generated & downloaded!`);
                    setSelectedInvoiceOrder(null);
                  }}
                  className="btn-proceed-pay"
                  style={{ flex: 1 }}
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Receipt</span>
                </button>
                <button
                  onClick={() => setSelectedInvoiceOrder(null)}
                  style={{ padding: '12px 18px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '12px', fontWeight: 600, color: '#475569' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
};
