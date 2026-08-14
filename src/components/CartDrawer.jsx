import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight, Truck } from 'lucide-react';

export const CartDrawer = ({ isOpen, onClose }) => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    placeOrder,
    currentDealer
  } = useApp();

  const [deliveryNotes, setDeliveryNotes] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxGst = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + taxGst;

  const handleCheckout = () => {
    placeOrder(deliveryNotes);
    onClose();
  };

  return (
    <div className="no-print" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(6px)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <div className="animate-fade-in" style={{
        background: 'var(--bg-card)',
        borderLeft: '1px solid var(--timber-border)',
        width: '100%',
        maxWidth: '480px',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Drawer Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--timber-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <ShoppingBag size={22} style={{ color: 'var(--timber-gold)' }} />
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>B2B Wholesale Order Cart</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {cart.length} item line(s) selected
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Dealer Firm Summary */}
        <div style={{
          padding: '0.85rem 1.5rem',
          background: 'rgba(245, 158, 11, 0.08)',
          borderBottom: '1px solid var(--timber-border)',
          fontSize: '0.82rem'
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Ordering Firm:</p>
          <p style={{ fontWeight: 700, color: 'var(--timber-gold-light)' }}>{currentDealer.firmName}</p>
          <p style={{ color: 'var(--text-secondary)' }}>Delivery: {currentDealer.address}</p>
        </div>

        {/* Cart Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <ShoppingBag size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <p style={{ fontSize: '1rem', fontWeight: 600 }}>Your Cart is Empty</p>
              <p style={{ fontSize: '0.82rem', marginTop: '0.5rem' }}>
                Select Plywood sheets (18mm, 12mm), Fevicol buckets, or Doors from the catalog to place order.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cart.map((item) => (
                <div key={item.id} style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--timber-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1rem',
                  display: 'flex',
                  gap: '0.85rem'
                }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: 'var(--radius-sm)',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <h4 style={{ fontSize: '0.88rem', fontWeight: 700, lineHeight: 1.3 }}>{item.name}</h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{ background: 'transparent', color: 'var(--accent-red)', padding: '2px' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.4rem 0' }}>
                      {item.mm && item.mm !== 'N/A' && (
                        <span className="badge badge-mm" style={{ fontSize: '0.65rem' }}>{item.mm}</span>
                      )}
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>₹{item.price} / {item.unit}</span>
                    </div>

                    {/* Quantity Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#16110d', border: '1px solid var(--timber-border)', borderRadius: 'var(--radius-sm)', padding: '2px' }}>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          style={{ background: 'transparent', color: 'var(--text-primary)', padding: '0.25rem 0.5rem' }}
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{ fontWeight: 800, padding: '0 0.5rem', fontSize: '0.88rem', color: 'var(--timber-gold)' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          style={{ background: 'transparent', color: 'var(--text-primary)', padding: '0.25rem 0.5rem' }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff' }}>
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer & Checkout */}
        {cart.length > 0 && (
          <div style={{
            padding: '1.25rem 1.5rem',
            borderTop: '1px solid var(--timber-border)',
            background: 'var(--bg-secondary)'
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                Delivery / Loading Instructions:
              </label>
              <input
                type="text"
                placeholder="e.g. Deliver before 4 PM, call driver upon loading..."
                value={deliveryNotes}
                onChange={e => setDeliveryNotes(e.target.value)}
                style={{ width: '100%', fontSize: '0.82rem' }}
              />
            </div>

            <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Item Subtotal:</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Estimated GST (18%):</span>
                <span>₹{taxGst.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', color: 'var(--timber-gold-light)', borderTop: '1px solid var(--timber-border)', paddingTop: '0.5rem' }}>
                <span>Total Amount:</span>
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
            >
              <span>Submit Requirement to Owner (Father)</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
