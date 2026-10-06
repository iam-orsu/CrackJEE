import type { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, id, ...props }: Props) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {label && (
        <label htmlFor={inputId} style={{ fontSize: '13px', fontWeight: 500, color: '#2c3e50' }}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        {...props}
        style={{
          padding: '8px 12px',
          border: `1px solid ${error ? '#e74c3c' : '#e0e0e0'}`,
          borderRadius: '4px',
          fontSize: '14px',
          color: '#2c3e50',
          background: '#ffffff',
          outline: 'none',
          width: '100%',
          boxSizing: 'border-box',
          ...props.style,
        }}
      />
      {error && <span style={{ fontSize: '12px', color: '#e74c3c' }}>{error}</span>}
    </div>
  );
}
