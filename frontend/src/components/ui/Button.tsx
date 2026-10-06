import type { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
  loading?: boolean;
}

export function Button({ variant = 'primary', loading, children, disabled, ...props }: Props) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        padding: '8px 16px',
        background: '#ffffff',
        border: variant === 'primary' ? '1px solid #2c3e50' : '1px solid #e0e0e0',
        borderRadius: '4px',
        color: disabled || loading ? '#aaa' : '#2c3e50',
        fontSize: '14px',
        fontWeight: 500,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        transition: 'color 0.15s',
        ...props.style,
      }}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}
