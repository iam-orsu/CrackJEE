'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { EX, FONT_SANS } from '@/components/mock/examTheme';

interface DragToConfirmProps {
  onConfirm: () => void;
  label?: string;
  disabled?: boolean;
}

const THUMB_W = 56;
const THUMB_PAD = 5;
const OK = '#1E7A45';

/* A slide-to-confirm control: drag the handle across the track, or focus it and press Enter */
export function DragToConfirm({ onConfirm, label = 'Slide to submit exam', disabled = false }: DragToConfirmProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [usableW, setUsableW] = useState(240);
  const [progress, setProgress] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [dragging, setDragging] = useState(false);

  // offset from thumb's left edge to pointer when drag started
  const dragOffsetRef = useRef(0);
  // Delay before onConfirm, cleared if the control unmounts first
  const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current); }, []);

  useEffect(() => {
    const update = () => {
      if (trackRef.current) {
        setUsableW(Math.max(80, trackRef.current.getBoundingClientRect().width - THUMB_W - THUMB_PAD * 2));
      }
    };
    update();
    const ro = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(update)
      : null;
    if (ro && trackRef.current) ro.observe(trackRef.current);
    return () => ro?.disconnect();
  }, []);

  const finish = useCallback(() => {
    setConfirmed(true);
    setProgress(1);
    confirmTimerRef.current = setTimeout(onConfirm, 320);
  }, [onConfirm]);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || confirmed) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const thumbLeft = THUMB_PAD + progress * usableW;
    dragOffsetRef.current = e.clientX - (trackRef.current?.getBoundingClientRect().left ?? 0) - thumbLeft;
    setDragging(true);
  }, [disabled, confirmed, progress, usableW]);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const trackLeft = trackRef.current?.getBoundingClientRect().left ?? 0;
    const x = e.clientX - trackLeft - dragOffsetRef.current - THUMB_PAD;
    setProgress(Math.max(0, Math.min(1, x / usableW)));
  }, [dragging, usableW]);

  const onPointerUp = useCallback(() => {
    if (!dragging) return;
    setDragging(false);
    if (progress >= 0.85) {
      finish();
    } else {
      setProgress(0);
    }
  }, [dragging, progress, finish]);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled || confirmed) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      finish();
    }
  }, [disabled, confirmed, finish]);

  const thumbLeft = THUMB_PAD + progress * usableW;
  const fillPct = progress * 100;

  return (
    <>
      <style>{`
        @keyframes _dtcPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(29,78,137,.22); }
          60%     { box-shadow: 0 0 0 7px rgba(29,78,137,0); }
        }
        ._dtcThumb:not(._dtcDone) { animation: _dtcPulse 2.4s ease infinite; }
        ._dtcThumb:active { animation: none; }
        ._dtcTrack:focus-visible { outline: none; box-shadow: 0 0 0 3px rgba(29,78,137,.22); }
      `}</style>
      <div
        ref={trackRef}
        className="_dtcTrack"
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        aria-disabled={disabled}
        onKeyDown={onKeyDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        style={{
          position: 'relative', height: 56, borderRadius: 8,
          background: confirmed ? '#F1F8F4' : '#F4F6F9',
          border: `1px solid ${confirmed ? '#B9DCC6' : EX.line}`,
          overflow: 'hidden',
          userSelect: 'none', touchAction: 'none',
          cursor: disabled ? 'not-allowed' : 'default',
          transition: 'background .2s, border-color .2s',
          fontFamily: FONT_SANS,
        }}
      >
        {/* Fill bar */}
        <div style={{
          position: 'absolute', inset: 0, right: 'auto',
          width: `${fillPct}%`,
          background: confirmed ? OK : EX.accent,
          opacity: confirmed ? 0.16 : 0.1,
          transition: dragging ? 'none' : 'width .3s cubic-bezier(.2,.7,.2,1)',
          pointerEvents: 'none',
        }} />

        {/* Track label */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 8, pointerEvents: 'none',
          fontSize: 12.5, fontWeight: 600, letterSpacing: '0.02em',
          color: confirmed ? OK : EX.mute,
          opacity: progress > 0.2 ? 0 : 1,
          transition: 'opacity .15s',
        }}>
          {confirmed ? 'Submitted' : label}
          {!confirmed && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h9M11 7l5 5-5 5M18 7l3 5-3 5" />
            </svg>
          )}
        </div>

        {/* Thumb */}
        <div
          className={`_dtcThumb${confirmed ? ' _dtcDone' : ''}`}
          onPointerDown={onPointerDown}
          style={{
            position: 'absolute',
            left: thumbLeft,
            top: THUMB_PAD,
            width: THUMB_W,
            height: 56 - THUMB_PAD * 2,
            borderRadius: 5,
            background: confirmed ? OK : EX.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: disabled ? 'not-allowed' : dragging ? 'grabbing' : 'grab',
            transition: dragging ? 'none' : 'left .3s cubic-bezier(.2,.7,.2,1), background .2s',
            color: '#fff',
            boxShadow: dragging ? '0 6px 16px rgba(15,23,42,.18)' : '0 1px 3px rgba(15,23,42,.18)',
          }}
        >
          {confirmed ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          )}
        </div>
      </div>
    </>
  );
}