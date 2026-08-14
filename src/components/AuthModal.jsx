import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, UserCheck, Building } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose }) => {
  const { currentDealer, setCurrentDealer, showToast } = useApp();

  const [formData, setFormData] = useState({ ...currentDealer });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentDealer(formData);
    showToast(`Dealer Profile updated for ${formData.firmName}`, 'success');
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
        maxWidth: '520px',
        padding: '1.75rem',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--timber-border)',
          paddingBottom: '1rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Building size={22} style={{ color: 'var(--timber-gold)' }} />
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Dealer Account Login & Details</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                B2B Firm Credentials for Booking Wholesale Orders
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
              Dealer Firm / Hardware Shop Name *
            </label>
            <input
              type="text"
              required
              value={formData.firmName}
              onChange={e => setFormData({ ...formData, firmName: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                Contact Person
              </label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                Phone / Mobile No *
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
              GSTIN / Tax ID
            </label>
            <input
              type="text"
              placeholder="36AAACG1234F1Z5"
              value={formData.gstin}
              onChange={e => setFormData({ ...formData, gstin: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
              Godown / Delivery Destination Address *
            </label>
            <textarea
              rows="3"
              required
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Dealer Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
