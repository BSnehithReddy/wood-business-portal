import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Edit3, Trash2 } from 'lucide-react';

export const EditProductModal = ({ product, isOpen, onClose }) => {
  const { editProduct, deleteProduct } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    stock: 0,
    mm: '18mm',
    coreType: '',
    brand: '',
    size: '',
    description: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price || 0,
        stock: product.stock || 0,
        mm: product.mm || '18mm',
        coreType: product.coreType || '',
        brand: product.brand || '',
        size: product.size || '',
        description: product.description || ''
      });
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    editProduct(product.id, {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock)
    });
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to remove "${product.name}" from the catalog?`)) {
      deleteProduct(product.id);
      onClose();
    }
  };

  return (
    <div className="no-print" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div className="animate-fade-in" style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--timber-border)',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '600px',
        padding: '1.75rem',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--timber-border)',
          paddingBottom: '1rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Edit3 size={22} style={{ color: 'var(--timber-gold)' }} />
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Edit Item Specs & Wholesale Price</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Product Code: <span style={{ color: 'var(--timber-gold)', fontWeight: 700 }}>{product.id}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
              Product Title
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--timber-gold)' }}>
                Wholesale Price (₹ / {product.unit}) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                style={{ width: '100%', borderColor: 'var(--timber-gold)', fontWeight: 700, fontSize: '1.05rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                Stock In Godown *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={e => setFormData({ ...formData, stock: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                Thickness MM
              </label>
              <input
                type="text"
                value={formData.mm}
                onChange={e => setFormData({ ...formData, mm: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                Core Composition / Type
              </label>
              <input
                type="text"
                value={formData.coreType}
                onChange={e => setFormData({ ...formData, coreType: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
              Brand / Manufacturer
            </label>
            <input
              type="text"
              value={formData.brand}
              onChange={e => setFormData({ ...formData, brand: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem' }}>
            <button
              type="button"
              onClick={handleDelete}
              className="btn-danger"
              style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }}
            >
              <Trash2 size={16} /> Delete Product
            </button>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Update Specifications
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
