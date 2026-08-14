import React from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, CheckCircle2, Truck, AlertCircle, ShieldCheck, PackageCheck, ChevronRight, PhoneCall } from 'lucide-react';

export const DealerOrders = () => {
  const { orders, currentUser, currentDealer } = useApp();

  // Filter orders strictly for current logged-in dealer
  const dealerOrders = orders.filter(order => {
    if (!currentUser) return false;
    return (
      (order.dealerContact && order.dealerContact.includes(currentUser.phone)) ||
      (order.dealerName && order.dealerName === currentDealer.firmName) ||
      (order.dealerName && order.dealerName === currentUser.name)
    );
  });

  if (dealerOrders.length === 0) {
    return (
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--timber-border)',
        borderRadius: 'var(--radius-md)',
        padding: '3rem',
        textAlign: 'center',
        color: 'var(--text-muted)'
      }}>
        <Clock size={40} style={{ opacity: 0.4, marginBottom: '0.75rem' }} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>No Orders Placed Yet for {currentDealer.firmName || currentUser?.name || 'Your Account'}</h3>
        <p style={{ fontSize: '0.82rem', marginTop: '0.3rem' }}>
          Select products from the catalog above to submit your wholesale requirement to the owner.
        </p>
      </div>
    );
  }

  // Calculate current stage step (1 to 4)
  const getOrderStep = (order) => {
    if (order.status === 'Rejected by Owner') return 0;
    if (order.status === 'Out for Delivery') return 4;
    if (order.loadingStatus === 'Loading In Progress' || order.loadingStatus === 'Ready for Dispatch' || order.status === 'Worker Loading') return 3;
    if (order.status === 'Confirmed by Owner') return 2;
    return 1;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--timber-gold-light)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={22} /> Track Your Order Progress ({currentDealer.firmName})
        </h2>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Real-time updates between Your Shop ➔ Owner (Father) ➔ Godown Worker
        </span>
      </div>

      {dealerOrders.map(order => {
        const step = getOrderStep(order);
        const isRejected = order.status === 'Rejected by Owner';

        return (
          <div key={order.id} className="animate-fade-in" style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--timber-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-md)'
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--timber-border)',
              paddingBottom: '0.85rem',
              marginBottom: '1.25rem',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Order ID:</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--timber-gold)', marginLeft: '0.4rem' }}>
                  #{order.id}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '1rem' }}>
                  Submitted: {order.orderDate}
                </span>
              </div>

              <div>
                {isRejected ? (
                  <span className="badge badge-status-rejected">
                    <AlertCircle size={14} /> Rejected / Out of Stock
                  </span>
                ) : (
                  <span className={`badge ${step >= 2 ? 'badge-status-confirmed' : 'badge-status-pending'}`}>
                    {step === 1 && '🟡 Submitted to Owner'}
                    {step === 2 && '🟢 Confirmed by Owner'}
                    {step === 3 && '⚙️ Worker Loading Sheets'}
                    {step === 4 && '🚚 Out for Delivery'}
                  </span>
                )}
              </div>
            </div>

            {/* ANIMATED STEPPER PROGRESS BAR */}
            {!isRejected && (
              <div style={{
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid var(--timber-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                marginBottom: '1.25rem'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  position: 'relative',
                  gap: '0.5rem'
                }}>
                  {/* Step 1 */}
                  <div style={{ textAlign: 'center', zIndex: 2 }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      margin: '0 auto 0.4rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      background: step >= 1 ? 'var(--timber-gold)' : 'rgba(255,255,255,0.08)',
                      color: step >= 1 ? '#000' : 'var(--text-muted)',
                      boxShadow: step === 1 ? 'var(--shadow-glow)' : 'none',
                      transition: 'all 0.3s ease'
                    }}>
                      1
                    </div>
                    <p style={{ fontSize: '0.78rem', fontWeight: step >= 1 ? 800 : 500, color: step >= 1 ? '#ffffff' : 'var(--text-muted)' }}>
                      Submitted
                    </p>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Sent to Owner</span>
                  </div>

                  {/* Step 2 */}
                  <div style={{ textAlign: 'center', zIndex: 2 }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      margin: '0 auto 0.4rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      background: step >= 2 ? '#10b981' : 'rgba(255,255,255,0.08)',
                      color: step >= 2 ? '#022c22' : 'var(--text-muted)',
                      boxShadow: step === 2 ? '0 0 16px rgba(16, 185, 129, 0.5)' : 'none',
                      transition: 'all 0.3s ease'
                    }}>
                      2
                    </div>
                    <p style={{ fontSize: '0.78rem', fontWeight: step >= 2 ? 800 : 500, color: step >= 2 ? '#34d399' : 'var(--text-muted)' }}>
                      Father Confirmed
                    </p>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Routed to Godown</span>
                  </div>

                  {/* Step 3 */}
                  <div style={{ textAlign: 'center', zIndex: 2 }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      margin: '0 auto 0.4rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      background: step >= 3 ? '#3b82f6' : 'rgba(255,255,255,0.08)',
                      color: step >= 3 ? '#ffffff' : 'var(--text-muted)',
                      boxShadow: step === 3 ? '0 0 16px rgba(59, 130, 246, 0.5)' : 'none',
                      transition: 'all 0.3s ease'
                    }}>
                      3
                    </div>
                    <p style={{ fontSize: '0.78rem', fontWeight: step >= 3 ? 800 : 500, color: step >= 3 ? '#60a5fa' : 'var(--text-muted)' }}>
                      Worker Loading
                    </p>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Sheets Verified</span>
                  </div>

                  {/* Step 4 */}
                  <div style={{ textAlign: 'center', zIndex: 2 }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      margin: '0 auto 0.4rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      background: step >= 4 ? '#10b981' : 'rgba(255,255,255,0.08)',
                      color: step >= 4 ? '#022c22' : 'var(--text-muted)',
                      boxShadow: step === 4 ? '0 0 20px rgba(16, 185, 129, 0.7)' : 'none',
                      transition: 'all 0.3s ease'
                    }}>
                      4
                    </div>
                    <p style={{ fontSize: '0.78rem', fontWeight: step >= 4 ? 800 : 500, color: step >= 4 ? '#34d399' : 'var(--text-muted)' }}>
                      Out for Delivery
                    </p>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{order.vehicleNumber || 'Truck Dispatched'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Requested Items */}
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Requested Items Breakdown:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(0,0,0,0.3)',
                    padding: '0.5rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem'
                  }}>
                    <span style={{ fontWeight: 600 }}>{item.name}</span>
                    <span style={{ fontWeight: 800, color: 'var(--timber-gold-light)' }}>
                      {item.quantity} {item.unit}(s) × ₹{item.price} = ₹{item.total?.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Owner Note */}
            {order.ownerNote && (
              <div style={{
                background: 'rgba(245, 158, 11, 0.08)',
                borderLeft: '3px solid var(--timber-gold)',
                padding: '0.65rem 0.85rem',
                borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                fontSize: '0.82rem',
                marginBottom: '1rem'
              }}>
                <span style={{ fontWeight: 700, color: 'var(--timber-gold)' }}>Note from Owner (Father): </span>
                <span>{order.ownerNote}</span>
              </div>
            )}

            {/* Footer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid var(--timber-border)',
              paddingTop: '0.75rem',
              fontSize: '0.88rem'
            }}>
              <span style={{ color: 'var(--text-muted)' }}>
                Destination: <strong style={{ color: 'var(--text-secondary)' }}>{order.deliveryAddress}</strong>
              </span>
              <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--timber-gold-light)' }}>
                Total: ₹{order.grandTotal?.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
