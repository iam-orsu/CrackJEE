'use client';

import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface InsightsTab {
  key: string;
  label: string;
  Icon: LucideIcon;
  /** One line saying what this view holds, used by the next-view strip. */
  teaser: string;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

/**
 * The switcher for the mock insight views.
 *
 * Scrolling the insights section into view runs a short scan: a light band
 * travels across the pills and each one washes and lifts in turn, so the eye
 * lands on the tabs and reads them as something to press. The scan stops for
 * good once the student opens a view, so it never nags.
 */
export function InsightsTabBar({ tabs, active, onChange }: { tabs: InsightsTab[]; active: string; onChange: (key: string) => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const touchedRef = useRef(false);
  const [run, setRun] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || reduced) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        if (touchedRef.current) return;
        // Bumping the counter remounts the animated parts, which restarts them
        setRun((n) => n + 1);
      }
    }, { threshold: 0.55 });
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  const scanning = run > 0 && !reduced;

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const i = tabs.findIndex((t) => t.key === active);
    if (i < 0) return;
    let next = -1;
    if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = tabs.length - 1;
    if (next < 0) return;
    e.preventDefault();
    touchedRef.current = true;
    onChange(tabs[next]!.key);
    btnRefs.current[next]?.focus();
  }

  return (
    <>
      <style>{`
        @keyframes cj-tab-scan{from{transform:translateX(-130%)}to{transform:translateX(430%)}}
        @keyframes cj-tab-wash{0%{opacity:0}25%{opacity:1}100%{opacity:0}}
        @keyframes cj-tab-hit{0%,100%{transform:translateY(0) scale(1)}30%{transform:translateY(-3px) scale(1.06)}}
        @keyframes cj-tab-pill{from{transform:scale(.88);opacity:0}to{transform:scale(1);opacity:1}}
        .cj-tab-scan{background:linear-gradient(90deg,rgba(128,54,136,0),rgba(128,54,136,.22),rgba(128,54,136,0));animation:cj-tab-scan 1.05s cubic-bezier(.3,.7,.3,1) both}
        .cj-tab-wash{animation:cj-tab-wash .78s ease-out both}
        .cj-tab-hit{animation:cj-tab-hit .78s cubic-bezier(.2,.8,.2,1) both}
        .cj-tab-pill{animation:cj-tab-pill .32s cubic-bezier(.2,.8,.2,1) both}
        @media (prefers-reduced-motion:reduce){.cj-tab-scan,.cj-tab-wash,.cj-tab-hit,.cj-tab-pill{animation:none!important}}
      `}</style>
      <div ref={wrapRef} className="relative w-fit min-w-0 max-w-full overflow-hidden rounded-full">
        <div
          role="tablist"
          aria-label="Mock insight views"
          onKeyDown={onKeyDown}
          className="flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-[#003366]/10 bg-white/85 p-1 backdrop-blur-xl"
        >
          {tabs.map((t, i) => {
            const isActive = t.key === active;
            return (
              <button
                key={t.key}
                ref={(el) => { btnRefs.current[i] = el; }}
                role="tab"
                id={`insights-tab-${t.key}`}
                aria-selected={isActive}
                aria-controls={`insights-panel-${t.key}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => { touchedRef.current = true; onChange(t.key); }}
                className={`relative shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-bold transition-colors duration-200 motion-reduce:transition-none ${isActive ? 'text-white' : 'text-[#5A6B8C] hover:text-[#003366]'}`}
              >
                {isActive && <span key={t.key} aria-hidden className="cj-tab-pill absolute inset-0 rounded-full bg-[#003366] shadow-md" />}
                {scanning && (
                  <span
                    key={run}
                    aria-hidden
                    className="cj-tab-wash pointer-events-none absolute inset-0 rounded-full"
                    style={{
                      background: isActive ? 'rgba(255,255,255,.34)' : 'rgba(128,54,136,.18)',
                      animationDelay: `${140 + i * 95}ms`,
                    }}
                  />
                )}
                <span
                  key={run}
                  className={`relative z-10 flex items-center gap-1.5 ${scanning ? 'cj-tab-hit' : ''}`}
                  style={scanning ? { animationDelay: `${140 + i * 95}ms` } : undefined}
                >
                  <t.Icon size={14} strokeWidth={2.4} aria-hidden />
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
        {scanning && <span key={`scan-${run}`} aria-hidden className="cj-tab-scan pointer-events-none absolute inset-y-0 left-0 z-10 w-2/5 rounded-full" />}
      </div>
    </>
  );
}

/**
 * A quiet strip that names the next view and what it holds, so the other
 * views are worth opening even if the scan was missed.
 */
export function InsightsNextView({ tab, onOpen }: { tab: InsightsTab; onOpen: (key: string) => void }) {
  const Icon = tab.Icon;
  return (
    <button
      onClick={() => onOpen(tab.key)}
      className="group flex w-full items-center gap-3 rounded-full border border-[#003366]/10 bg-white/70 px-4 py-2 text-left backdrop-blur-xl transition-[transform,border-color,background-color] duration-200 hover:-translate-y-[2px] hover:border-[#803688]/40 hover:bg-white/90 motion-reduce:transition-none"
    >
      <span aria-hidden className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#EEF2FF] text-[#803688]">
        <Icon size={14} strokeWidth={2.4} />
      </span>
      <span className="shrink-0 text-[11px] font-semibold text-[#7A87A0]">Next view</span>
      <span className="min-w-0 flex-1 truncate text-[13px] font-bold text-[#003366]">{tab.teaser}</span>
      <span className="flex shrink-0 items-center gap-1.5 text-[12.5px] font-bold text-[#803688]">
        {tab.label}
        <ArrowRight size={14} strokeWidth={2.6} className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
      </span>
    </button>
  );
}
