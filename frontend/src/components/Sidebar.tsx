'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearSession, getUser } from '@/lib/auth';
import { api } from '@/lib/api';

type ClassValue = string | false | null | undefined;
const cx = (...parts: ClassValue[]) => parts.filter(Boolean).join(' ');

const DashIcon = () => (
  <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);
const PracticeIcon = () => (
  <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
  </svg>
);
const MockIcon = () => (
  <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M7 8h10M7 12h6M16 16l2-2-2-2" />
  </svg>
);
const BrainIcon = () => (
  <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04" />
  </svg>
);
const TagIcon = () => (
  <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20.6 13.4L12 22l-9-9V3h10l7.6 7.6a2 2 0 0 1 0 2.8z" /><circle cx="7.5" cy="7.5" r="1.5" />
  </svg>
);

const ALL_LINKS = [
  { href: '/dashboard',     label: 'Dashboard',         hint: 'Your progress',        Icon: DashIcon,     mode: 'all'  as const },
  { href: '/practice',      label: 'JEE Practice',      hint: 'Topic-wise questions', Icon: PracticeIcon, mode: 'jee'  as const },
  { href: '/neet/practice', label: 'NEET Practice',     hint: 'Topic-wise questions', Icon: PracticeIcon, mode: 'neet' as const },
  { href: '/mock',          label: 'Mock Test',         hint: 'Full-length exam',     Icon: MockIcon,     mode: 'all'  as const },
  { href: '/psychometric',   label: 'Psychometric Test', hint: 'AI Behavior & Career', Icon: BrainIcon,    mode: 'all'  as const },
  { href: '/pricing',        label: 'Plans & Pricing',   hint: 'Upgrade your plan',    Icon: TagIcon,      mode: 'all'  as const },
];

type NavLink = (typeof ALL_LINKS)[number];
type User = ReturnType<typeof getUser>;

const FOCUS_RING =
  'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-accent focus-visible:outline-offset-[3px]';

function userMeta(user: User): string {
  if (!user) return '';
  const exam = user.targetExam === 'NEET' ? 'NEET UG' : `JEE ${user.targetExam}`;
  return `Class ${user.class} · ${exam}`;
}

// Next derives the image srcset from the width/height props, so they must match the
// size the logo is actually rendered at (the PNG is 2000x1036, ratio ~1.93).
const LOGO_BOX = {
  lg: { width: 124, height: 64 },
  sm: { width: 85, height: 44 },
} as const;

function Logo({ collapsed = false, size = 'lg' }: { collapsed?: boolean; size?: 'lg' | 'sm' }) {
  const box = LOGO_BOX[size];
  return (
    <Link
      href="/dashboard"
      aria-label="JEENEET.ai"
      className={cx(
        'inline-flex items-center self-center rounded-xl no-underline',
        collapsed ? 'p-0' : 'p-[2px_4px]',
        FOCUS_RING,
      )}
    >
      <Image
        src="/logo.png"
        alt="JEENEET.ai"
        width={box.width}
        height={box.height}
        className={cx('block w-auto', size === 'sm' ? 'h-11' : 'h-16', collapsed && 'hidden')}
      />
      <span
        aria-hidden
        className={cx(
          'h-[var(--sb-item)] w-[var(--sb-item)] place-items-center rounded-[14px] bg-grad pb-0.5 font-display text-[26px] font-extrabold leading-none text-white shadow-sb-pur-4',
          collapsed ? 'grid' : 'hidden',
        )}
      >
        J
      </span>
    </Link>
  );
}

function NavList({ links, pathname, collapsed }: { links: NavLink[]; pathname: string; collapsed: boolean }) {
  return (
    <nav aria-label="Main" className={cx('grid', collapsed ? 'mt-3 gap-3 justify-items-center' : 'mt-0.5 gap-2')}>
      <p
        className={cx(
          "mb-0.5 flex items-center gap-2.5 px-1.5 text-[12.5px] font-bold text-mute after:content-[''] after:flex-1 after:h-0.5 after:rounded-[2px] after:bg-[repeating-linear-gradient(90deg,#C6D2F8_0_6px,transparent_6px_11px)]",
          collapsed && 'hidden',
        )}
      >
        Menu
      </p>
      {links.map(({ href, label, hint, Icon }) => {
        const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            title={collapsed ? label : undefined}
            className={cx(
              'group grid items-center gap-3 rounded-2xl no-underline',
              'transition-[background,transform,box-shadow] duration-150 ease-[ease]',
              '[-webkit-tap-highlight-color:transparent] motion-reduce:transition-none',
              collapsed
                ? 'grid-cols-[var(--sb-item)] bg-transparent p-0 shadow-none'
                : 'grid-cols-[40px_minmax(0,1fr)] px-2.5 py-2 [@media(max-height:620px)]:px-2.5 [@media(max-height:620px)]:py-1.5',
              '[@media(max-width:340px)]:gap-2.5',
              active
                ? collapsed
                  ? 'bg-transparent shadow-none'
                  : 'bg-grad text-white shadow-sb-pur-5'
                : cx(
                    'text-brand',
                    '[@media(hover:hover)]:hover:bg-ice [@media(hover:hover)]:hover:translate-x-[3px]',
                  ),
              FOCUS_RING,
            )}
          >
            <span
              className={cx(
                'grid place-items-center rounded-xl',
                'transition-[background,color] duration-150 ease-[ease] motion-reduce:transition-none',
                collapsed ? 'h-[var(--sb-item)] w-[var(--sb-item)]' : 'h-10 w-10',
                active
                  ? collapsed
                    ? 'bg-grad text-white shadow-sb-pur-4'
                    : 'bg-white/[.22] text-white'
                  : cx(
                      'bg-ice text-brand',
                      collapsed
                        ? '[@media(hover:hover)]:group-hover:bg-white [@media(hover:hover)]:group-hover:shadow-[inset_0_0_0_2px_#C6D2F8]'
                        : '[@media(hover:hover)]:group-hover:bg-white',
                    ),
              )}
            >
              <Icon />
            </span>
            <span className={cx('min-w-0', collapsed && 'hidden')}>
              <strong className="block truncate text-[15px] font-extrabold leading-[1.2] [@media(max-width:340px)]:text-[14px]">{label}</strong>
              <small
                className={cx(
                  'mt-px block truncate text-[12px] font-semibold leading-[1.3]',
                  '[@media(max-height:620px)]:hidden',
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

function Footer({ user, onLogout, collapsed }: { user: User; onLogout: () => void; collapsed: boolean }) {
  const first = user?.name?.trim().split(/\s+/)[0] ?? '';
  return (
    <div className="mt-auto grid gap-3.5">
      <div
        aria-hidden
        className={cx(
          'mx-1 ml-0.5 flex items-start gap-2.5 rounded-[18px] border-[2.5px] border-accent bg-white px-3.5 py-3',
          'rotate-[-1.5deg] font-display text-[17px] font-extrabold leading-[1.15] text-brand shadow-sb-note',
          '[@media(max-height:760px)]:hidden',
          collapsed && 'hidden',
        )}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" className="mt-0.5 shrink-0 fill-accent">
          <path d="M12 0C12 7 17 12 24 12C17 12 12 17 12 24C12 17 7 12 0 12C7 12 12 7 12 0Z" />
        </svg>
        <p>
          Small steps,
          <br />
          every day.
        </p>
      </div>

      {user && (
        <div
          className={cx(
            'flex items-center gap-3 rounded-[18px]',
            collapsed
              ? 'justify-center border-0 bg-transparent p-0 shadow-none'
              : 'border-[2.5px] border-brand bg-white px-3 py-2.5 shadow-sb-soft-5',
          )}
        >
          <span
            aria-hidden
            className={cx(
              'grid shrink-0 place-items-center rounded-[14px] bg-grad font-display text-[20px] font-extrabold text-white shadow-sb-pur-3',
              collapsed ? 'h-[var(--sb-item)] w-[var(--sb-item)]' : 'h-[42px] w-[42px]',
            )}
          >
            {first.charAt(0).toUpperCase()}
          </span>
          <div className={cx('min-w-0', collapsed && 'hidden')}>
            <strong className="block truncate font-display text-[16px] font-extrabold text-brand">Hi, {first}!</strong>
            <small className="mt-px block truncate text-[12px] font-semibold leading-[1.35] text-mute [@media(max-height:620px)]:hidden">{userMeta(user)}</small>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onLogout}
        title="Sign out"
        className={cx(
          'flex items-center justify-center gap-2 rounded-[14px] border-[2.5px] border-brand bg-white',
          'text-[14.5px] font-extrabold text-brand shadow-sb-soft-4',
          'transition-[transform,box-shadow] duration-150 ease-[ease] motion-reduce:transition-none',
          '[@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:shadow-sb-soft-6',
          'active:translate-y-[3px] active:shadow-sb-soft-1',
          collapsed ? 'mx-auto h-[var(--sb-item)] min-h-[var(--sb-item)] w-[var(--sb-item)] p-0' : 'w-full min-h-[46px]',
          FOCUS_RING,
        )}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        <span className={cx(collapsed && 'hidden')}>Sign out</span>
      </button>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => { setUser(getUser()); }, []);

  // Restore the saved preference; on a narrow screen default to the icon rail.
  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem('sb-collapsed'); } catch {}
    const narrow = window.matchMedia('(max-width: 1024px)').matches;
    setCollapsed(saved === null ? narrow : saved === '1');
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Rotating or resizing past the mobile breakpoint removes the drawer from
  // the layout, so close it too — otherwise the body stays scroll-locked.
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

  function handleLogout() {
    // Revoke the token on the server first (best effort), then drop it locally either way
    api.auth.logout()
      .catch(() => {})
      .finally(() => {
        clearSession();
        router.push('/login');
      });
  }

  // Only an explicit toggle is remembered, so the auto-rail default stays temporary.
  function toggleCollapsed() {
    const next = !collapsed;
    setCollapsed(next);
    try { localStorage.setItem('sb-collapsed', next ? '1' : '0'); } catch {}
  }

  const isNEET = user?.targetExam === 'NEET';
  const links = user === null
    ? ALL_LINKS
    : ALL_LINKS.filter((l) => {
        if (l.mode === 'jee') return !isNEET;
        if (l.mode === 'neet') return isNEET;
        return true;
      });

  const inner = cx(
    'flex h-full min-h-0 flex-[1_1_auto] flex-col gap-[18px] overflow-x-hidden overflow-y-auto',
    'overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    'pb-[calc(14px+env(safe-area-inset-bottom,0px))] pl-[14px] pr-[14px] pt-[calc(18px+env(safe-area-inset-top,0px))]',
    '[@media(max-height:760px)]:gap-[14px]',
    '[@media(max-height:620px)]:gap-2.5 [@media(max-height:620px)]:pt-[calc(12px+env(safe-area-inset-top,0px))]',
    '[@media(max-width:340px)]:pl-2.5 [@media(max-width:340px)]:pr-2.5',
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cx(
          'sidebar sidebar-desktop font-dm bg-white bg-sidebar-wash text-brand shadow-sb-float',
          collapsed && 'collapsed',
        )}
      >
        <div className={inner}>
          <Logo collapsed={collapsed} />
          <NavList links={links} pathname={pathname} collapsed={collapsed} />
          <Footer user={user} onLogout={handleLogout} collapsed={collapsed} />
        </div>

        {/* Click the right edge to collapse / expand */}
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cx(
            'group absolute inset-y-0 right-0 z-10 w-3 cursor-pointer border-0 bg-transparent p-0',
            'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-accent focus-visible:outline-offset-[-3px]',
          )}
        >
          <span
            aria-hidden
            className={cx(
              'pointer-events-none absolute right-0 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center',
              'rounded-full border-[2.5px] border-brand bg-white text-brand shadow-sb-soft-4',
              'scale-90 opacity-0 transition-[opacity,transform] duration-150 ease-[ease] motion-reduce:transition-none',
              'group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100',
            )}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              {collapsed ? <polyline points="9 6 15 12 9 18" /> : <polyline points="15 6 9 12 15 18" />}
            </svg>
          </span>
        </button>
      </aside>

      {/* Mobile top bar */}
      <div className="mobile-topbar font-dm bg-white bg-topbar-wash border-b-[2.5px] border-brand text-brand shadow-sb-soft-4">
        <div className="flex w-full items-center justify-between gap-3">
          <Logo size="sm" />
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            className={cx(
              'grid h-[46px] w-[46px] shrink-0 place-items-center rounded-[14px] bg-grad text-white shadow-sb-pur-5',
              'transition-[transform,box-shadow] duration-150 ease-[ease] motion-reduce:transition-none',
              '[@media(hover:hover)]:hover:bg-[#f3f4f6] [@media(hover:hover)]:hover:text-[#2c3e50]',
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

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-[51] animate-[fade-in_.15s_ease] bg-[rgba(0,40,79,.5)] backdrop-blur-[3px]"
        />
      )}

      {/* Mobile drawer */}
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
                'grid h-[46px] w-[46px] shrink-0 place-items-center rounded-[14px]',
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
          <NavList links={links} pathname={pathname} collapsed={false} />
          <Footer user={user} onLogout={handleLogout} collapsed={false} />
        </div>
      </aside>
    </>
  );
}
