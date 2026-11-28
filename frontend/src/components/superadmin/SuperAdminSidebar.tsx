'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { adminFetch } from '@/lib/admin';
import { useSuperAdmin } from './superadmin-context';

type ClassValue = string | false | null | undefined;
const cx = (...parts: ClassValue[]) => parts.filter(Boolean).join(' ');

const FOCUS_RING =
  'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-accent focus-visible:outline-offset-[3px]';

const GridIcon = () => (
  <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const UsersIcon = () => (
  <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" />
  </svg>
);

const TagIcon = () => (
  <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20.6 13.4L12 22l-9-9V3h10l7.6 7.6a2 2 0 0 1 0 2.8z" /><circle cx="7.5" cy="7.5" r="1.5" />
  </svg>
);

const PaymentIcon = () => (
  <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="2" y="5" width="20" height="14" rx="2.5" /><line x1="2" y1="10" x2="22" y2="10" /><line x1="6" y1="15" x2="10" y2="15" />
  </svg>
);

const LINKS = [
  { href: '/superadmin', label: 'Overview', hint: 'Platform metrics', Icon: GridIcon },
  { href: '/superadmin/students', label: 'Students', hint: 'Cohort and progress', Icon: UsersIcon },
  { href: '/superadmin/faculty', label: 'Faculty accounts', hint: 'Mentor access', Icon: ShieldIcon },
  { href: '/superadmin/plans', label: 'Plans and pricing', hint: 'Subscription tiers', Icon: TagIcon },
  { href: '/superadmin/payments', label: 'Payments', hint: 'Razorpay transactions', Icon: PaymentIcon },
];

const LOGO_BOX = { width: 124, height: 64 };

function Logo({ size = 'lg' }: { size?: 'lg' | 'sm' }) {
  return (
    <Link
      href="/superadmin"
      aria-label="JEENEET.ai platform console"
      className={cx(
        'inline-flex items-center self-center rounded-xl no-underline',
        size === 'sm' ? 'p-[2px_4px]' : 'p-[2px_4px]',
        FOCUS_RING,
      )}
    >
      <Image
        src="/logo.png"
        alt="JEENEET.ai"
        width={LOGO_BOX.width}
        height={LOGO_BOX.height}
        className={cx('block w-auto', size === 'sm' ? 'h-11' : 'h-14')}
      />
    </Link>
  );
}

function ConsoleBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-ice px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-[0.1em] text-brand">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
      Console
    </span>
  );
}

function NavList({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav aria-label="Console sections" className="grid gap-2">
      <p className="mb-0.5 flex items-center gap-2.5 px-1.5 text-[12.5px] font-bold text-mute after:content-[''] after:flex-1 after:h-0.5 after:rounded-[2px] after:bg-[repeating-linear-gradient(90deg,#C6D2F8_0_6px,transparent_6px_11px)]">
        Menu
      </p>
      {LINKS.map(({ href, label, hint, Icon }) => {
        const active = pathname === href || (href !== '/superadmin' && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            className={cx(
              'group grid grid-cols-[40px_minmax(0,1fr)] items-center gap-3 rounded-2xl px-2.5 py-2 no-underline',
              'transition-[background,transform,box-shadow] duration-150 ease-[ease]',
              '[-webkit-tap-highlight-color:transparent] motion-reduce:transition-none',
              active
                ? 'bg-grad text-white shadow-sb-pur-5'
                : cx(
                    'text-brand',
                    '[@media(hover:hover)]:hover:bg-ice [@media(hover:hover)]:hover:translate-x-[3px]',
                  ),
              FOCUS_RING,
            )}
          >
            <span
              className={cx(
                'grid h-10 w-10 place-items-center rounded-xl',
                'transition-[background,color] duration-150 ease-[ease] motion-reduce:transition-none',
                active ? 'bg-white/[.22] text-white' : 'bg-ice text-brand',
              )}
            >
              <Icon />
            </span>
            <span className="min-w-0">
              <strong className="block truncate text-[15px] font-extrabold leading-[1.2]">{label}</strong>
              <small
                className={cx(
                  'mt-px block truncate text-[12px] font-semibold leading-[1.3]',
                  active ? 'text-white/[.88]' : 'text-mute',
                )}
              >
                {hint}
              </small>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

function Footer({ onSignOut }: { onSignOut: () => void }) {
  return (
    <div className="mt-auto grid gap-3.5">
      <div className="flex items-center gap-3 rounded-[18px] border-[2.5px] border-brand bg-white px-3 py-2.5 shadow-sb-soft-5">
        <span
          aria-hidden
          className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-[14px] bg-grad text-white shadow-sb-pur-3"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" />
          </svg>
        </span>
        <div className="min-w-0">
          <strong className="block truncate font-display text-[15px] font-extrabold text-brand">Administrator</strong>
          <small className="mt-px block truncate text-[12px] font-semibold leading-[1.35] text-mute">Full console access</small>
        </div>
      </div>

      <button
        type="button"
        onClick={onSignOut}
        title="Sign out"
        className={cx(
          'flex w-full min-h-[46px] cursor-pointer items-center justify-center gap-2 rounded-[14px] border-[2.5px] border-brand bg-white',
          'text-[14.5px] font-extrabold text-brand shadow-sb-soft-4',
          'transition-[transform,box-shadow] duration-150 ease-[ease] motion-reduce:transition-none',
          '[@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:shadow-sb-soft-6',
          'active:translate-y-[3px] active:shadow-sb-soft-1',
          FOCUS_RING,
        )}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        <span>Sign out</span>
      </button>
    </div>
  );
}

export function SuperAdminSidebar() {
  const pathname = usePathname();
  const { expire } = useSuperAdmin();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 769px)');
    const onChange = () => { if (wide.matches) setMobileOpen(false); };
    wide.addEventListener('change', onChange);
    return () => wide.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  function handleSignOut() {
    adminFetch('/logout', { method: 'POST' }).catch(() => {});
    expire();
  }

  const inner = cx(
    'flex h-full min-h-0 flex-[1_1_auto] flex-col gap-[18px] overflow-x-hidden overflow-y-auto',
    'overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    'pb-[calc(14px+env(safe-area-inset-bottom,0px))] pl-[14px] pr-[14px] pt-[calc(18px+env(safe-area-inset-top,0px))]',
    '[@media(max-height:760px)]:gap-[14px]',
    '[@media(max-width:340px)]:pl-2.5 [@media(max-width:340px)]:pr-2.5',
  );

  return (
    <>
      <aside className="sidebar sidebar-desktop font-dm bg-white bg-sidebar-wash text-brand shadow-sb-float">
        <div className={inner}>
          <div className="flex items-center justify-between gap-2">
            <Logo />
            <ConsoleBadge />
          </div>
          <NavList pathname={pathname} />
          <Footer onSignOut={handleSignOut} />
        </div>
      </aside>

      <div className="mobile-topbar font-dm bg-white bg-topbar-wash border-b-[2.5px] border-brand text-brand shadow-sb-soft-4">
        <div className="flex w-full items-center justify-between gap-3">
          <Logo size="sm" />
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            className={cx(
              'grid h-[46px] w-[46px] shrink-0 cursor-pointer place-items-center rounded-[14px] bg-grad text-white shadow-sb-pur-5',
              'transition-[transform,box-shadow] duration-150 ease-[ease] motion-reduce:transition-none',
              'active:translate-y-[4px] active:shadow-sb-pur-1',
              FOCUS_RING,
            )}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden>
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-[51] animate-[fade-in_.15s_ease] bg-[rgba(0,40,79,.5)] backdrop-blur-[3px]"
        />
      )}

      <aside
        className={cx(
          'sidebar sidebar-mobile font-dm bg-white bg-sidebar-wash text-brand shadow-sb-drawer',
          'transition-transform duration-[220ms] ease-[ease] motion-reduce:transition-none',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className={inner}>
          <div className="flex items-center justify-between gap-3">
            <Logo />
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className={cx(
                'grid h-[46px] w-[46px] shrink-0 cursor-pointer place-items-center rounded-[14px]',
                'border-[2.5px] border-brand bg-white text-brand shadow-sb-soft-4',
                'transition-[transform,box-shadow] duration-150 ease-[ease] motion-reduce:transition-none',
                'active:translate-y-[3px] active:shadow-sb-soft-1',
                FOCUS_RING,
              )}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden>
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <NavList pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          <Footer onSignOut={handleSignOut} />
        </div>
      </aside>
    </>
  );
}
