/**
 * createFaculty.ts — CLI helper to create or update a faculty/mentor login.
 *
 * Usage:
 *   npm run faculty:create -- "Dr. Rao" rao@example.com StrongPass123!
 */
import { loadDotEnv } from '../config/env';
import { database } from '../config/database';
import { FacultyRepository } from '../repositories/FacultyRepository';
import { FacultyAuthService } from '../services/FacultyAuthService';

async function main(): Promise<void> {
  loadDotEnv();
  const [name, email, password] = process.argv.slice(2);
  if (!name || !email || !password || password.length < 8) {
    console.error('Usage: npm run faculty:create -- "<Name>" <email> <password (min 8 chars)>');
    process.exit(1);
  }

  await database.connect();
  try {
    const repo = new FacultyRepository();
    const auth = new FacultyAuthService(repo);
    const existing = await repo.findByEmail(email);
    if (existing) {
      const updated = await auth.updateAccount(existing.id, { name, password, isActive: true });
      console.log(`Updated existing faculty account: ${updated.email} (id=${updated.id})`);
    } else {
      const created = await auth.createAccount({ name, email, password });
      console.log(`Created faculty account: ${created.email} (id=${created.id})`);
    }
  } finally {
    await database.disconnect();
  }
}

main().catch((err) => {
  console.error('[faculty:create] Failed:', err instanceof Error ? err.message : err);
  process.exit(1);
});
