import { spawnSync } from 'child_process';
import { loadDotEnv } from '../config/env';

/** Runs Prisma CLI after loading `.env` from either `backend/` or the repository root. */
loadDotEnv();
const prismaEntrypoint = require.resolve('prisma/build/index.js');
const result = spawnSync(process.execPath, [prismaEntrypoint, ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: process.env,
});

process.exit(result.status ?? 1);
