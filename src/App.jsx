import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginScreen } from './components/LoginScreen';
import { Navbar } from './components/Navbar';
import { NotificationToast } from './components/NotificationToast';
import { ConfettiEffect } from './components/ConfettiEffect';
import { AddProductModal } from './components/AddProductModal';
import { EditProductModal } from './components/EditProductModal';
import { LoadingSlipModal } from './components/LoadingSlipModal';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';

import { CategoryNav } from './views/DealerView/CategoryNav';
import { FilterSidebar } from './views/DealerView/FilterSidebar';
import { ProductGrid } from './views/DealerView/ProductGrid';
import { DealerOrders } from './views/DealerView/DealerOrders';

import { B2BControlCenter } from './views/OwnerView/B2BControlCenter';
import { WorkerDashboard } from './views/WorkerView/WorkerDashboard';

function MainApp() {
  const { isAuthenticated, activeRole, confettiActive } = useApp();

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [selectedProductToEdit, setSelectedProductToEdit] = useState(null);
  const [selectedOrderForSlip, setSelectedOrderForSlip] = useState(null);

  // If user is not logged in, render the login gateway!
  if (!isAuthenticated) {
    return (
      <>
        <LoginScreen />
        <NotificationToast />
        <ConfettiEffect active={confettiActive} />
      </>
    );
  }

  const handleOpenEdit = (product) => {
    setSelectedProductToEdit(product);
  };

  const handleCloseEdit = () => {
    setSelectedProductToEdit(null);
  };

  const handleOpenSlip = (order) => {
    setSelectedOrderForSlip(order);
  };

  const handleCloseSlip = () => {
    setSelectedOrderForSlip(null);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Celebration Confetti Effect */}
      <ConfettiEffect active={confettiActive} />

      {/* Navbar with Brand Logo, Profile, and Role Status */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Role Content Container */}
      <main style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '1.5rem',
        width: '100%',
        flex: 1
      }}>
        {/* DEALER STOREFRONT VIEW */}
        {activeRole === 'DEALER' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <CategoryNav />

            <div style={{
              display: 'grid',
              gridTemplateColumns: '260px 1fr',
              gap: '1.5rem',
              alignItems: 'start'
            }}>
              <FilterSidebar />
              <div>
                <ProductGrid onOpenEdit={handleOpenEdit} />
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--timber-border)', paddingTop: '2rem', marginTop: '1rem' }}>
              <DealerOrders />
            </div>
          </div>
        )}

        {/* OWNER B2B CONTROL CENTER */}
        {activeRole === 'OWNER' && (
          <B2BControlCenter
            onOpenAdd={() => setIsAddProductOpen(true)}
            onOpenEdit={handleOpenEdit}
          />
        )}

        {/* GODOWN WORKER DISPATCH TERMINAL */}
        {activeRole === 'WORKER' && (
          <WorkerDashboard
            onOpenLoadingSlip={handleOpenSlip}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print" style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--timber-border)',
        padding: '1.5rem',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.8rem',
        marginTop: '2rem'
      }}>
        <p style={{ color: '#ef4444', fontWeight: 900, fontSize: '0.95rem', fontFamily: 'serif' }}>
          MM WOOD BOARDS & LAMINATES
        </p>
        <p style={{ color: '#fbbf24', fontStyle: 'italic', fontWeight: 700, marginTop: '2px' }}>
          Modern Ply for Modern Living
        </p>
        <p style={{ marginTop: '0.25rem' }}>
          Wholesale Plywood • Fevicol • Doors • Sunmica Laminates Depot • Hyderabad
        </p>
      </footer>

      {/* Modals & Slide-overs */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
      />

      <EditProductModal
        product={selectedProductToEdit}
        isOpen={!!selectedProductToEdit}
        onClose={handleCloseEdit}
      />

      <LoadingSlipModal
        order={selectedOrderForSlip}
        isOpen={!!selectedOrderForSlip}
        onClose={handleCloseSlip}
      />

      {/* Toast Feedback */}
      <NotificationToast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
