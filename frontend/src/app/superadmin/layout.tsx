import type { Metadata } from 'next';

// Keep the admin page out of search engines
export const metadata: Metadata = {
  title: 'JEENEET.ai Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
