import React from 'react';
import { useApp } from '../../context/AppContext';
import { Filter, RotateCcw } from 'lucide-react';

export const FilterSidebar = () => {
  const {
    filterMM,
    setFilterMM,
    filterCore,
    setFilterCore,
    selectedCategory
  } = useApp();

  const mmOptions = ['All', '18mm', '16mm', '13mm', '12mm', '10mm', '9mm', '6mm'];
  const coreOptions = ['All', 'Red Core Gurjan', 'Alternate Core', 'Poplar Core', 'Flexi Birch'];

  const handleReset = () => {
    setFilterMM('All');
    setFilterCore('All');
  };

  return (
    <aside style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--timber-border)',
      borderRadius: 'var(--radius-md)',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--timber-border)',
        paddingBottom: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '0.92rem', color: 'var(--timber-gold-light)' }}>
          <Filter size={18} />
          <span>Specifications Filter</span>
        </div>
        {(filterMM !== 'All' || filterCore !== 'All') && (
          <button
            onClick={handleReset}
            style={{
              background: 'transparent',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <RotateCcw size={12} /> Reset
          </button>
        )}
      </div>

      {/* MM Thickness Filter (Primary Feature Requested) */}
      <div>
        <label style={{
          display: 'block',
          fontSize: '0.8rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'var(--text-secondary)',
          marginBottom: '0.65rem'
        }}>
          Sheet Thickness (MM):
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {mmOptions.map((mm) => {
            const isSelected = filterMM === mm;
            return (
              <button
                key={mm}
                onClick={() => setFilterMM(mm)}
                style={{
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  background: isSelected ? 'var(--timber-gold)' : 'rgba(255,255,255,0.04)',
                  color: isSelected ? '#0f0b08' : 'var(--text-secondary)',
                  border: isSelected ? '1px solid var(--timber-gold-light)' : '1px solid var(--timber-border)',
                  transition: 'all 0.15s ease'
                }}
              >
                {mm}
              </button>
            );
          })}
        </div>
      </div>

      {/* Core Type Filter */}
      {selectedCategory === 'Plywood' || selectedCategory === 'All' ? (
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--text-secondary)',
            marginBottom: '0.65rem'
          }}>
            Core Quality Composition:
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {coreOptions.map((core) => {
              const isSelected = filterCore === core;
              return (
                <button
                  key={core}
                  onClick={() => setFilterCore(core)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: isSelected ? 700 : 500,
                    textAlign: 'left',
                    background: isSelected ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                    color: isSelected ? 'var(--timber-gold-light)' : 'var(--text-secondary)',
                    border: isSelected ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid transparent'
                  }}
                >
                  {core}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Business Info Banner */}
      <div style={{
        background: 'rgba(0,0,0,0.3)',
        border: '1px dashed var(--timber-border)',
        borderRadius: 'var(--radius-sm)',
        padding: '0.85rem',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        marginTop: '0.5rem'
      }}>
        <p style={{ color: 'var(--timber-gold)', fontWeight: 700, marginBottom: '0.2rem' }}>
          📦 Wholesale Bulk Discounts
        </p>
        Orders of 50+ sheets qualify for direct depot truck loading with zero freight charge within Hyderabad.
      </div>
    </aside>
  );
};
