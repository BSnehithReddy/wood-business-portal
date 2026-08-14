import React from 'react';
import { useApp } from '../../context/AppContext';
import { Layers, Box, DoorOpen, Sparkles, LayoutGrid } from 'lucide-react';

export const CategoryNav = () => {
  const { selectedCategory, setSelectedCategory } = useApp();

  const categories = [
    { id: 'All', label: 'All Products', icon: LayoutGrid },
    { id: 'Plywood', label: 'Plywood Sheets', icon: Layers, badge: '18mm / 12mm' },
    { id: 'Fevicol', label: 'Fevicol & Adhesives', icon: Box, badge: '50kg / Marine' },
    { id: 'Doors', label: 'Flush & Teak Doors', icon: DoorOpen, badge: '32mm / 30mm' },
    { id: 'Laminates', label: 'Sunmica Laminates', icon: Sparkles, badge: '1.0mm Gloss' }
  ];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      overflowX: 'auto',
      paddingBottom: '0.5rem',
      marginBottom: '1.5rem'
    }}>
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isActive = selectedCategory === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              background: isActive
                ? 'linear-gradient(135deg, var(--timber-gold), var(--timber-warm))'
                : 'var(--bg-card)',
              color: isActive ? '#0d0a08' : 'var(--text-secondary)',
              border: isActive ? '1px solid var(--timber-gold-light)' : '1px solid var(--timber-border)',
              fontWeight: isActive ? 800 : 600,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              whiteSpace: 'nowrap',
              boxShadow: isActive ? 'var(--shadow-glow)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Icon size={18} />
            <span>{cat.label}</span>
            {cat.badge && !isActive && (
              <span style={{
                fontSize: '0.68rem',
                background: 'rgba(255,255,255,0.06)',
                padding: '2px 6px',
                borderRadius: '4px',
                color: 'var(--text-muted)'
              }}>
                {cat.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
