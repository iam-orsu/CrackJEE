'use client';

import styles from '@/app/superadmin/superadmin.module.css';
import { FacultyAccountsPanel } from '@/components/superadmin/FacultyAccountsPanel';
import { useSuperAdmin } from '@/components/superadmin/superadmin-context';

export default function SuperAdminFacultyPage() {
  const { expire } = useSuperAdmin();

  return (
    <>
      <header className={styles.header}>
        <div>
          <p className={styles.title}>Faculty accounts</p>
          <p className={styles.sub}>Mentors sign in with Google using the email you create here.</p>
        </div>
      </header>

      <FacultyAccountsPanel onUnauthorized={expire} />
    </>
  );
}
