import type { NextConfig } from 'next';

const config: NextConfig = {
  images: {
    unoptimized: false,
    remotePatterns: [
      // Google profile pictures for faculty avatars (lh3.googleusercontent.com).
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: '*.googleusercontent.com' },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.BACKEND_URL ?? 'http://127.0.0.1:3001'}/api/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/student-portal',
        destination: '/student',
        permanent: true,
      },
      {
        source: '/student-portal/:path*',
        destination: '/student/:path*',
        permanent: true,
      },
    ];
  },
};

export default config;
