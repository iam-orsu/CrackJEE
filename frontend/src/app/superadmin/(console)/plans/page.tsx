'use client';

import styles from '@/app/superadmin/superadmin.module.css';
import { PlansPanel } from '@/components/superadmin/PlansPanel';
import { useSuperAdmin } from '@/components/superadmin/superadmin-context';

export default function SuperAdminPlansPage() {
  const { expire } = useSuperAdmin();

  return (
    <>
      <header className={styles.header}>
        <div>
          <p className={styles.title}>Plans and pricing</p>
          <p className={styles.sub}>Subscription tiers that appear on the public pricing page.</p>
        </div>
      </header>

      <PlansPanel onUnauthorized={expire} />
    </>
  );
}
