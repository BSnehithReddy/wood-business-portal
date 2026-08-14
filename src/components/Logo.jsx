import React from 'react';
import { Crown } from 'lucide-react';

export const Logo = ({ size = 'medium', useImage = false }) => {
  const isLarge = size === 'large';

  if (useImage) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img
          src="/mm-logo.jpg"
          alt="MM Wood Boards & Laminates"
          style={{
            maxHeight: isLarge ? '90px' : '55px',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-md)'
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: isLarge ? '1rem' : '0.85rem' }}>
      {/* Black & Gold Royal Emblem matching official logo */}
      <div style={{
        background: 'linear-gradient(145deg, #0f0c09 0%, #1f1811 100%)',
        border: '1.5px solid #d97706',
        borderRadius: 'var(--radius-md)',
        padding: isLarge ? '0.65rem 1rem' : '0.45rem 0.75rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 16px rgba(245, 158, 11, 0.25)',
        position: 'relative',
        flexShrink: 0
      }}>
        {/* Crown on top */}
        <Crown size={isLarge ? 18 : 14} style={{ color: '#fbbf24', marginBottom: '2px', filter: 'drop-shadow(0 0 4px #f59e0b)' }} />

        {/* Center MM Circle with Flourish Wings */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {/* Left Flourish SVG */}
          <svg width={isLarge ? "18" : "14"} height={isLarge ? "14" : "10"} viewBox="0 0 24 16" fill="none" stroke="#d97706" strokeWidth="2">
            <path d="M22 14C16 14 12 8 8 8C4 8 2 12 0 12M20 2C14 2 10 8 8 8" />
          </svg>

          {/* MM Ring */}
          <div style={{
            width: isLarge ? '32px' : '26px',
            height: isLarge ? '32px' : '26px',
            borderRadius: '50%',
            border: '1.5px solid #fbbf24',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle, #2a1f16 0%, #0f0c09 100%)',
            boxShadow: '0 0 8px rgba(251, 191, 36, 0.3)'
          }}>
            <span style={{
              fontSize: isLarge ? '0.85rem' : '0.7rem',
              fontWeight: 900,
              color: '#fbbf24',
              fontFamily: 'serif',
              letterSpacing: '-0.05em'
            }}>
              MM
            </span>
          </div>

          {/* Right Flourish SVG */}
          <svg width={isLarge ? "18" : "14"} height={isLarge ? "14" : "10"} viewBox="0 0 24 16" fill="none" stroke="#d97706" strokeWidth="2">
            <path d="M2 14C8 14 12 8 16 8C20 8 22 12 24 12M4 2C10 2 14 8 16 8" />
          </svg>
        </div>
      </div>

      {/* Official Typography */}
      <div>
        <h1 style={{
          fontSize: isLarge ? '1.5rem' : '1.2rem',
          fontWeight: 900,
          fontFamily: 'serif',
          letterSpacing: '0.02em',
          background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 40%, #fbbf24 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1.15,
          textTransform: 'uppercase'
        }}>
          MM WOOD BOARDS & LAMINATES
        </h1>
        <p style={{
          fontSize: isLarge ? '0.8rem' : '0.7rem',
          color: '#fbbf24',
          fontWeight: 700,
          letterSpacing: '0.05em',
          marginTop: '2px',
          fontStyle: 'italic'
        }}>
          Modern Ply for Modern Living
        </p>
      </div>
    </div>
  );
};
