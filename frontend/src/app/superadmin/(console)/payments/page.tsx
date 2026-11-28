'use client';

import styles from '@/app/superadmin/superadmin.module.css';
import { PaymentsPanel } from '@/components/superadmin/PaymentsPanel';
import { useSuperAdmin } from '@/components/superadmin/superadmin-context';

export default function SuperAdminPaymentsPage() {
  const { expire } = useSuperAdmin();

  return (
    <>
      <header className={styles.header}>
        <div>
          <p className={styles.title}>Payments</p>
          <p className={styles.sub}>Razorpay transactions from plan purchases.</p>
        </div>
      </header>

      <PaymentsPanel onUnauthorized={expire} />
    </>
  );
}
