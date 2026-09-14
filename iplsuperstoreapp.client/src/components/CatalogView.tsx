import React, { useState, useMemo } from 'react';
import { 
  Zap, 
  Flame, 
  Terminal, 
  Trophy, 
  SlidersHorizontal 
} from 'lucide-react';
import type { Product, ProductCategory, AppRoute } from '../types';
import { FRANCHISES, PRODUCTS_DATA } from '../data/products';
import { ProductCard } from './ProductCard';

interface CatalogViewProps {
  onSelectProduct: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: string, e: React.MouseEvent) => void;
  currency: 'INR' | 'USD';
  searchQuery: string;
  setCurrentRoute: (route: AppRoute) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  onSelectProduct,
  onQuickView,
  onAddToCart,
  currency,
  searchQuery,
  setCurrentRoute,
}) => {
  const [selectedFranchise, setSelectedFranchise] = useState<string>('ALL');
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('All Categories');
  const [sortBy, setSortBy] = useState<string>('popular');

  const categories: ProductCategory[] = [
    'All Categories',
    'Jerseys',
    'Caps & Flags',
    'Autographs',
    'Fan Gear'
  ];

  const filteredProducts = useMemo(() => {
    let list = PRODUCTS_DATA.filter(p => {
      const matchFranchise = selectedFranchise === 'ALL' || p.franchise === selectedFranchise;
      const matchCategory = activeCategory === 'All Categories' || p.category === activeCategory;
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.franchise.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchFranchise && matchCategory && matchSearch;
    });

    if (sortBy === 'low_to_high') {
      list = [...list].sort((a, b) => a.priceINR - b.priceINR);
    } else if (sortBy === 'high_to_low') {
      list = [...list].sort((a, b) => b.priceINR - a.priceINR);
    } else if (sortBy === 'hologram') {
      list = [...list].sort((a, b) => (b.badge === 'Official Hologram' ? 1 : 0) - (a.badge === 'Official Hologram' ? 1 : 0));
    }

    return list;
  }, [selectedFranchise, activeCategory, searchQuery, sortBy]);

  return (
    <main className="ipl-main-content">
      {/* 1. MATCHDAY HERO BANNER */}
      <section className="hero-matchday-banner">
        <div className="hero-text-content">
          <div className="hero-tags-row">
            <span className="hero-drop-tag">
              <Zap className="w-3.5 h-3.5" style={{ fill: 'currentColor' }} />
              <span>Official TATA IPL 2025 Drop</span>
            </span>
            <span className="hero-bcci-tag">
              BCCI Verified Authenticity Seals
            </span>
          </div>

          <h1 className="hero-title">
            T20 FEVER: MATCH-READY APPAREL & COLLECTIBLES
          </h1>

          <p className="hero-description">
            Direct from official franchise locker rooms. Featuring RFID-verified autographed bats, moisture-wicking match jerseys, and stadium supporter caps with .NET 8 verified dispatch.
          </p>

          <div className="hero-actions-row">
            <button
              id="hero-dhoni-btn"
              onClick={() => {
                setSelectedFranchise('CSK');
                setActiveCategory('Jerseys');
              }}
              className="btn-hero-primary"
            >
              <Flame className="w-4 h-4" style={{ color: '#fde047', fill: '#fde047' }} />
              <span>Dhoni #7 Edition</span>
            </button>
            <button
              id="hero-kohli-btn"
              onClick={() => {
                setSelectedFranchise('RCB');
                setActiveCategory('Autographs');
              }}
              className="btn-hero-secondary"
            >
              Kohli #18 Memorabilia
            </button>
            <button
              id="hero-inspect-api-btn"
              onClick={() => setCurrentRoute('api_hub')}
              className="btn-hero-pipeline"
            >
              <Terminal className="w-4 h-4" />
              <span>Inspect .NET 8 Pipeline</span>
            </button>
          </div>
        </div>

        {/* Live Telemetry Card (Right) */}
        <div className="hero-telemetry-badge">
          <div className="telemetry-hero-title">LIVE TELEMETRY</div>
          <div>Franchises: 6 Registered</div>
          <div>Cache Engine: Redis v7.2</div>
          <div className="telemetry-hero-online">
            <span className="pulse-dot"></span>
            <span>Dispatch Desk Online</span>
          </div>
        </div>
      </section>

      {/* 2. SELECT FRANCHISE SELECTOR */}
      <section className="franchise-section">
        <div className="franchise-header">
          <div className="franchise-header-title">
            <Trophy className="w-5 h-5" style={{ color: '#0b57d0' }} />
            <span>Select Franchise</span>
          </div>
          <span className="franchise-count-label">
            Showing {filteredProducts.length} items
          </span>
        </div>

        <div className="franchise-rail scrollbar-thin">
          {FRANCHISES.map(f => {
            const isSelected = selectedFranchise === f.id;
            return (
              <button
                key={f.id}
                id={`franchise-pill-${f.id}`}
                onClick={() => setSelectedFranchise(f.id)}
                className={`franchise-pill ${isSelected ? 'active' : ''}`}
              >
                <span
                  className="franchise-dot"
                  style={{ backgroundColor: f.color }}
                ></span>
                <span>{f.name}</span>
                {f.id !== 'ALL' && (
                  <span className="franchise-code-tag">
                    {f.short}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. CATEGORY FILTER BAR & SORTING */}
      <section className="filter-sort-bar">
        <div className="category-group scrollbar-thin">
          <span className="category-prefix">Category:</span>
          {categories.map(cat => (
            <button
              key={cat}
              id={`category-pill-${cat.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => setActiveCategory(cat)}
              className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="sort-group">
          <SlidersHorizontal className="w-3.5 h-3.5" style={{ color: '#94a3b8' }} />
          <span>Sort By:</span>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="popular">Most Popular (Match Picks)</option>
            <option value="low_to_high">Price: Low to High</option>
            <option value="high_to_low">Price: High to Low</option>
            <option value="hologram">BCCI Hologram Verified</option>
          </select>
        </div>
      </section>

      {/* 4. PRODUCT GRID */}
      {filteredProducts.length === 0 ? (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '48px', textAlign: 'center' }}>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>
            No merchandise found matching your filter or search query.
          </p>
          <button
            onClick={() => {
              setSelectedFranchise('ALL');
              setActiveCategory('All Categories');
            }}
            className="btn-hero-primary"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <section className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              currency={currency}
              onSelect={onSelectProduct}
              onQuickView={onQuickView}
              onAddToCart={onAddToCart}
            />
          ))}
        </section>
      )}
    </main>
  );
};
