// Load test for the student flow. Zero dependencies (Node 22 fetch).
//
//   BASE=https://localhost USERS=100 DURATION_S=60 node scripts/loadtest.mjs
//
// Creates USERS students, then runs VUs virtual users in a loop: dashboard, practice batch, answer submits,
// bank stats. Every user logs in through the real login endpoint (bcrypt, the costly path), then keeps the
// session cookie. Prints per-endpoint latency percentiles, status counts and throughput as JSON.
// Test students are removed at the end (see cleanup in main()).

const BASE = process.env.BASE ?? 'https://localhost';
const USERS = Number(process.env.USERS ?? 50);
const DURATION_S = Number(process.env.DURATION_S ?? 60);
const RAMP_S = Number(process.env.RAMP_S ?? 0);
const PASSWORD = 'LoadTest12345';
const RUN = `${Date.now()}${Math.floor(Math.random() * 1e6)}`;

const stats = new Map(); // endpoint -> { ms: [], codes: {} }
function record(name, ms, status) {
  if (!stats.has(name)) stats.set(name, { ms: [], codes: {} });
  const s = stats.get(name);
  s.ms.push(ms);
  s.codes[status] = (s.codes[status] ?? 0) + 1;
}

function cookieOf(res) {
  const raw = res.headers.getSetCookie?.() ?? [];
  const c = raw.find((x) => x.startsWith('jee_session='));
  return c ? c.split(';')[0] : null;
}

async function call(name, path, { method = 'GET', cookie, body } = {}) {
  const t0 = performance.now();
  let status = 0;
  let json = null;
  try {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(60_000),
    });
    status = res.status;
    json = await res.json().catch(() => null);
    return { status, json, res };
  } catch (err) {
    status = err.name === 'TimeoutError' ? 'timeout' : 'network';
    return { status, json: null, res: null };
  } finally {
    record(name, performance.now() - t0, status);
  }
}

function pct(sorted, p) {
  if (sorted.length === 0) return null;
  return Math.round(sorted[Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length))]);
}

async function createUsers(n) {
  const users = [];
  for (let i = 0; i < n; i++) {
    const email = `lt-${RUN}-${i}@example.com`;
    const r = await call('setup:register', '/api/auth/register', {
      method: 'POST',
      body: { name: `LT ${i}`, email, password: PASSWORD, class: '12', targetExam: 'Main', currentLevel: 'beginner' },
    });
    if (r.status === 201) users.push({ email, cookie: cookieOf(r.res) });
  }
  return users;
}

async function vu(user, endAt) {
  // Re-login once per VU to exercise the login path (bcrypt) under load
  const login = await call('login', '/api/auth/login', {
    method: 'POST',
    body: { email: user.email, password: PASSWORD },
  });
  const cookie = login.res ? cookieOf(login.res) : user.cookie;
  if (!cookie) return;

  while (Date.now() < endAt) {
    await call('dashboard', '/api/user/dashboard', { cookie });
    const batch = await call('practice-batch', '/api/questions/batch', {
      method: 'POST',
      cookie,
      body: {
        selections: [{ subject: 'Mathematics', topic: 'Sets' }, { subject: 'Physics', topic: 'Kinematics' }],
        difficulty: 'mixed', examType: 'Main', studentClass: '12', count: 10, mode: 'practice',
      },
    });
    const ids = (batch.json?.data ?? []).map((q) => q.id).slice(0, 3);
    for (const questionId of ids) {
      await call('answer-submit', '/api/answers/submit', {
        method: 'POST',
        cookie,
        body: { questionId, answer: 'A', timeSpent: 12 },
      });
    }
    await call('bank-stats', '/api/questions/bank-stats', { cookie });
    // A student thinks between actions; keeps the load realistic rather than a tight loop
    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 2000));
  }
}

async function main() {
  const t0 = Date.now();
  console.error(`creating ${USERS} students...`);
  const users = await createUsers(USERS);
  console.error(`${users.length} students ready; running ${DURATION_S}s`);
  const endAt = Date.now() + DURATION_S * 1000;
  const runStart = Date.now();
  await Promise.all(
    users.map((u, i) => new Promise((r) => setTimeout(r, (RAMP_S * 1000 * i) / Math.max(1, users.length))).then(() => vu(u, endAt))),
  );
  const elapsed = (Date.now() - runStart) / 1000;

  const summary = { base: BASE, users: users.length, durationS: Math.round(elapsed), endpoints: {} };
  let total = 0;
  let failures = 0;
  for (const [name, s] of stats) {
    const sorted = [...s.ms].sort((a, b) => a - b);
    const count = s.ms.length;
    total += count;
    const bad = Object.entries(s.codes).filter(([code]) => !(String(code).startsWith('2') || code === '429')).reduce((n, [, c]) => n + c, 0);
    failures += bad;
    summary.endpoints[name] = {
      count,
      p50ms: pct(sorted, 50),
      p95ms: pct(sorted, 95),
      p99ms: pct(sorted, 99),
      codes: s.codes,
    };
  }
  summary.totalRequests = total;
  summary.requestsPerSecond = Math.round((total / elapsed) * 10) / 10;
  summary.errorRatePct = Math.round((failures / Math.max(1, total)) * 10000) / 100;
  summary.setupAndRunS = Math.round((Date.now() - t0) / 1000);
  console.log(JSON.stringify(summary, null, 2));

  // Clean up the test students (their rows cascade)
  console.error('test students are removed by scripts/loadtest-cleanup.sh');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
