import fs from 'fs';
import path from 'path';
import { z } from 'zod';

/**
 * Loads `.env` values from the backend folder or repository root if not already set in `process.env`.
 * Avoids requiring an external dotenv dependency when running locally (`npm run dev`) or under PM2.
 */
export function loadDotEnv(): void {
  const candidates = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), '../.env'),
    path.resolve(__dirname, '../../../.env'),
    path.resolve(__dirname, '../../../../.env'),
  ];

  const seen = new Set<string>();
  for (const filePath of candidates) {
    const normalized = path.normalize(filePath);
    if (seen.has(normalized) || !fs.existsSync(normalized)) continue;
    seen.add(normalized);

    const content = fs.readFileSync(normalized, 'utf8');
    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;
      const eqIdx = line.indexOf('=');
      if (eqIdx <= 0) continue;

      const key = line.slice(0, eqIdx).trim();
      let val = line.slice(eqIdx + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }

      if (process.env[key] === undefined) {
        process.env[key] = val;
      }
    }
    break;
  }
}

const emptyToUndefined = (value: unknown): unknown =>
  typeof value === 'string' && value.trim() === '' ? undefined : value;

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3001),
  DATABASE_URL: z.string().startsWith('mysql://', {
    message: 'DATABASE_URL must be a mysql:// connection string',
  }),
  REDIS_URL: z.preprocess(
    emptyToUndefined,
    z.string().startsWith('redis://').optional(),
  ),
  JWT_SECRET: z.string().min(16),
  DEEPSEEK_API_KEY: z.preprocess(
    emptyToUndefined,
    z.string().min(8).optional(),
  ),
  DEEPSEEK_CONCURRENCY: z.coerce.number().int().min(1).max(50).default(6),
  DB_CONNECTION_LIMIT: z.coerce.number().int().min(1).max(100).default(10),
  DB_FANOUT_CONCURRENCY: z.coerce.number().int().min(1).max(50).default(5),
  FRONTEND_URL: z.preprocess(emptyToUndefined, z.string().url().optional()),
  EXTRA_CORS_ORIGINS: z.string().optional(),
  COOKIE_SECURE: z.preprocess(emptyToUndefined, z.enum(['true', 'false']).optional()),
  SUPERADMIN_EMAIL: z.string().optional(),
  SUPERADMIN_PASSWORD_HASH: z.string().optional(),
  SUPERADMIN_PASSWORD: z.string().optional(),
});

export type AppEnv = z.infer<typeof envSchema>;

let cachedEnv: AppEnv | null = null;

/** Validates and returns process environment configuration once at startup. */
export function getEnv(): AppEnv {
  if (cachedEnv) return cachedEnv;
  loadDotEnv();
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(
      `Invalid environment configuration: ${parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ')}`,
    );
  }
  cachedEnv = parsed.data;
  return cachedEnv;
}

/**
 * Determines whether auth cookies should set the `Secure` attribute.
 * Defaults to `true` in production (HTTPS behind Nginx) and `false` in local HTTP development.
 */
export function isCookieSecure(nodeEnv = process.env.NODE_ENV, override = process.env.COOKIE_SECURE): boolean {
  if (override === 'true') return true;
  if (override === 'false') return false;
  return nodeEnv === 'production';
}
