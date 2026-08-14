import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, ShoppingBag, Truck, Info, RefreshCw } from 'lucide-react';

export const RoleSwitcherBar = () => {
  const { activeRole, setActiveRole, orders, resetDataToDefault } = useApp();

  const pendingOwnerCount = orders.filter(o => o.status === 'Pending Owner Approval').length;
  const confirmedWorkerCount = orders.filter(o => o.status === 'Confirmed by Owner').length;

  return (
    <div className="no-print" style={{
      background: 'linear-gradient(90deg, #1c1510 0%, #2e2016 50%, #1c1510 100%)',
      borderBottom: '1px solid var(--timber-border)',
      padding: '0.65rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1rem',
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--timber-gold)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Info size={16} /> Switch Mode (Demo Multi-Role System):
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {/* Dealer Switch Button */}
        <button
          onClick={() => setActiveRole('DEALER')}
          style={{
            padding: '0.45rem 0.9rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.82rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: activeRole === 'DEALER' ? 'var(--timber-gold)' : 'rgba(255,255,255,0.06)',
            color: activeRole === 'DEALER' ? '#0f0b08' : 'var(--text-secondary)',
            border: activeRole === 'DEALER' ? '1px solid var(--timber-gold-light)' : '1px solid var(--timber-border)'
          }}
        >
          <ShoppingBag size={15} />
          1. Dealer View (Book Orders)
        </button>

        {/* Owner (Father) Switch Button */}
        <button
          onClick={() => setActiveRole('OWNER')}
          style={{
            padding: '0.45rem 0.9rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.82rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: activeRole === 'OWNER' ? '#f59e0b' : 'rgba(255,255,255,0.06)',
            color: activeRole === 'OWNER' ? '#0f0b08' : 'var(--text-secondary)',
            border: activeRole === 'OWNER' ? '1px solid #fbbf24' : '1px solid var(--timber-border)',
            position: 'relative'
          }}
        >
          <ShieldCheck size={15} />
          2. Owner / Father Portal
          {pendingOwnerCount > 0 && (
            <span style={{
              background: '#ef4444',
              color: '#fff',
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '1px 6px',
              borderRadius: '99px',
              marginLeft: '4px'
            }}>
              {pendingOwnerCount} New
            </span>
          )}
        </button>

        {/* Worker Switch Button */}
        <button
          onClick={() => setActiveRole('WORKER')}
          style={{
            padding: '0.45rem 0.9rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.82rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: activeRole === 'WORKER' ? '#10b981' : 'rgba(255,255,255,0.06)',
            color: activeRole === 'WORKER' ? '#042f2e' : 'var(--text-secondary)',
            border: activeRole === 'WORKER' ? '1px solid #34d399' : '1px solid var(--timber-border)'
          }}
        >
          <Truck size={15} />
          3. Godown Worker Dispatch
          {confirmedWorkerCount > 0 && (
            <span style={{
              background: '#10b981',
              color: '#022c22',
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '1px 6px',
              borderRadius: '99px',
              marginLeft: '4px'
            }}>
              {confirmedWorkerCount} Ready
            </span>
          )}
        </button>

        <button
          onClick={resetDataToDefault}
          title="Reset sample inventory and orders"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            padding: '0.4rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.78rem'
          }}
        >
          <RefreshCw size={14} /> Reset Data
        </button>
      </div>
    </div>
  );
};
