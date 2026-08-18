import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  HardHat,
  Truck,
  CheckSquare,
  Printer,
  ShieldCheck,
  PackageCheck,
  CheckCircle2,
  Sparkles,
  Layers,
  PhoneCall
} from 'lucide-react';

export const WorkerDashboard = ({ onOpenLoadingSlip }) => {
  const { orders, updateLoadingStatus, toggleItemVerified } = useApp();

  // ONLY show orders confirmed by Owner
  const confirmedOrders = orders.filter(
    o => o.status.includes('Confirmed') || o.status === 'Out for Delivery' || o.status === 'Worker Loading'
  );

  const [vehicleInputs, setVehicleInputs] = useState({});
  const [driverPhoneInputs, setDriverPhoneInputs] = useState({});

  const handleStartLoading = (orderId) => {
    updateLoadingStatus(orderId, 'Loading In Progress');
  };

  const handlePackedVerified = (orderId) => {
    updateLoadingStatus(orderId, 'Ready for Dispatch');
  };

  const handleDispatch = (orderId) => {
    const vehicle = vehicleInputs[orderId] || 'AP-28-TA-5544';
    const driverPhone = driverPhoneInputs[orderId] || '+91 98490 99887';
    updateLoadingStatus(orderId, 'Out for Delivery', vehicle, driverPhone);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 78, 59, 0.3) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.35)',
        borderRadius: 'var(--radius-md)',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-sm)',
            background: '#10b981',
            color: '#022c22',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <HardHat size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff' }}>
              Godown Dispatch Terminal
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#a7f3d0' }}>
              Showing orders <strong>CONFIRMED BY OWNER</strong> ready for physical loading & truck delivery.
            </p>
          </div>
        </div>

        <div style={{
          background: 'rgba(0,0,0,0.4)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          padding: '0.5rem 1rem',
          borderRadius: 'var(--radius-sm)',
          color: '#34d399',
          fontWeight: 800,
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <ShieldCheck size={18} />
          {confirmedOrders.length} Confirmed Orders Active
        </div>
      </div>

      {/* Orders Worklist */}
      {confirmedOrders.length === 0 ? (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--timber-border)',
          borderRadius: 'var(--radius-md)',
          padding: '4rem 2rem',
          textAlign: 'center',
          color: 'var(--text-muted)'
        }}>
          <PackageCheck size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
            No Orders Ready for Loading Right Now
          </h3>
          <p style={{ fontSize: '0.85rem', marginTop: '0.4rem' }}>
            When the Owner clicks <strong>[CONFIRM ORDER]</strong> in the Owner Portal, orders will appear here automatically for you to load and deliver.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {confirmedOrders.map(order => {
            const currentLoading = order.loadingStatus || 'Pending Loading';
            const isDispatched = order.status === 'Out for Delivery';

            // Calculate checklist verification count
            const verifiedCount = order.items.filter(item => item.verified).length;
            const totalItems = order.items.length;
            const isAllVerified = verifiedCount === totalItems;
            const progressPct = Math.round((verifiedCount / totalItems) * 100);

            return (
              <div key={order.id} className="glass-panel" style={{
                borderLeft: '6px solid #10b981',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-md)'
              }}>
                {/* Order Top Bar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid var(--timber-border)',
                  paddingBottom: '1rem',
                  marginBottom: '1rem',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}>
                  <div>
                    <span className="badge badge-status-confirmed" style={{ marginBottom: '0.35rem' }}>
                      <ShieldCheck size={14} /> CONFIRMED BY OWNER
                    </span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff' }}>
                      Order #{order.id} — {order.dealerName}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Dealer Phone: <strong>{order.dealerContact}</strong> • Location: <strong>{order.deliveryAddress}</strong>
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button
                      onClick={() => onOpenLoadingSlip(order)}
                      className="btn-secondary"
                      style={{ fontSize: '0.82rem', padding: '0.55rem 0.9rem' }}
                    >
                      <Printer size={16} /> Print Gate Pass / Slip
                    </button>
                  </div>
                </div>

                {/* ENHANCED SECOND-HAND CHECKOUT LIST (INTERACTIVE WAREHOUSE LOADING CHECKLIST) */}
                <div style={{
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid var(--timber-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  marginBottom: '1.25rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--timber-gold-light)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <CheckSquare size={18} /> Second-Hand Checkout List (Warehouse Item Loading Verification)
                    </h4>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: isAllVerified ? '#34d399' : 'var(--timber-gold)' }}>
                      {verifiedCount} / {totalItems} Items Verified ({progressPct}%)
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' }}>
                    <div style={{ width: `${progressPct}%`, height: '100%', background: isAllVerified ? '#10b981' : 'linear-gradient(90deg, var(--timber-gold), #10b981)', transition: 'width 0.4s ease' }} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => toggleItemVerified(order.id, idx)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: item.verified ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-secondary)',
                          border: item.verified ? '1.5px solid #10b981' : '1px solid var(--timber-border)',
                          padding: '0.85rem 1.1rem',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <div className={item.verified ? 'animate-check-pop' : ''} style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '6px',
                            border: item.verified ? 'none' : '2px solid var(--timber-border)',
                            background: item.verified ? '#10b981' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#000'
                          }}>
                            {item.verified && <CheckCircle2 size={18} style={{ color: '#042f2e' }} />}
                          </div>
                          <div>
                            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff' }}>{item.name}</span>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              Click to mark verified & loaded into delivery vehicle
                            </p>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontWeight: 900, fontSize: '1.15rem', color: item.verified ? '#34d399' : 'var(--timber-gold)' }}>
                            {item.quantity} {item.unit}(s)
                          </span>
                          <span style={{ display: 'block', fontSize: '0.72rem', color: item.verified ? '#34d399' : 'var(--text-muted)' }}>
                            {item.verified ? '✔ LOADED' : 'PENDING CHECK'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dispatch Step Progression */}
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  {/* Step 1: Start Loading */}
                  {currentLoading === 'Pending Loading' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Status: <strong>Order Confirmed by Owner ➔ Ready in Godown</strong>
                      </span>
                      <button
                        onClick={() => handleStartLoading(order.id)}
                        className="btn-primary"
                        style={{ padding: '0.65rem 1.25rem' }}
                      >
                        <HardHat size={18} />
                        1. Start Loading Items
                      </button>
                    </div>
                  )}

                  {/* Step 2: Packed & Verified */}
                  {currentLoading === 'Loading In Progress' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--timber-gold-light)' }}>
                        Status: <strong>Worker physically verifying sheets on checkout list...</strong>
                      </span>
                      <button
                        onClick={() => handlePackedVerified(order.id)}
                        className="btn-success"
                        style={{ padding: '0.65rem 1.25rem' }}
                      >
                        <Sparkles size={18} />
                        2. Mark Checkout List Packed & Verified
                      </button>
                    </div>
                  )}

                  {/* Step 3: Vehicle Assignment & Delivery Dispatch */}
                  {(currentLoading === 'Ready for Dispatch' || isDispatched) && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: '100%' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                            Truck / Delivery Vehicle No:
                          </label>
                          <input
                            type="text"
                            placeholder="AP-28-TA-5544"
                            value={vehicleInputs[order.id] ?? order.vehicleNumber ?? ''}
                            onChange={e => setVehicleInputs({ ...vehicleInputs, [order.id]: e.target.value })}
                            disabled={isDispatched}
                            style={{ width: '100%', fontWeight: 700 }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                            Truck Driver Mobile No:
                          </label>
                          <input
                            type="text"
                            placeholder="+91 98490 99887"
                            value={driverPhoneInputs[order.id] ?? order.driverPhone ?? ''}
                            onChange={e => setDriverPhoneInputs({ ...driverPhoneInputs, [order.id]: e.target.value })}
                            disabled={isDispatched}
                            style={{ width: '100%' }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                        {!isDispatched ? (
                          <button
                            onClick={() => handleDispatch(order.id)}
                            className="btn-primary"
                            style={{ padding: '0.75rem 1.5rem' }}
                          >
                            <Truck size={18} />
                            Mark Out for Delivery
                          </button>
                        ) : (
                          <div style={{
                            background: 'var(--accent-green-bg)',
                            color: 'var(--accent-green)',
                            border: '1px solid rgba(16, 185, 129, 0.4)',
                            padding: '0.65rem 1.25rem',
                            borderRadius: 'var(--radius-sm)',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            <CheckCircle2 size={20} />
                            TRUCK DISPATCHED & EN ROUTE TO DEALER
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
