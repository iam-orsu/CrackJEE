'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';

interface DragToConfirmProps {
  onConfirm: () => void;
  label?: string;
  disabled?: boolean;
}

const THUMB_W = 52;
const THUMB_PAD = 4;

export function DragToConfirm({ onConfirm, label = 'Drag to submit exam', disabled = false }: DragToConfirmProps) {
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
      setConfirmed(true);
      setProgress(1);
      confirmTimerRef.current = setTimeout(onConfirm, 320);
    } else {
      setProgress(0);
    }
  }, [dragging, progress, onConfirm]);

  const thumbLeft = THUMB_PAD + progress * usableW;
  const fillPct = progress * 100;

  return (
    <>
      <style>{`
        @keyframes _dtcPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(30,41,59,.25); }
          50%      { box-shadow: 0 0 0 7px rgba(30,41,59,0); }
        }
        ._dtcThumb { animation: _dtcPulse 2.2s ease infinite; }
        ._dtcThumb:active { animation: none; }
      `}</style>
      <div
        ref={trackRef}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        style={{
          position: 'relative', height: 56, borderRadius: 28,
          background: confirmed ? '#f0fdf4' : '#f8fafc',
          border: `1.5px solid ${confirmed ? '#bbf7d0' : '#e2e8f0'}`,
          overflow: 'hidden',
          userSelect: 'none', touchAction: 'none',
          cursor: disabled ? 'not-allowed' : 'default',
          transition: 'background .25s, border-color .25s',
        }}
      >
        {/* Fill bar */}
        <div style={{
          position: 'absolute', inset: 0, right: 'auto',
          width: `${fillPct}%`,
          background: confirmed ? '#16a34a' : '#1e293b',
          opacity: 0.1,
          transition: dragging ? 'none' : 'width .35s cubic-bezier(.34,1.56,.64,1)',
          borderRadius: 28,
          pointerEvents: 'none',
        }} />

        {/* Track label */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
          justifyContent: 'center', pointerEvents: 'none',
          fontSize: 13, fontWeight: 600,
          color: confirmed ? '#15803d' : '#94a3b8',
          opacity: progress > 0.25 ? 0 : 1,
          transition: 'opacity .15s',
        }}>
          {confirmed ? 'Submitted ✓' : label}
        </div>

        {/* Thumb */}
        <div
          className={confirmed ? undefined : '_dtcThumb'}
          onPointerDown={onPointerDown}
          style={{
            position: 'absolute',
            left: thumbLeft,
            top: THUMB_PAD,
            width: THUMB_W,
            height: 56 - THUMB_PAD * 2,
            borderRadius: 24,
            background: confirmed ? '#16a34a' : '#1e293b',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: disabled ? 'not-allowed' : dragging ? 'grabbing' : 'grab',
            transition: dragging ? 'none' : 'left .35s cubic-bezier(.34,1.56,.64,1), background .25s',
            color: '#fff',
            boxShadow: dragging ? '0 6px 20px rgba(0,0,0,.18)' : '0 2px 8px rgba(0,0,0,.12)',
          }}
        >
          {confirmed ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          )}
        </div>
      </div>
    </>
  );
}
