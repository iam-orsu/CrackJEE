'use client';

import React, { useRef, useState, useEffect } from 'react';

export interface TabDef<T extends string = string> {
  value: T;
  label: string;
  count?: number;
}

interface AnimatedTabsProps<T extends string> {
  tabs: TabDef<T>[];
  value: T;
  onChange: (v: T) => void;
  accentColor?: string;
  size?: 'sm' | 'md';
}

export function AnimatedTabs<T extends string>({
  tabs,
  value,
  onChange,
  accentColor = '#1e293b',
  size = 'md',
}: AnimatedTabsProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const measureIndicator = () => {
    const btn = tabRefs.current.get(value);
    const container = containerRef.current;
    if (!btn || !container) return;
    const cRect = container.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();
    setIndicator({ left: bRect.left - cRect.left, width: bRect.width });
  };

  useEffect(measureIndicator, [tabs, value]);

  const pad = size === 'sm' ? '6px 10px' : '8px 14px';
  const fs  = size === 'sm' ? 12 : 13;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'inline-flex',
        borderBottom: '2px solid #e2e8f0',
        gap: 0,
      }}
    >
      {/* Sliding underline */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: -2,
          left: indicator.left,
          width: indicator.width,
          height: 2,
          background: accentColor,
          borderRadius: 1,
          transition: 'left .2s cubic-bezier(.4,0,.2,1), width .2s cubic-bezier(.4,0,.2,1)',
          pointerEvents: 'none',
        }}
      />

      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            ref={(el) => {
              if (el) tabRefs.current.set(tab.value, el);
              else tabRefs.current.delete(tab.value);
            }}
            onClick={() => onChange(tab.value)}
            style={{
              padding: pad,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: fs,
              fontWeight: active ? 700 : 500,
              color: active ? accentColor : '#64748b',
              transition: 'color .15s',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span style={{
                fontSize: fs - 1,
                padding: '1px 6px',
                borderRadius: 9999,
                background: active ? `${accentColor}18` : '#f1f5f9',
                color: active ? accentColor : '#94a3b8',
                fontWeight: 600,
                transition: 'background .15s, color .15s',
              }}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
