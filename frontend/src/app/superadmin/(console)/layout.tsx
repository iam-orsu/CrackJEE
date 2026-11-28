import type { Metadata } from 'next';
import { SuperAdminShell } from '@/components/superadmin/SuperAdminShell';

export const metadata: Metadata = {
  title: 'Platform Console · JEENEET.ai',
  robots: { index: false, follow: false },
};

export default function SuperAdminConsoleLayout({ children }: { children: React.ReactNode }) {
  return <SuperAdminShell>{children}</SuperAdminShell>;
}
