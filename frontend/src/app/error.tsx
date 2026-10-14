'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for debugging
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'var(--gray-50)',
    }}>
      <div style={{
        background: 'var(--white)',
        border: '1px solid var(--gray-200)',
        borderRadius: 'var(--radius-2xl)',
        padding: '48px 40px',
        maxWidth: '480px',
        width: '100%',
        textAlign: 'center',
        boxShadow: 'var(--shadow-md)',
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--red-50)',
          border: '1.5px solid var(--red-100)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          color: 'var(--red-600)',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h2 style={{
          fontSize: '20px',
          fontWeight: 700,
          color: 'var(--gray-900)',
          marginBottom: '8px',
          letterSpacing: '-.02em',
        }}>
          Something went wrong
        </h2>

        <p style={{
          fontSize: '14px',
          color: 'var(--gray-500)',
          lineHeight: 1.6,
          marginBottom: '28px',
        }}>
          {error.message || 'An unexpected error occurred while loading this page.'}
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={() => reset()}
            className="btn btn-primary"
            style={{ minWidth: '120px' }}
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            className="btn btn-outline"
            style={{ minWidth: '120px' }}
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
