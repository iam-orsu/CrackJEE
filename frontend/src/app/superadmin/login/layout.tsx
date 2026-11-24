import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign in · JEENEET.ai Platform Console',
  robots: { index: false, follow: false },
};

export default function SuperAdminLoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
