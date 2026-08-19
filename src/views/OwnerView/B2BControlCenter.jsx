import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  PlusCircle,
  Edit3,
  CheckCircle,
  XCircle,
  Package,
  TrendingUp,
  Clock,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export const B2BControlCenter = ({ onOpenAdd, onOpenEdit }) => {
  const {
    products,
    orders,
    confirmOrder,
    rejectOrder,
    resetAllRegistrations
  } = useApp();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'catalog'
  const [ownerNoteInput, setOwnerNoteInput] = useState({});

  const pendingOrders = orders.filter(
    o => o.status === 'Pending Owner Approval' || o.status === 'Pending Proprietor Confirmation'
  );
  const confirmedOrders = orders.filter(
    o => o.status.includes('Confirmed') || o.status === 'Out for Delivery' || o.status === 'Worker Loading'
  );

  const totalRevenue = orders
    .filter(o => !o.status.includes('Rejected'))
    .reduce((sum, o) => sum + (o.grandTotal || 0), 0);

  const handleConfirm = (orderId) => {
    const note = ownerNoteInput[orderId] || '';
    confirmOrder(orderId, note);
  };

  const handleReject = (orderId) => {
    const reason = ownerNoteInput[orderId] || 'Out of stock in godown';
    rejectOrder(orderId, reason);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Metrics Banner */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem'
      }}>
        {/* Metric 1 */}
        <div className="glass-panel" style={{ padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--timber-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Awaiting Owner's Confirmation
            </p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: pendingOrders.length > 0 ? '#ef4444' : 'var(--text-primary)' }}>
              {pendingOrders.length} Orders
            </h3>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel" style={{ padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', background: 'var(--accent-green-bg)', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Owner Approved
            </p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent-green)' }}>
              {confirmedOrders.length} Routed
            </h3>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel" style={{ padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Total B2B Order Volume
            </p>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--timber-gold-light)' }}>
              ₹{totalRevenue.toLocaleString('en-IN')}
            </h3>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--timber-border)',
        paddingBottom: '0.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.9rem',
              fontWeight: 800,
              background: activeTab === 'orders' ? 'var(--timber-gold)' : 'rgba(255,255,255,0.05)',
              color: activeTab === 'orders' ? '#0d0a08' : 'var(--text-secondary)',
              border: activeTab === 'orders' ? '1px solid var(--timber-gold-light)' : '1px solid var(--timber-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Clock size={16} />
            Pending Approval Requests ({pendingOrders.length})
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.9rem',
              fontWeight: 800,
              background: activeTab === 'catalog' ? 'var(--timber-gold)' : 'rgba(255,255,255,0.05)',
              color: activeTab === 'catalog' ? '#0d0a08' : 'var(--text-secondary)',
              border: activeTab === 'catalog' ? '1px solid var(--timber-gold-light)' : '1px solid var(--timber-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Package size={16} />
            Master Inventory & Wholesale Prices ({products.length})
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {activeTab === 'catalog' && (
            <button onClick={onOpenAdd} className="btn-primary">
              <PlusCircle size={18} />
              + Add New Item to Catalog
            </button>
          )}

          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to reset all registrations and restart the system?")) {
                resetAllRegistrations();
              }
            }}
            style={{
              padding: '0.6rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontWeight: 800,
              background: 'rgba(239, 68, 68, 0.12)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={14} /> Reset System & Restart
          </button>
        </div>
      </div>

      {/* TAB 1: PENDING CONFIRMATIONS */}
      {activeTab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {pendingOrders.length === 0 ? (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--timber-border)',
              borderRadius: 'var(--radius-md)',
              padding: '3rem',
              textAlign: 'center',
              color: 'var(--text-muted)'
            }}>
              <CheckCircle size={40} style={{ color: 'var(--accent-green)', opacity: 0.8, marginBottom: '0.75rem' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                All Dealer Orders Reviewed!
              </h3>
              <p style={{ fontSize: '0.82rem', marginTop: '0.3rem' }}>
                No pending requests. Confirmed orders have been forwarded directly to the Godown Worker interface.
              </p>
            </div>
          ) : (
            pendingOrders.map(order => (
              <div key={order.id} className="glass-panel" style={{
                border: '2px solid var(--timber-gold)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-glow)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid var(--timber-border)',
                  paddingBottom: '1rem',
                  marginBottom: '1rem',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  <div>
                    <span style={{
                      background: '#ef4444',
                      color: '#fff',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '99px',
                      textTransform: 'uppercase'
                    }}>
                      AWAITING OWNER'S DECISION
                    </span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--timber-gold-light)', marginTop: '0.3rem' }}>
                      Order #{order.id} — {order.dealerName}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Contact: {order.dealerContact} • GSTIN: {order.dealerGst || 'N/A'} • Placed: {order.orderDate}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Order Total:</span>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff' }}>
                      ₹{order.grandTotal?.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Items breakdown */}
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Requested Plywood / Hardware Items:
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'rgba(0,0,0,0.4)',
                        padding: '0.65rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--timber-border)',
                        fontSize: '0.9rem'
                      }}>
                        <div>
                          <strong style={{ color: '#ffffff' }}>{item.name}</strong>
                        </div>
                        <div style={{ fontWeight: 800, color: 'var(--timber-gold)' }}>
                          {item.quantity} {item.unit}(s) @ ₹{item.price} = ₹{item.total?.toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                    Delivery Destination Address:
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {order.deliveryAddress}
                  </p>
                </div>

                {/* Optional Note */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    Note to Worker / Driver (Optional):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Verified in Godown Bay 4, load 18mm sheets first..."
                    value={ownerNoteInput[order.id] || ''}
                    onChange={e => setOwnerNoteInput({ ...ownerNoteInput, [order.id]: e.target.value })}
                    style={{ width: '100%', fontSize: '0.85rem' }}
                  />
                </div>

                {/* CONFIRMATION ACTION BUTTONS */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '1rem',
                  borderTop: '1px solid var(--timber-border)',
                  paddingTop: '1rem'
                }}>
                  <button
                    onClick={() => handleReject(order.id)}
                    className="btn-danger"
                    style={{ padding: '0.75rem 1.25rem' }}
                  >
                    <XCircle size={18} />
                    Reject Order / No Stock
                  </button>

                  <button
                    onClick={() => handleConfirm(order.id)}
                    className="btn-success"
                    style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem' }}
                  >
                    <Sparkles size={20} />
                    CONFIRM ORDER & SEND TO WORKER
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: MASTER CATALOG MANAGER */}
      {activeTab === 'catalog' && (
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--timber-gold-light)' }}>
              Master Product Inventory & Price List
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Owner has full authority to add items, modify prices, or delete items.
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--timber-border)', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem' }}>Item Code</th>
                  <th style={{ padding: '0.75rem' }}>Product Name</th>
                  <th style={{ padding: '0.75rem' }}>Category</th>
                  <th style={{ padding: '0.75rem' }}>MM / Spec</th>
                  <th style={{ padding: '0.75rem' }}>Wholesale Price</th>
                  <th style={{ padding: '0.75rem' }}>Godown Stock</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--timber-gold)' }}>{p.id}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 700, color: '#ffffff' }}>{p.name}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className="badge badge-category">{p.category}</span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      {p.mm && p.mm !== 'N/A' ? (
                        <span className="badge badge-mm">{p.mm}</span>
                      ) : p.size}
                    </td>
                    <td style={{ padding: '0.75rem', fontWeight: 800, color: 'var(--timber-gold-light)' }}>
                      ₹{p.price.toLocaleString('en-IN')} / {p.unit}
                    </td>
                    <td style={{ padding: '0.75rem', fontWeight: 700, color: p.stock > 100 ? 'var(--accent-green)' : '#ef4444' }}>
                      {p.stock} {p.unit}s
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                      <button
                        onClick={() => onOpenEdit(p)}
                        className="btn-secondary"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem' }}
                      >
                        <Edit3 size={14} /> Edit Price/Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
