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

function Logo() {
  return (
    <Link href="/dashboard" className="sb-logo" aria-label="JEENEET.ai">
      <Image src="/logo.png" alt="JEENEET.ai" width={96} height={39} className="site-logo" />
      <span className="sb-mark" aria-hidden>j</span>
    </Link>
  );
}

function NavList({ links, pathname, collapsed }: { links: NavLink[]; pathname: string; collapsed: boolean }) {
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
            title={collapsed ? label : undefined}
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
    <div className="sb-foot">
      <div className="sb-note" aria-hidden>
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path d="M12 0C12 7 17 12 24 12C17 12 12 17 12 24C12 17 7 12 0 12C7 12 12 7 12 0Z" />
        </svg>
        <p>
          Small steps,
          <br />
          every day.
        </p>
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

      <button type="button" className="sb-out" onClick={onLogout} title="Sign out">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        <span className="sb-out-t">Sign out</span>
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

  useEffect(() => {
    try { setCollapsed(localStorage.getItem('sb-collapsed') === '1'); } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem('sb-collapsed', collapsed ? '1' : '0'); } catch {}
  }, [collapsed]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);
  useEffect(() => { setCollapsed(false); }, [pathname]);

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
      <aside className={`sidebar sidebar-desktop sb-root${collapsed ? ' collapsed' : ''}`}>
        <div className="sb-in">
          <Logo />
          <NavList links={links} pathname={pathname} collapsed={collapsed} />
          <Footer user={user} onLogout={handleLogout} />
          <button type="button" className="sb-toggle" onClick={() => setCollapsed((c) => !c)} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-expanded={!collapsed}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="mobile-topbar sb-top">
        <div className="sb-top-in">
          <Logo />
          <button type="button" className="mobile-burger sb-burger" onClick={() => setMobileOpen(true)} aria-label="Open menu" aria-expanded={mobileOpen}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
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
            <Logo />
            <button type="button" className="sb-close" onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <NavList links={links} pathname={pathname} collapsed={false} />
          <Footer user={user} onLogout={handleLogout} />
        </div>
      </aside>
    </>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,800&family=DM+Sans:wght@500;600;700;800&display=swap');

.sb-root,.sb-top{
  --blue:#003366; --blue-d:#00284F; --purple:#803688; --purple-d:#5A2560;
  --grad:linear-gradient(135deg,#803688 0%,#A24BA8 100%);
  --ice:#EEF2FF; --soft:#C6D2F8; --mute:#4F5C96;
  font-family:'DM Sans',system-ui,sans-serif;
}

/* Colours only: width, position and show/hide stay with your global layout CSS */
.sidebar.sb-root{
  background-color:#fff;
  background-image:
    radial-gradient(ellipse 190px 160px at 108% 104%, #EDE3EF 97%, transparent 100%),
    radial-gradient(circle 90px at -10% 86%, #F4ECF6 97%, transparent 100%),
    radial-gradient(ellipse 150px 120px at 106% -2%, #EEF1FB 97%, transparent 100%);
  background-repeat:no-repeat;
  color:var(--blue);border-right:2.5px solid var(--blue);box-shadow:5px 0 0 var(--soft);padding:0;
}
.sb-root *,.sb-top *{box-sizing:border-box}
.sb-root p{margin:0}

.sb-in{
  display:flex;flex-direction:column;gap:18px;flex:1 1 auto;height:100%;min-height:0;
  padding:calc(18px + env(safe-area-inset-top,0px)) 14px calc(14px + env(safe-area-inset-bottom,0px));
  overflow-x:hidden;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;
}

/* Logo (+ compact mark for the collapsed state) */
.sb-logo{display:inline-flex;align-items:center;align-self:flex-start;padding:2px 4px;text-decoration:none;border-radius:12px}
.sb-mark{
  display:none;place-items:center;width:44px;height:44px;border-radius:14px;background:var(--grad);color:#fff;
  font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:26px;line-height:1;padding-bottom:4px;
  box-shadow:0 4px 0 var(--purple-d);
}
.sb-dhead{display:flex;align-items:center;justify-content:space-between;gap:12px}

/* Links */
.sb-nav{display:grid;gap:8px;margin-top:2px}
.sb-label{display:flex;align-items:center;gap:10px;padding:0 6px;margin-bottom:2px !important;font-size:12.5px;font-weight:700;color:var(--mute)}
.sb-label::after{content:"";flex:1;height:2px;border-radius:2px;background:repeating-linear-gradient(90deg,var(--soft) 0 6px,transparent 6px 11px)}
.sb-link{
  display:grid;grid-template-columns:40px minmax(0,1fr);gap:12px;align-items:center;padding:8px 10px;border-radius:16px;
  color:var(--blue);text-decoration:none;transition:background .15s,transform .15s,box-shadow .15s;-webkit-tap-highlight-color:transparent;
}
.sb-tile{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;background:var(--ice);color:var(--blue);transition:background .15s,color .15s}
.sb-ico{width:22px;height:22px}
.sb-text{min-width:0}
.sb-text strong{display:block;font-size:15px;font-weight:800;line-height:1.2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sb-text small{display:block;margin-top:1px;font-size:12px;font-weight:600;line-height:1.3;color:var(--mute);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sb-link:hover{background:var(--ice);transform:translateX(3px)}
.sb-link:hover .sb-tile{background:#fff}
.sb-link.on,.sb-link.on:hover{background:var(--grad);color:#fff;box-shadow:0 5px 0 var(--purple-d);transform:none}
.sb-link.on .sb-tile{background:rgba(255,255,255,.22);color:#fff}
.sb-link.on .sb-text small{color:rgba(255,255,255,.88)}
.sb-link:focus-visible,.sb-out:focus-visible,.sb-close:focus-visible,.sb-burger:focus-visible,.sb-logo:focus-visible,.sb-toggle:focus-visible{outline:3px solid var(--purple);outline-offset:3px}

/* Footer */
.sb-foot{margin-top:auto;display:grid;gap:14px}
.sb-note{
  display:flex;align-items:flex-start;gap:10px;margin:0 4px 0 2px;padding:12px 14px;background:#fff;
  border:2.5px solid var(--purple);border-radius:18px;box-shadow:4px 5px 0 var(--purple-d);transform:rotate(-1.5deg);
  font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:17px;line-height:1.15;color:var(--blue);
}
.sb-note svg{flex:none;margin-top:2px;fill:var(--purple)}
.sb-user{
  display:flex;align-items:center;gap:12px;background:#fff;border:2.5px solid var(--blue);border-radius:18px;
  padding:10px 12px;box-shadow:0 5px 0 var(--soft);
}
.sb-avatar{
  flex:none;width:42px;height:42px;border-radius:14px;display:grid;place-items:center;background:var(--grad);color:#fff;
  font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:20px;box-shadow:0 3px 0 var(--purple-d);
}
.sb-who{min-width:0}
.sb-who strong{display:block;font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:16px;font-weight:800;color:var(--blue);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sb-who small{display:block;margin-top:1px;font-size:12px;font-weight:600;line-height:1.35;color:var(--mute)}
.sb-out{
  display:flex;align-items:center;justify-content:center;gap:8px;width:100%;min-height:46px;
  font:inherit;font-weight:800;font-size:14.5px;color:var(--blue);background:#fff;border:2.5px solid var(--blue);
  border-radius:14px;cursor:pointer;box-shadow:0 4px 0 var(--soft);transition:transform .15s,box-shadow .15s;-webkit-tap-highlight-color:transparent;
}
.sb-out:hover{transform:translateY(-2px);box-shadow:0 6px 0 var(--soft)}
.sb-out:active{transform:translateY(3px);box-shadow:0 1px 0 var(--soft)}

/* Collapse toggle */
.sb-toggle{
  display:grid;place-items:center;flex:none;width:44px;height:44px;margin:2px auto 4px;padding:0;cursor:pointer;
  background:#fff;color:var(--blue);border:2.5px solid var(--blue);border-radius:14px;box-shadow:0 4px 0 var(--soft);
  transition:transform .15s,box-shadow .15s;-webkit-tap-highlight-color:transparent;
}
.sb-toggle:hover{transform:translateY(-2px);box-shadow:0 6px 0 var(--soft)}
.sb-toggle svg{transition:transform .2s}
.sb-root.collapsed .sb-toggle svg{transform:rotate(180deg)}

/* Collapsed sidebar: icons only, narrower width, content shifts along */
.sidebar-desktop.sb-root.collapsed{width:var(--sb-cw,72px)}
.sidebar-desktop.sb-root.collapsed .sb-label,
.sidebar-desktop.sb-root.collapsed .sb-text,
.sidebar-desktop.sb-root.collapsed .sb-note,
.sidebar-desktop.sb-root.collapsed .sb-who,
.sidebar-desktop.sb-root.collapsed .sb-out-t,
.sidebar-desktop.sb-root.collapsed .site-logo{display:none}
.sidebar-desktop.sb-root.collapsed .sb-mark{display:grid}
.sidebar-desktop.sb-root.collapsed .sb-logo{align-self:center;padding:0}
.sidebar-desktop.sb-root.collapsed .sb-nav{justify-items:center}
.sidebar-desktop.sb-root.collapsed .sb-link{grid-template-columns:44px;padding:0;background:transparent;box-shadow:none;transform:none}
.sidebar-desktop.sb-root.collapsed .sb-tile{width:44px;height:44px}
.sidebar-desktop.sb-root.collapsed .sb-link:hover .sb-tile{background:#fff;box-shadow:inset 0 0 0 2px var(--soft)}
.sidebar-desktop.sb-root.collapsed .sb-link.on,
.sidebar-desktop.sb-root.collapsed .sb-link.on:hover{background:transparent;box-shadow:none}
.sidebar-desktop.sb-root.collapsed .sb-link.on .sb-tile{background:var(--grad);color:#fff;box-shadow:0 4px 0 var(--purple-d)}
.sidebar-desktop.sb-root.collapsed .sb-user{justify-content:center;padding:0;background:transparent;border:0;box-shadow:none}
.sidebar-desktop.sb-root.collapsed .sb-out{width:44px;min-height:44px;margin:0 auto;padding:0}

/* Mobile top bar. Its display is left to your global CSS; an inner wrapper does the layout. */
.mobile-topbar.sb-top{
  background-color:#fff;
  background-image:radial-gradient(ellipse 150px 90px at 96% -40%, #EDE3EF 97%, transparent 100%);
  background-repeat:no-repeat;
  border-bottom:2.5px solid var(--blue);box-shadow:0 4px 0 var(--soft);color:var(--blue);
}
.sb-top-in{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%}
.sb-top .sb-logo{padding:0}
.sb-top .sb-burger,.sb-root .sb-close{
  display:grid;place-items:center;flex:none;width:46px;height:46px;padding:0;cursor:pointer;border-radius:14px;
  transition:transform .15s,box-shadow .15s;-webkit-tap-highlight-color:transparent;
}
.sb-top .sb-burger{background:var(--grad);color:#fff;border:0;box-shadow:0 5px 0 var(--purple-d)}
.sb-top .sb-burger:active{transform:translateY(4px);box-shadow:0 1px 0 var(--purple-d)}
.sb-root .sb-close{background:#fff;color:var(--blue);border:2.5px solid var(--blue);box-shadow:0 4px 0 var(--soft)}
.sb-root .sb-close:active{transform:translateY(3px);box-shadow:0 1px 0 var(--soft)}
.mobile-overlay.sb-overlay{background:rgba(0,40,79,.5);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px)}

/* Mobile drawer: no collapsed styling ever applies, and no offset shadow on the edge */
.sidebar-mobile.sb-root{box-shadow:6px 0 24px rgba(0,40,79,.25)}

/* Short screens: drop the note, then the hints, so everything fits */
@media(max-height:760px){
  .sb-note{display:none}
  .sb-in{gap:14px}
}
@media(max-height:620px){
  .sb-text small,.sb-who small{display:none}
  .sb-link{padding:6px 10px}
  .sb-in{gap:10px;padding-top:calc(12px + env(safe-area-inset-top,0px))}
}

/* Very narrow drawers */
@media(max-width:340px){
  .sb-in{padding-left:10px;padding-right:10px}
  .sb-link{gap:10px}
  .sb-text strong{font-size:14px}
}

@media(hover:none){
  .sb-link:hover{transform:none;background:transparent}
  .sb-link:hover .sb-tile{background:var(--ice)}
  .sb-link.on:hover{background:var(--grad)}
  .sb-out:hover,.sb-toggle:hover{transform:none}
}
@media(prefers-reduced-motion:reduce){
  .sb-root *,.sb-top *{transition:none!important}
}
`;