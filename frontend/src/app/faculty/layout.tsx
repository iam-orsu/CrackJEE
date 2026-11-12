import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Faculty Paper Generator',
  robots: { index: false, follow: false },
};

export default function FacultyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
