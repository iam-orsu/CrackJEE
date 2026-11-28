'use client';

import type { ReactNode } from 'react';
import { SuperAdminSidebar } from './SuperAdminSidebar';
import { SuperAdminProvider, useSuperAdmin } from './superadmin-context';
import styles from '@/app/superadmin/superadmin.module.css';

function ConsoleFrame({ children }: { children: ReactNode }) {
  const { stats, loading, error, reload } = useSuperAdmin();

  if (loading) {
    return (
      <div className={styles.console}>
        <div className={styles.consoleMain}>
          <div className={styles.page}>
            <p className={styles.sub}>Checking your admin session…</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={styles.console}>
        <div className={styles.consoleMain}>
          <div className={styles.page}>
            <div className={styles.error}>{error || 'The console is unavailable right now.'}</div>
            <button className={styles.btn} onClick={reload}>Try again</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.console}>
      <SuperAdminSidebar />
      <div className={styles.consoleMain}>
        <div className={styles.page}>{children}</div>
      </div>
    </div>
  );
}

export function SuperAdminShell({ children }: { children: ReactNode }) {
  return (
    <SuperAdminProvider>
      <ConsoleFrame>{children}</ConsoleFrame>
    </SuperAdminProvider>
  );
}
