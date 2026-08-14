import React from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import { Search, ShoppingCart, UserCheck, ShieldCheck, HardHat, LogOut, RefreshCw } from 'lucide-react';

export const Navbar = ({ onOpenCart, onOpenAuth }) => {
  const {
    activeRole,
    setActiveRole,
    currentUser,
    logout,
    searchQuery,
    setSearchQuery,
    cart,
    currentDealer,
    resetDataToDefault
  } = useApp();

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <header className="no-print" style={{
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--timber-border)',
      position: 'sticky',
      top: 0,
      zIndex: 90,
      padding: '0.85rem 1.5rem'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        {/* Company Logo & Title */}
        <Logo size="medium" />

        {/* Search Input (For Dealer & Owner View) */}
        {activeRole !== 'WORKER' && (
          <div style={{
            flex: '1',
            maxWidth: '460px',
            position: 'relative'
          }}>
            <Search size={18} style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }} />
            <input
              type="text"
              placeholder="Search MM (18mm, 12mm), Core (Red Core), Fevicol, Doors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '2.75rem',
                backgroundColor: 'rgba(0,0,0,0.4)',
                borderColor: searchQuery ? 'var(--timber-gold)' : 'var(--timber-border)',
                fontSize: '0.88rem'
              }}
            />
          </div>
        )}

        {/* User Account Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {activeRole === 'DEALER' && (
            <>
              {/* Dealer Profile Trigger */}
              <button
                onClick={onOpenAuth}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--timber-border)',
                  padding: '0.5rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'var(--text-secondary)',
                  fontSize: '0.82rem'
                }}
              >
                <UserCheck size={16} style={{ color: 'var(--timber-gold)' }} />
                <span>{currentDealer.firmName.split(' ')[0]}...</span>
              </button>

              {/* Cart Drawer Button */}
              <button
                onClick={onOpenCart}
                className="btn-primary"
                style={{ position: 'relative' }}
              >
                <ShoppingCart size={18} />
                <span>Cart</span>
                {cartItemCount > 0 && (
                  <span style={{
                    background: '#ffffff',
                    color: '#000000',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '4px'
                  }}>
                    {cartItemCount}
                  </span>
                )}
              </button>
            </>
          )}

          {activeRole === 'OWNER' && (
            <div style={{
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--timber-gold-light)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.82rem',
              fontWeight: 700
            }}>
              <ShieldCheck size={16} />
              Owner (Father) Mode
            </div>
          )}

          {activeRole === 'WORKER' && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.82rem',
              fontWeight: 700
            }}>
              <HardHat size={16} />
              Godown Worker Mode
            </div>
          )}

          {/* Quick Demo Switch Role Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', borderLeft: '1px solid var(--timber-border)', paddingLeft: '0.75rem' }}>
            <button
              onClick={() => setActiveRole('DEALER')}
              title="Switch to Dealer view"
              style={{
                padding: '0.35rem 0.6rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                background: activeRole === 'DEALER' ? 'var(--timber-gold)' : 'rgba(255,255,255,0.05)',
                color: activeRole === 'DEALER' ? '#000' : 'var(--text-muted)'
              }}
            >
              Dealer
            </button>
            <button
              onClick={() => setActiveRole('OWNER')}
              title="Switch to Owner view"
              style={{
                padding: '0.35rem 0.6rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                background: activeRole === 'OWNER' ? 'var(--timber-gold)' : 'rgba(255,255,255,0.05)',
                color: activeRole === 'OWNER' ? '#000' : 'var(--text-muted)'
              }}
            >
              Father
            </button>
            <button
              onClick={() => setActiveRole('WORKER')}
              title="Switch to Worker view"
              style={{
                padding: '0.35rem 0.6rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                background: activeRole === 'WORKER' ? '#10b981' : 'rgba(255,255,255,0.05)',
                color: activeRole === 'WORKER' ? '#000' : 'var(--text-muted)'
              }}
            >
              Worker
            </button>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: 'var(--accent-red)',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.8rem',
              fontWeight: 700
            }}
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </div>
    </header>
  );
};
