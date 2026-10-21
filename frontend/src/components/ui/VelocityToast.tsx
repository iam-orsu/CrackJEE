'use client';

import React, { useState, useEffect } from 'react';

interface ToastItem {
  id: number;
  type: 'correct' | 'wrong' | 'partial';
  title: string;
  marks: string;
  explanation?: string;
  exiting?: boolean;
}

let _nextId = 0;
let _enqueue: ((item: Omit<ToastItem, 'id' | 'exiting'>) => void) | null = null;

export function showAnswerToast(item: Omit<ToastItem, 'id' | 'exiting'>) {
  _enqueue?.(item);
}

const COLORS = {
  correct: { border: '#16a34a', title: '#15803d', bg: '#f0fdf4', progress: '#16a34a' },
  wrong:   { border: '#dc2626', title: '#dc2626', bg: '#fef2f2', progress: '#dc2626' },
  partial: { border: '#d97706', title: '#92400e', bg: '#fffbeb', progress: '#d97706' },
};

export function VelocityToastProvider() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    _enqueue = (item) => {
      const id = ++_nextId;
      setToasts((prev) => [...prev.slice(-2), { ...item, id }]);

      const exitTimer = setTimeout(() => {
        setToasts((prev) => prev.map((t) => t.id === id ? { ...t, exiting: true } : t));
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 280);
      }, 4500);

      return () => clearTimeout(exitTimer);
    };
    return () => { _enqueue = null; };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes _vtIn  { from { transform: translateY(20px) scale(0.95); opacity: 0; } to { transform: none; opacity: 1; } }
        @keyframes _vtOut { from { transform: none; opacity: 1; } to { transform: translateY(10px) scale(0.96); opacity: 0; } }
        @keyframes _vtBar { from { width: 100%; } to { width: 0%; } }
        ._vt { animation: _vtIn 0.28s cubic-bezier(0.34,1.56,0.64,1) both; }
        ._vt._vtExit { animation: _vtOut 0.22s ease both; }
        ._vtProg { animation: _vtBar 4.5s linear both; }
        ._vt:hover ._vtProg { animation-play-state: paused; }
      `}</style>
      <div style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
        display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end',
        pointerEvents: 'none',
      }}>
        {toasts.map((t) => {
          const c = COLORS[t.type];
          return (
            <div
              key={t.id}
              className={`_vt${t.exiting ? ' _vtExit' : ''}`}
              style={{
                background: '#fff',
                border: `1px solid ${c.border}30`,
                borderLeft: `3px solid ${c.border}`,
                borderRadius: 8,
                padding: '12px 16px 14px',
                width: 288,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
                overflow: 'hidden',
                position: 'relative',
                pointerEvents: 'auto',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: t.explanation ? 5 : 0 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: c.title }}>
                  {t.title}
                </span>
                <span style={{
                  fontSize: 12, fontWeight: 700, padding: '1px 8px',
                  borderRadius: 9999, background: c.bg, color: c.title,
                }}>
                  {t.marks}
                </span>
              </div>
              {t.explanation && (
                <p style={{ fontSize: 12, color: '#64748b', margin: 0, lineHeight: 1.55 }}>
                  {t.explanation.replace(/\$[^$]+\$/g, '').trim().slice(0, 110)}
                  {t.explanation.replace(/\$[^$]+\$/g, '').trim().length > 110 ? '…' : ''}
                </p>
              )}
              {/* shrinking progress bar */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: '#f1f5f9' }}>
                <div className="_vtProg" style={{ height: '100%', background: c.progress, width: '100%' }} />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
