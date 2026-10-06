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
const ProgressIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const links = [
  { href: '/dashboard', label: 'Dashboard', Icon: DashIcon },
  { href: '/practice',  label: 'Practice',  Icon: PracticeIcon },
  { href: '/progress',  label: 'Progress',  Icon: ProgressIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = getUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  function handleLogout() {
    clearSession();
    router.push('/login');
  }

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
            <p className="sidebar-user-meta">Class {user.class} · JEE {user.targetExam}</p>
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
              <p className="sidebar-user-meta">Class {user.class} · JEE {user.targetExam}</p>
            </>
          )}
          <button className="sidebar-signout" onClick={handleLogout}>Sign out</button>
        </div>
      </aside>
    </>
  );
}
