import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, PlusCircle, Package } from 'lucide-react';

export const AddProductModal = ({ isOpen, onClose }) => {
  const { addProduct } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Plywood',
    mm: '18mm',
    coreType: 'Red Core Gurjan',
    size: '8x4 ft',
    grade: 'BWP Grade 710',
    brand: 'Century Ply',
    price: 1800,
    unit: 'sheet',
    stock: 200,
    description: '',
    image: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=800&q=80',
    tags: '18mm, Red Core, BWP'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);

    addProduct({
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      tags: tagsArray
    });

    onClose();
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
        maxWidth: '650px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '1.75rem',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--timber-border)',
          paddingBottom: '1rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <PlusCircle size={24} style={{ color: 'var(--timber-gold)' }} />
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Add New Item to B2B Catalog</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Owner Master Control: Add Plywood, Fevicol, Doors, or Laminates
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
              Item Name / Description Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 18mm Heavy Duty Red Core Plywood (8x4)"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                Category *
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="Plywood">Plywood</option>
                <option value="Fevicol">Fevicol / Adhesives</option>
                <option value="Doors">Doors</option>
                <option value="Laminates">Laminates (Sunmica)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                Thickness (MM) *
              </label>
              <select
                value={formData.mm}
                onChange={e => setFormData({ ...formData, mm: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="18mm">18 mm</option>
                <option value="16mm">16 mm</option>
                <option value="13mm">13 mm</option>
                <option value="12mm">12 mm</option>
                <option value="10mm">10 mm</option>
                <option value="9mm">9 mm</option>
                <option value="6mm">6 mm</option>
                <option value="25mm">25 mm Blockboard</option>
                <option value="30mm">30 mm Door</option>
                <option value="32mm">32 mm Door</option>
                <option value="1.0mm">1.0 mm Laminate</option>
                <option value="N/A">N/A (Fevicol)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                Core Type / Resin Quality
              </label>
              <input
                type="text"
                placeholder="e.g. Red Core Gurjan / Alternate / Flexi"
                value={formData.coreType}
                onChange={e => setFormData({ ...formData, coreType: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                Sheet Dimensions / Pack Size
              </label>
              <input
                type="text"
                placeholder="e.g. 8x4 ft / 50 kg Bucket / 84x36 in"
                value={formData.size}
                onChange={e => setFormData({ ...formData, size: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--timber-gold)' }}>
                Wholesale Price (₹) *
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder="1850"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                style={{ width: '100%', borderColor: 'var(--timber-gold)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                Unit Type
              </label>
              <select
                value={formData.unit}
                onChange={e => setFormData({ ...formData, unit: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="sheet">sheet</option>
                <option value="bucket">bucket</option>
                <option value="door">door</option>
                <option value="tin">tin</option>
                <option value="box">box</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                Initial Stock Qty *
              </label>
              <input
                type="number"
                required
                min="0"
                placeholder="300"
                value={formData.stock}
                onChange={e => setFormData({ ...formData, stock: e.target.value })}
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
              placeholder="e.g. Century Ply / Pidilite Fevicol / Austin"
              value={formData.brand}
              onChange={e => setFormData({ ...formData, brand: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
              Description & Quality Warranty Notes
            </label>
            <textarea
              rows="3"
              placeholder="Add product specifications, calibration notes, warranty terms..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Package size={18} />
              Save Item to Catalog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
