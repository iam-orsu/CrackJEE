'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearSession, getUser } from '@/lib/auth';
import { api } from '@/lib/api';

const DashIcon = () => (
  <svg className="sb-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);
const PracticeIcon = () => (
  <svg className="sb-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
  </svg>
);
const MockIcon = () => (
  <svg className="sb-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M7 8h10M7 12h6M16 16l2-2-2-2" />
  </svg>
);

const ALL_LINKS = [
  { href: '/dashboard',     label: 'Dashboard',     hint: 'Your progress',        Icon: DashIcon,     mode: 'all'  as const },
  { href: '/practice',      label: 'JEE Practice',  hint: 'Topic-wise questions', Icon: PracticeIcon, mode: 'jee'  as const },
  { href: '/neet/practice', label: 'NEET Practice', hint: 'Topic-wise questions', Icon: PracticeIcon, mode: 'neet' as const },
  { href: '/mock',          label: 'Mock Test',     hint: 'Full-length exam',     Icon: MockIcon,     mode: 'all'  as const },
];

type NavLink = (typeof ALL_LINKS)[number];
type User = ReturnType<typeof getUser>;

function userMeta(user: User): string {
  if (!user) return '';
  const exam = user.targetExam === 'NEET' ? 'NEET UG' : `JEE ${user.targetExam}`;
  return `Class ${user.class} · ${exam}`;
}

function NavList({ links, pathname }: { links: NavLink[]; pathname: string }) {
  return (
    <nav className="sb-nav" aria-label="Main">
      <p className="sb-label">Menu</p>
      {links.map(({ href, label, hint, Icon }) => {
        const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={`sb-link${active ? ' on' : ''}`}
            aria-current={active ? 'page' : undefined}
          >
            <span className="sb-tile"><Icon /></span>
            <span className="sb-text">
              <strong>{label}</strong>
              <small>{hint}</small>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

function Footer({ user, onLogout }: { user: User; onLogout: () => void }) {
  const first = user?.name?.trim().split(/\s+/)[0] ?? '';
  return (
    <>
      <div className="sb-sticky" aria-hidden>
        Small steps,
        <br />
        every day.
      </div>

      {user && (
        <div className="sb-user">
          <span className="sb-avatar" aria-hidden>{first.charAt(0).toUpperCase()}</span>
          <div className="sb-who">
            <strong>Hi, {first}!</strong>
            <small>{userMeta(user)}</small>
          </div>
        </div>
      )}

      <button type="button" className="sb-out" onClick={onLogout}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Sign out
      </button>
    </>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setUser(getUser()); }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

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

  const isNEET = user?.targetExam === 'NEET';
  const links = user === null
    ? ALL_LINKS
    : ALL_LINKS.filter((l) => {
        if (l.mode === 'jee') return !isNEET;
        if (l.mode === 'neet') return isNEET;
        return true;
      });

  return (
    <>
      <style>{css}</style>

      {/* Desktop sidebar */}
      <aside className="sidebar sidebar-desktop sb-root">
        <div className="sb-in">
          <Link href="/dashboard" className="sb-logo">
            <Image src="/logo.png" alt="JEENEET.ai" width={78} height={32} className="site-logo" />
          </Link>
          <NavList links={links} pathname={pathname} />
          <Footer user={user} onLogout={handleLogout} />
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="mobile-topbar sb-top">
        <div className="sb-top-in">
          <Link href="/dashboard" className="sb-logo">
            <Image src="/logo.png" alt="JEENEET.ai" width={78} height={32} className="site-logo" />
          </Link>
          <button type="button" className="mobile-burger sb-burger" onClick={() => setMobileOpen(true)} aria-label="Open menu" aria-expanded={mobileOpen}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="mobile-overlay sb-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile drawer */}
      <aside className={`sidebar sidebar-mobile sb-root${mobileOpen ? ' open' : ''}`}>
        <div className="sb-in">
          <div className="sb-dhead">
            <Link href="/dashboard" className="sb-logo">
              <Image src="/logo.png" alt="JEENEET.ai" width={78} height={32} className="site-logo" />
            </Link>
            <button type="button" className="sb-close" onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <NavList links={links} pathname={pathname} />
          <Footer user={user} onLogout={handleLogout} />
        </div>
      </aside>
    </>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=Fraunces:opsz,wght@9..144,800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');

.sb-root,.sb-top{
  --blue:#003366; --blue-d:#071C6B; --blue-l:#2A4FD6;
  --red:#C8202F; --red-d:#8F1521; --ink:#0E1A55; --mute:#5663A0;
  font-family:'Plus Jakarta Sans',system-ui,sans-serif;
}

/* Colours only: width, position and show/hide stay with your global layout CSS */
.sidebar.sb-root{
  background-color:var(--blue);
  background-image:radial-gradient(420px 320px at 0% 0%, var(--blue-l) 0%, transparent 70%);
  color:#fff;border-right:0;box-shadow:4px 0 0 var(--blue-d);padding:0;
}
.sb-root *{box-sizing:border-box}
.sb-root p{margin:0}

.sb-in{display:flex;flex-direction:column;gap:18px;flex:1 1 auto;height:100%;min-height:0;padding:18px 14px 14px;overflow-y:auto}

.sb-logo{display:inline-flex;align-self:flex-start;background:#fff;border-radius:14px;padding:6px 12px;box-shadow:0 5px 0 rgba(7,28,107,.45);margin:2px 2px 0;text-decoration:none}
.sb-dhead{display:flex;align-items:center;justify-content:space-between;gap:12px}

/* Links */
.sb-nav{display:grid;gap:8px;margin-top:4px}
.sb-label{padding:0 10px;margin-bottom:2px !important;font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;opacity:.7}
.sb-link{
  display:grid;grid-template-columns:40px minmax(0,1fr);gap:12px;align-items:center;padding:8px 10px;border-radius:16px;
  color:#fff;text-decoration:none;transition:background .15s,transform .15s,box-shadow .15s;-webkit-tap-highlight-color:transparent;
}
.sb-tile{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;background:rgba(255,255,255,.14);transition:background .15s}
.sb-ico{width:22px;height:22px}
.sb-text{min-width:0}
.sb-text strong{display:block;font-size:15px;font-weight:800;line-height:1.2}
.sb-text small{display:block;margin-top:1px;font-size:11.5px;font-weight:600;line-height:1.3;opacity:.75}
.sb-link:hover{background:rgba(255,255,255,.12);transform:translateX(3px)}
.sb-link.on{background:#fff;color:var(--blue);box-shadow:0 5px 0 rgba(7,28,107,.55);transform:none}
.sb-link.on .sb-tile{background:var(--red);color:#fff}
.sb-link.on .sb-text small{color:var(--mute);opacity:1}
.sb-link:focus-visible,.sb-out:focus-visible,.sb-close:focus-visible,.sb-burger:focus-visible,.sb-logo:focus-visible{outline:3px solid #FFE680;outline-offset:2px}

/* Footer */
.sb-sticky{
  margin-top:auto;align-self:flex-start;background:#FFE680;color:var(--ink);border-radius:6px;padding:12px 16px;
  transform:rotate(-2deg);box-shadow:0 10px 16px rgba(3,10,50,.35);
  font-family:'Caveat',cursive;font-weight:600;font-size:23px;line-height:1.1;
}
.sb-user{display:flex;align-items:center;gap:12px;background:rgba(255,255,255,.12);border-radius:16px;padding:10px 12px}
.sb-avatar{
  flex:none;width:42px;height:42px;border-radius:50%;display:grid;place-items:center;background:var(--red);color:#fff;
  font-family:'Fraunces',serif;font-weight:800;font-size:19px;border:3px solid #fff;box-shadow:0 3px 0 var(--red-d);
}
.sb-who{min-width:0}
.sb-who strong{display:block;font-size:14.5px;font-weight:800;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sb-who small{display:block;margin-top:1px;font-size:11.5px;font-weight:600;line-height:1.35;opacity:.8}
.sb-out{
  display:flex;align-items:center;justify-content:center;gap:8px;width:100%;min-height:44px;
  font:inherit;font-weight:800;font-size:14px;color:#fff;background:transparent;border:2px solid rgba(255,255,255,.55);
  border-radius:14px;cursor:pointer;transition:background .15s;-webkit-tap-highlight-color:transparent;
}
.sb-out:hover{background:rgba(255,255,255,.14)}

/* Mobile top bar. Its display is left to your global CSS; an inner wrapper does the layout. */
.mobile-topbar.sb-top{background:var(--blue);border-bottom:4px solid var(--red);color:#fff}
.sb-top-in{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%}
.sb-top .sb-logo{margin:0;box-shadow:0 4px 0 rgba(7,28,107,.45)}
.sb-top .sb-burger,.sb-root .sb-close{
  display:grid;place-items:center;width:46px;height:46px;padding:0;border:0;border-radius:14px;cursor:pointer;
  -webkit-tap-highlight-color:transparent;
}
.sb-top .sb-burger{background:#fff;color:var(--blue);box-shadow:0 4px 0 rgba(7,28,107,.5)}
.sb-root .sb-close{background:rgba(255,255,255,.16);color:#fff}
.mobile-overlay.sb-overlay{background:rgba(7,28,107,.55)}

/* Short screens: drop the sticky note so everything fits */
@media(max-height:700px){
  .sb-sticky{display:none}
  .sb-in{gap:14px}
}
@media(hover:none){
  .sb-link:hover{transform:none;background:transparent}
  .sb-link.on:hover{background:#fff}
}
@media(prefers-reduced-motion:reduce){
  .sb-root *{transition:none!important}
}
`;
