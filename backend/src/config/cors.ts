import type { CorsOptions } from 'cors';
import type { HelmetOptions } from 'helmet';

const PRIVATE_IP_RE = /^https?:\/\/(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)\d+\.\d+(:\d+)?$/;

export function buildCorsOptions(): CorsOptions {
  const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
  const allowedOrigins = new Set([
    frontendUrl,
    frontendUrl.startsWith('https://')
      ? frontendUrl.replace('https://', 'http://')
      : frontendUrl.replace('http://', 'https://'),
    'http://localhost',
    'https://localhost',
    'http://localhost:3000',
    'https://localhost:3000',
    'http://127.0.0.1',
    'https://127.0.0.1',
    'http://127.0.0.1:3000',
    'https://127.0.0.1:3000',
    ...(process.env.EXTRA_CORS_ORIGINS ?? '').split(',').map((s) => s.trim()).filter(Boolean),
  ]);

  return {
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.has(origin) || PRIVATE_IP_RE.test(origin)) {
        return cb(null, true);
      }
      cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: false,
  };
}

export const helmetOptions: HelmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'cdn.jsdelivr.net'],
      styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com', 'cdn.jsdelivr.net'],
      fontSrc: ["'self'", 'fonts.gstatic.com', 'cdn.jsdelivr.net'],
      imgSrc: ["'self'", 'data:'],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
};
