import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react';

export const NotificationToast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return <CheckCircle2 size={20} style={{ color: '#10b981' }} />;
      case 'error': return <XCircle size={20} style={{ color: '#ef4444' }} />;
      case 'warning': return <AlertTriangle size={20} style={{ color: '#f59e0b' }} />;
      default: return <Info size={20} style={{ color: '#3b82f6' }} />;
    }
  };

  return (
    <div className="no-print animate-fade-in" style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 1000,
      background: 'var(--bg-card)',
      border: '1px solid var(--timber-border)',
      boxShadow: 'var(--shadow-lg)',
      borderRadius: 'var(--radius-md)',
      padding: '0.9rem 1.25rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      maxWidth: '420px',
      color: 'var(--text-primary)',
      fontSize: '0.88rem'
    }}>
      {getIcon()}
      <div style={{ flex: 1, fontWeight: 500 }}>
        {toast.message}
      </div>
    </div>
  );
};
