import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppingCart, Star, CheckCircle, Package, Plus } from 'lucide-react';

export const ProductGrid = ({ onOpenEdit }) => {
  const {
    products,
    selectedCategory,
    filterMM,
    filterCore,
    searchQuery,
    addToCart,
    activeRole
  } = useApp();

  // Filter products based on search, category, MM, and core
  const filteredProducts = products.filter(item => {
    // Category match
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;

    // MM match
    if (filterMM !== 'All' && item.mm !== filterMM) return false;

    // Core match
    if (filterCore !== 'All' && !item.coreType?.toLowerCase().includes(filterCore.toLowerCase())) return false;

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const nameMatch = item.name.toLowerCase().includes(q);
      const mmMatch = item.mm?.toLowerCase().includes(q);
      const categoryMatch = item.category.toLowerCase().includes(q);
      const coreMatch = item.coreType?.toLowerCase().includes(q);
      const brandMatch = item.brand?.toLowerCase().includes(q);
      return nameMatch || mmMatch || categoryMatch || coreMatch || brandMatch;
    }

    return true;
  });

  if (filteredProducts.length === 0) {
    return (
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--timber-border)',
        borderRadius: 'var(--radius-md)',
        padding: '4rem 2rem',
        textAlign: 'center',
        color: 'var(--text-muted)'
      }}>
        <Package size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
          No Products Match Your Criteria
        </h3>
        <p style={{ fontSize: '0.85rem', marginTop: '0.4rem' }}>
          Try clearing MM filters or changing your search terms (e.g. "18mm", "Red Core", "Fevicol").
        </p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '1.25rem'
    }}>
      {filteredProducts.map((product) => (
        <div
          key={product.id}
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            position: 'relative'
          }}
        >
          {/* Top Badges */}
          <div style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
            zIndex: 10,
            display: 'flex',
            gap: '0.4rem',
            flexWrap: 'wrap'
          }}>
            {product.mm && product.mm !== 'N/A' && (
              <span className="badge badge-mm">{product.mm}</span>
            )}
            <span className="badge badge-category">{product.category}</span>
          </div>

          {/* Owner Quick Edit Trigger */}
          {activeRole === 'OWNER' && (
            <button
              onClick={() => onOpenEdit(product)}
              style={{
                position: 'absolute',
                top: '0.75rem',
                right: '0.75rem',
                zIndex: 10,
                background: 'var(--timber-gold)',
                color: '#000',
                fontWeight: 800,
                fontSize: '0.75rem',
                padding: '0.35rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              Edit Price/Stock
            </button>
          )}

          {/* Product Image */}
          <div style={{ height: '180px', width: '100%', overflow: 'hidden', position: 'relative' }}>
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease'
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '50px',
              background: 'linear-gradient(to top, var(--bg-card) 0%, transparent 100%)'
            }} />
          </div>

          {/* Body Content */}
          <div style={{ padding: '1.1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              <span>{product.brand}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--timber-gold)' }}>
                <Star size={13} fill="currentColor" /> {product.rating}
              </span>
            </div>

            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.35, marginBottom: '0.5rem' }}>
              {product.name}
            </h3>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineClamp: 2, WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '0.85rem' }}>
              {product.description}
            </p>

            <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--timber-border)' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Wholesale Price:</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--timber-gold-light)' }}>
                    ₹{product.price.toLocaleString('en-IN')}
                    <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}> / {product.unit}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '0.2rem', justifyContent: 'flex-end', fontWeight: 700 }}>
                    <CheckCircle size={12} /> Stock Available
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    {product.stock} {product.unit}s
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => addToCart(product, 1)}
                className="btn-primary"
                style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem' }}
              >
                <Plus size={16} />
                <span>Add to Order Cart</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
