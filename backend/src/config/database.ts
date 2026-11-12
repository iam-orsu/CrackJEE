import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

/**
 * Builds the effective MySQL connection URL, applying `connection_limit` from env when absent
 * so remote MySQL servers are never overwhelmed by multiple PM2 processes.
 */
function resolveDatabaseUrl(): string | undefined {
  const raw = process.env.DATABASE_URL;
  if (!raw) return undefined;
  try {
    const parsed = new URL(raw);
    if (!parsed.searchParams.has('connection_limit') && process.env.DB_CONNECTION_LIMIT) {
      parsed.searchParams.set('connection_limit', process.env.DB_CONNECTION_LIMIT);
    }
    return parsed.toString();
  } catch {
    return raw;
  }
}

export class Database {
  public readonly client: PrismaClient;

  constructor() {
    const datasourceUrl = resolveDatabaseUrl();
    this.client = new PrismaClient({
      ...(datasourceUrl ? { datasourceUrl } : {}),
      log: process.env.NODE_ENV === 'development'
        ? [{ emit: 'stdout', level: 'error' }, { emit: 'stdout', level: 'warn' }]
        : [{ emit: 'stdout', level: 'error' }],
    });
  }

  public async connect(): Promise<void> {
    await this.client.$connect();
    logger.info('Connected to MySQL');
  }

  public async disconnect(): Promise<void> {
    await this.client.$disconnect();
  }

  public async ping(): Promise<void> {
    await this.client.$queryRaw`SELECT 1`;
  }
}

export const database = new Database();
export const prisma = database.client;
