'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { getUser } from '@/lib/auth';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const user = getUser();
    if (user && user.isOnboarded === false) {
      router.replace('/onboarding');
    }
  }, [router, pathname]);

  // The exam and its result screens are immersive full-viewport experiences,
  // so they render without the app navigation.
  if (/^\/mock\/[^/]+/.test(pathname ?? '')) {
    return <>{children}</>;
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        {children}
      </main>
    </div>
  );
}