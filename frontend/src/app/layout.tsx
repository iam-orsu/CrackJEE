import type { Metadata, Viewport } from 'next';
import './globals.css';
import 'katex/dist/katex.min.css';

export const metadata: Metadata = {
  title: 'JEENEET.ai: JEE & NEET preparation powered by Deep Tech',
  description:
    'Practice JEE Main & Advanced with questions crafted fresh by our Deep Tech engine. Track weak areas. Score higher.',
  keywords: [
    'JEE',
    'JEE Main',
    'JEE Advanced',
    'IIT preparation',
    'Deep Tech tutor',
    'practice questions',
    'JEE Main mock test online',
    'JEE Advanced practice test',
    'JEE online test series',
    'JEE Main previous year questions',
    'JEE Main score predictor',
    'JEE percentile predictor',
    'JEE rank predictor',
    'NEET mock test online',
    'NEET UG online test series',
    'NEET practice questions',
    'NEET previous year question papers',
    'NEET score predictor',
    'NEET marks predictor',
    'NEET rank predictor',
    'NEET full-length mock test',
    'Physics practice test',
    'Chemistry practice test',
    'Mathematics practice test',
    'Biology practice test',
    'online exam preparation for JEE and NEET',
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
