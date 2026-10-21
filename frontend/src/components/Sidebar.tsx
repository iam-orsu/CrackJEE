'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearSession, getUser } from '@/lib/auth';

const DashIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);
const PracticeIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
  </svg>
);
const MockIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M7 8h10M7 12h6M16 16l2-2-2-2" />
  </svg>
);

const ALL_LINKS = [
  { href: '/dashboard',     label: 'Dashboard',     Icon: DashIcon,     mode: 'all'  as const },
  { href: '/practice',      label: 'JEE Practice',  Icon: PracticeIcon, mode: 'jee'  as const },
  { href: '/neet/practice', label: 'NEET Practice', Icon: PracticeIcon, mode: 'neet' as const },
  { href: '/mock',          label: 'Mock Test',     Icon: MockIcon,     mode: 'all'  as const },
];

function userMeta(user: ReturnType<typeof getUser>): string {
  if (!user) return '';
  const exam = user.targetExam === 'NEET' ? 'NEET UG' : `JEE ${user.targetExam}`;
  return `Class ${user.class} · ${exam}`;
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setUser(getUser()); }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  function handleLogout() {
    clearSession();
    router.push('/login');
  }

  const isNEET = user?.targetExam === 'NEET';
  const links = user === null
    ? ALL_LINKS
    : ALL_LINKS.filter((l) => {
        if (l.mode === 'jee') return !isNEET;
        if (l.mode === 'neet') return isNEET;
        return true;
      });

  const sidebarContent = (
    <>
      <Link href="/dashboard" className="sidebar-logo">
        CrackJEE
      </Link>
      <nav className="sidebar-nav">
        {links.map(({ href, label, Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link key={href} href={href} className={`sidebar-link${active ? ' active' : ''}`}>
              <Icon />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        {user && (
          <>
            <p className="sidebar-user-name">{user.name}</p>
            <p className="sidebar-user-meta">{userMeta(user)}</p>
          </>
        )}
        <button className="sidebar-signout" onClick={handleLogout}>Sign out</button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sidebar sidebar-desktop">
        {sidebarContent}
      </aside>

      {/* Mobile top bar */}
      <div className="mobile-topbar">
        <Link href="/dashboard" className="sidebar-logo" style={{ fontSize: 16 }}>CrackJEE</Link>
        <button className="mobile-burger" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile drawer */}
      <aside className={`sidebar sidebar-mobile${mobileOpen ? ' open' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--gray-200)' }}>
          <span className="sidebar-logo" style={{ paddingBottom: 0, borderBottom: 'none', marginBottom: 0 }}>CrackJEE</span>
          <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-500)', padding: 4 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <nav className="sidebar-nav">
          {links.map(({ href, label, Icon }) => {
            const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
            return (
              <Link key={href} href={href} className={`sidebar-link${active ? ' active' : ''}`}>
                <Icon />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          {user && (
            <>
              <p className="sidebar-user-name">{user.name}</p>
              <p className="sidebar-user-meta">{userMeta(user)}</p>
            </>
          )}
          <button className="sidebar-signout" onClick={handleLogout}>Sign out</button>
        </div>
      </aside>
    </>
  );
}
