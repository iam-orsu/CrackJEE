'use client';

import React from 'react';

export type PortalTab = 'papers' | 'batches' | 'assignments' | 'reports';

type ClassValue = string | false | null | undefined;
const cx = (...parts: ClassValue[]) => parts.filter(Boolean).join(' ');

const FOCUS_RING =
  'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-accent focus-visible:outline-offset-[3px]';

/* One stroke set, drawn like the app sidebar so the whole product reads as one hand. */
const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

const PapersIcon = () => (
  <svg {...iconProps} className="h-[22px] w-[22px]">
    <path d="M14 3v5h5" />
    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h9l5 5v11a2 2 0 01-2 2z" />
    <path d="M8 13h8M8 17h5" />
  </svg>
);

const BatchesIcon = () => (
  <svg {...iconProps} className="h-[22px] w-[22px]">
    <circle cx="9.5" cy="7.5" r="3.5" />
    <path d="M16 20v-1.5a4 4 0 00-4-4H7a4 4 0 00-4 4V20" />
    <path d="M17 4.2a3.5 3.5 0 010 6.6" />
    <path d="M21 20v-1.5a4 4 0 00-3-3.87" />
  </svg>
);

const AssignIcon = () => (
  <svg {...iconProps} className="h-[22px] w-[22px]">
    <path d="M22 2L11 13" />
    <path d="M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

const ReportsIcon = () => (
  <svg {...iconProps} className="h-[22px] w-[22px]">
    <path d="M3 20h18" />
    <rect x="5" y="12" width="3.5" height="6" rx="1" />
    <rect x="10.25" y="7" width="3.5" height="11" rx="1" />
    <rect x="15.5" y="14" width="3.5" height="4" rx="1" />
  </svg>
);

interface PortalTabDef {
  value: PortalTab;
  label: string;
  hint: string;
  Icon: () => React.ReactElement;
}

export const PORTAL_TABS: PortalTabDef[] = [
  { value: 'papers', label: 'Paper Studio', hint: 'Generate verified papers', Icon: PapersIcon },
  { value: 'batches', label: 'Batches', hint: 'Students and groups', Icon: BatchesIcon },
  { value: 'assignments', label: 'Assign Exams', hint: 'Schedule to a batch', Icon: AssignIcon },
  { value: 'reports', label: 'Reports', hint: 'Batch performance', Icon: ReportsIcon },
];

export interface FacultySidebarProps {
  activeTab: PortalTab;
  onTabChange: (tab: PortalTab) => void;
  className?: string;
}

/**
 * The faculty sections, as a small floating rail. Vertical on desktop, a
 * scrolling strip on narrow screens — same rows, same order.
 */
export function FacultySidebar({ activeTab, onTabChange, className }: FacultySidebarProps) {
  return (
    <nav
      aria-label="Faculty sections"
      className={cx(
        'flex gap-2 overflow-x-auto rounded-[22px] border-[2.5px] border-brand bg-white p-2.5 shadow-sb-float',
        'lg:sticky lg:top-[92px] lg:w-[252px] lg:shrink-0 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:p-3',
        '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className,
      )}
    >
      <p
        className={cx(
          "mb-1 hidden items-center gap-2.5 px-1.5 text-[12.5px] font-bold text-mute after:h-0.5 after:flex-1 after:rounded-[2px] after:bg-[repeating-linear-gradient(90deg,#C6D2F8_0_6px,transparent_6px_11px)] after:content-[''] lg:flex",
        )}
      >
        Sections
      </p>

      {PORTAL_TABS.map(({ value, label, hint, Icon }) => {
        const active = activeTab === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onTabChange(value)}
            aria-current={active ? 'true' : undefined}
            className={cx(
              'group grid shrink-0 cursor-pointer grid-cols-[36px_minmax(0,1fr)] items-center gap-3 rounded-2xl border-0 text-left',
              'px-2 py-2 transition-[background,color,transform,box-shadow] duration-150 ease-[ease] motion-reduce:transition-none',
              active
                ? 'bg-grad text-white shadow-sb-pur-5'
                : 'bg-white text-brand [@media(hover:hover)]:hover:bg-ice [@media(hover:hover)]:hover:translate-x-[3px]',
              FOCUS_RING,
            )}
          >
            <span
              aria-hidden
              className={cx(
                'grid h-9 w-9 place-items-center rounded-xl transition-[background,color] duration-150 ease-[ease] motion-reduce:transition-none',
                active
                  ? 'bg-white/[.22] text-white'
                  : 'bg-ice text-brand [@media(hover:hover)]:group-hover:bg-white',
              )}
            >
              <Icon />
            </span>
            <span className="min-w-0">
              <strong className="block truncate text-[14.5px] font-extrabold leading-[1.2]">{label}</strong>
              <small
                className={cx(
                  'mt-px hidden truncate text-[12px] font-semibold leading-[1.3] lg:block',
                  active ? 'text-white/[.88]' : 'text-mute',
                )}
              >
                {hint}
              </small>
            </span>
          </button>
        );
      })}
    </nav>
  );
}
