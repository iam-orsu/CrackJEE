'use client';

import React from 'react';

export type BadgeVariant =
  | 'difficulty-beginner'
  | 'difficulty-intermediate'
  | 'difficulty-advanced'
  | 'subject-physics'
  | 'subject-chemistry'
  | 'subject-mathematics'
  | 'subject-botany'
  | 'subject-zoology'
  | 'type-mcq'
  | 'type-integer'
  | 'type-multi'
  | 'type-paragraph'
  | 'status-correct'
  | 'status-wrong'
  | 'status-partial'
  | 'status-skipped';

const STYLES: Record<BadgeVariant, { bg: string; color: string; border: string }> = {
  'difficulty-beginner':     { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  'difficulty-intermediate': { bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
  'difficulty-advanced':     { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
  'subject-physics':         { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  'subject-chemistry':       { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  'subject-mathematics':     { bg: '#f5f3ff', color: '#7c3aed', border: '#ddd6fe' },
  'subject-botany':          { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
  'subject-zoology':         { bg: '#ecfeff', color: '#0891b2', border: '#a5f3fc' },
  'type-mcq':                { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' },
  'type-integer':            { bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe' },
  'type-multi':              { bg: '#fef3c7', color: '#92400e', border: '#fde68a' },
  'type-paragraph':          { bg: '#fdf4ff', color: '#86198f', border: '#f5d0fe' },
  'status-correct':          { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
  'status-wrong':            { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
  'status-partial':          { bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
  'status-skipped':          { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' },
};

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  size?: 'sm' | 'md';
}

export function Badge({ variant, children, size = 'sm' }: BadgeProps) {
  const s = STYLES[variant];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: size === 'sm' ? '2px 8px' : '3px 10px',
      borderRadius: 9999,
      fontSize: size === 'sm' ? 11 : 12,
      fontWeight: 600,
      letterSpacing: '0.01em',
      background: s.bg,
      color: s.color,
      border: `1px solid ${s.border}`,
      lineHeight: 1.5,
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}

export function difficultyVariant(d: string): BadgeVariant {
  if (d === 'beginner' || d === 'easy') return 'difficulty-beginner';
  if (d === 'advanced' || d === 'hard') return 'difficulty-advanced';
  return 'difficulty-intermediate';
}

export function subjectVariant(s: string): BadgeVariant {
  const l = s.toLowerCase();
  if (l === 'physics') return 'subject-physics';
  if (l === 'chemistry') return 'subject-chemistry';
  if (l === 'mathematics' || l === 'maths') return 'subject-mathematics';
  if (l === 'botany') return 'subject-botany';
  if (l === 'zoology') return 'subject-zoology';
  return 'subject-physics';
}

export function qtypeVariant(qt: string): BadgeVariant {
  if (qt === 'integer') return 'type-integer';
  if (qt === 'mcq_multi') return 'type-multi';
  if (qt === 'paragraph') return 'type-paragraph';
  return 'type-mcq';
}
