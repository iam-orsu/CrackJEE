#!/bin/sh
# One-shot database job: apply migrations, then seed the question banks, then exit.
# Runs as its own compose service (`migrate`) before the backend starts, so backend replicas
# never race each other on migrations or seeding.
set -e

# ── Migrations ────────────────────────────────────────────────────────────────
set +e
MIGRATE_OUT=$(node_modules/.bin/prisma migrate deploy 2>&1)
MIGRATE_RC=$?
set -e
echo "$MIGRATE_OUT"

if [ "$MIGRATE_RC" -ne 0 ]; then
  if echo "$MIGRATE_OUT" | grep -q 'P3005'; then
    # Database was created with `prisma db push`: mark the baseline migrations as applied, then retry
    echo '[migrate] Baseline: marking migrations as applied...'
    node_modules/.bin/prisma migrate resolve --applied 20241001000000_init || true
    node_modules/.bin/prisma migrate resolve --applied 20241002000000_add_partial_count || true
    node_modules/.bin/prisma migrate resolve --applied 20241003000000_add_neet_score || true
    node_modules/.bin/prisma migrate deploy
  else
    # Previously this failure was ignored and the backend started against an unknown schema.
    # Stop here instead, so the backend never starts on a schema it doesn't understand.
    echo '[migrate] FAILED — not starting the backend against an unknown schema' >&2
    exit 1
  fi
fi

# ── Seeding (failures warn and continue, as before) ───────────────────────────
node dist/scripts/seedQuestions.js /app/data/jee/jee_master_questions.json \
  || echo '[warn] JEE seeding failed — continuing with existing data'

if [ -f /app/data/neet/neet_master_questions.json ]; then
  node dist/scripts/seedQuestions.js /app/data/neet/neet_master_questions.json \
    || echo '[warn] NEET seeding failed'
else
  echo '[info] NEET question bank not present — skipping'
fi

echo '[migrate] done'
