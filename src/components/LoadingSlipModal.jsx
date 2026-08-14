import React from 'react';
import { X, Printer, Send, Truck, ShieldCheck } from 'lucide-react';

export const LoadingSlipModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const generateWhatsAppText = () => {
    const itemsList = order.items.map(item => `• ${item.name}: ${item.quantity} ${item.unit}(s)`).join('\n');
    const text = `*MM WOOD BOARDS & LAMINATES - DISPATCH NOTE*\n` +
      `_Modern Ply for Modern Living_\n` +
      `----------------------------------------\n` +
      `*Order ID:* #${order.id}\n` +
      `*Status:* ${order.loadingStatus || 'Out for Delivery'}\n` +
      `*Confirmed By:* Owner\n\n` +
      `*Dealer Firm:* ${order.dealerName}\n` +
      `*Contact:* ${order.dealerContact}\n` +
      `*Delivery Location:* ${order.deliveryAddress}\n` +
      `*Vehicle No:* ${order.vehicleNumber || 'AP-28-TA-5544'}\n\n` +
      `*ITEMS LOADED & VERIFIED:*\n${itemsList}\n\n` +
      `*Invoice Total:* ₹${order.grandTotal?.toLocaleString('en-IN')}\n` +
      `----------------------------------------\n` +
      `Thank you for doing business with MM Wood Boards & Laminates!`;

    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="no-print-wrapper" style={{
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
        maxWidth: '700px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '2rem',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Action Header */}
        <div className="no-print" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--timber-border)',
          paddingBottom: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Truck size={24} style={{ color: '#10b981' }} />
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Godown Warehouse Loading Pass</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Order #{order.id} • Confirmed by Owner
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button onClick={handlePrint} className="btn-secondary" style={{ padding: '0.5rem 0.85rem', fontSize: '0.82rem' }}>
              <Printer size={16} /> Print Gate Pass
            </button>
            <a
              href={generateWhatsAppText()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-success"
              style={{ padding: '0.5rem 0.85rem', fontSize: '0.82rem' }}
            >
              <Send size={16} /> Send WhatsApp Alert
            </a>
            <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Pass Content */}
        <div className="loading-slip-print" style={{
          background: '#16110d',
          border: '1px solid var(--timber-border)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          color: 'var(--text-primary)'
        }}>
          <div style={{
            textAlign: 'center',
            borderBottom: '2px solid var(--timber-gold)',
            paddingBottom: '1rem',
            marginBottom: '1.25rem'
          }}>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ef4444', textTransform: 'uppercase', fontFamily: 'serif' }}>
              MM WOOD BOARDS & LAMINATES
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--timber-gold)', fontStyle: 'italic', fontWeight: 700 }}>
              Modern Ply for Modern Living
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Godown Bay No. 4, Industrial Estate, Hyderabad • Mob: +91 98490 00000
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '0.3rem 0.75rem',
              borderRadius: '99px',
              fontSize: '0.75rem',
              fontWeight: 800,
              marginTop: '0.5rem'
            }}>
              <ShieldCheck size={14} /> OWNER CONFIRMED DISPATCH GATE PASS
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            background: 'rgba(255,255,255,0.03)',
            padding: '1rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.25rem',
            fontSize: '0.85rem'
          }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Dealer Firm Name:</p>
              <p style={{ fontWeight: 800, fontSize: '0.95rem' }}>{order.dealerName}</p>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Contact: {order.dealerContact}</p>
              <p style={{ color: 'var(--text-secondary)' }}>GSTIN: {order.dealerGst || 'N/A'}</p>
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Order & Delivery Details:</p>
              <p style={{ fontWeight: 700 }}>Order ID: <span style={{ color: 'var(--timber-gold)' }}>#{order.id}</span></p>
              <p style={{ color: 'var(--text-secondary)' }}>Date: {order.orderDate}</p>
              <p style={{ color: '#10b981', fontWeight: 800 }}>
                Vehicle No: {order.vehicleNumber || 'AP-28-TA-5544'}
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              Delivery Address:
            </p>
            <p style={{ fontSize: '0.88rem', background: 'rgba(0,0,0,0.3)', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--timber-border)' }}>
              {order.deliveryAddress}
            </p>
          </div>

          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.88rem',
            marginBottom: '1.5rem'
          }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--timber-border)', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                <th style={{ padding: '0.6rem' }}>#</th>
                <th style={{ padding: '0.6rem' }}>Item Specs (Thickness / Core)</th>
                <th style={{ padding: '0.6rem', textAlign: 'center' }}>Loaded Quantity</th>
                <th style={{ padding: '0.6rem', textAlign: 'right' }}>Price</th>
                <th style={{ padding: '0.6rem', textAlign: 'right' }}>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '0.65rem' }}>{idx + 1}</td>
                  <td style={{ padding: '0.65rem', fontWeight: 600 }}>{item.name}</td>
                  <td style={{ padding: '0.65rem', textAlign: 'center', fontWeight: 800, color: 'var(--timber-gold)' }}>
                    {item.quantity} {item.unit}(s)
                  </td>
                  <td style={{ padding: '0.65rem', textAlign: 'right' }}>₹{item.price?.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '0.65rem', textAlign: 'right', fontWeight: 700 }}>₹{item.total?.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--timber-border)',
            paddingTop: '1rem'
          }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <p>✔ Items physically verified by Godown Staff</p>
              <p>✔ Sheet calibration & quality checked</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Subtotal: ₹{order.subtotal?.toLocaleString('en-IN')}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>GST (18%): ₹{order.taxGst?.toLocaleString('en-IN')}</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--timber-gold-light)' }}>
                Grand Total: ₹{order.grandTotal?.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            marginTop: '2.5rem',
            textAlign: 'center',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}>
            <div style={{ borderTop: '1px dashed var(--timber-border)', paddingTop: '0.5rem' }}>
              Godown Supervisor Signature
            </div>
            <div style={{ borderTop: '1px dashed var(--timber-border)', paddingTop: '0.5rem' }}>
              Delivery Driver Signature
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
