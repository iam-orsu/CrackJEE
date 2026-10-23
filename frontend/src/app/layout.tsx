import type { Metadata, Viewport } from 'next';
import './globals.css';
import 'katex/dist/katex.min.css';

export const metadata: Metadata = {
  title: 'JEENEET.ai: JEE & NEET preparation powered by Deep Tech',
  description:
    'Practice JEE Main & Advanced with questions crafted fresh by our Deep Tech engine. Track weak areas. Score higher.',
  keywords: ['JEE', 'JEE Main', 'JEE Advanced', 'IIT preparation', 'Deep Tech tutor', 'practice questions'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
