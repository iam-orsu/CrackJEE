'use client';

import React from 'react';

interface OrbitalLoaderProps {
  message?: string;
  submessage?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function OrbitalLoader({ message, submessage, size = 'md' }: OrbitalLoaderProps) {
  const dim = size === 'sm' ? 48 : size === 'lg' ? 96 : 72;
  const sw  = size === 'sm' ? 1.5 : 2;

  return (
    <>
      <style>{`
        @keyframes _orbSpin    { to { transform: rotate(360deg); } }
        @keyframes _orbCounter { to { transform: rotate(-360deg); } }
        @keyframes _orbPulse   {
          0%,100% { opacity: 1; transform: scale(1); }
          50%     { opacity: .55; transform: scale(.88); }
        }
      `}</style>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <div style={{ position: 'relative', width: dim, height: dim }}>

          {/* Outer ring — slow spin */}
          <div style={{
            position: 'absolute', inset: 0,
            borderRadius: '50%',
            border: `${sw}px solid #e2e8f0`,
            animation: '_orbSpin 3.2s linear infinite',
          }}>
            {/* Orbiting dot */}
            <div style={{
              position: 'absolute',
              top: -Math.round(sw + 2),
              left: '50%',
              transform: 'translateX(-50%)',
              width: sw * 3 + 1,
              height: sw * 3 + 1,
              borderRadius: '50%',
              background: '#1e293b',
            }} />
          </div>

          {/* Inner ring — counter-spin */}
          <div style={{
            position: 'absolute',
            inset: Math.round(dim * 0.18),
            borderRadius: '50%',
            border: `${sw}px solid #e2e8f0`,
            animation: '_orbCounter 2.1s linear infinite',
          }}>
            <div style={{
              position: 'absolute',
              top: -Math.round(sw + 1),
              left: '50%',
              transform: 'translateX(-50%)',
              width: sw * 2 + 2,
              height: sw * 2 + 2,
              borderRadius: '50%',
              background: '#94a3b8',
            }} />
          </div>

          {/* Core pulse */}
          <div style={{
            position: 'absolute',
            inset: Math.round(dim * 0.38),
            borderRadius: '50%',
            background: '#1e293b',
            animation: '_orbPulse 2s ease infinite',
          }} />
        </div>

        {(message || submessage) && (
          <div style={{ textAlign: 'center' }}>
            {message && (
              <p style={{ fontSize: size === 'sm' ? 13 : 15, fontWeight: 600, color: '#1e293b', margin: 0 }}>
                {message}
              </p>
            )}
            {submessage && (
              <p style={{ fontSize: 12, color: '#64748b', margin: '6px 0 0', lineHeight: 1.55 }}>
                {submessage}
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
