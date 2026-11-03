'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          background: '#f8fafc',
        }}>
          <div style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: 16,
            padding: '48px 40px',
            maxWidth: 480,
            width: '100%',
            textAlign: 'center',
          }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>
              Something went wrong
            </h2>
            <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, marginBottom: 28 }}>
              {error.message || 'An unexpected error occurred. Please try again.'}
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={() => reset()}
                style={{
                  padding: '10px 24px',
                  fontSize: 14,
                  fontWeight: 500,
                  background: '#1e293b',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                }}
              >
                Try again
              </button>
              <a
                href="/dashboard"
                style={{
                  padding: '10px 24px',
                  fontSize: 14,
                  fontWeight: 500,
                  background: '#fff',
                  color: '#1e293b',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  textDecoration: 'none',
                }}
              >
                Dashboard
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
