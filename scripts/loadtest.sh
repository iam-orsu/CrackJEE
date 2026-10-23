#!/bin/bash
# Runs scripts/loadtest.mjs in a Node container on the stack's host network, samples container CPU/RAM while
# it runs, then removes the test students. Usage: USERS=100 DURATION_S=60 ./scripts/loadtest.sh
set -u
cd "$(dirname "$0")/.." || exit 1
USERS="${USERS:-50}"
DURATION_S="${DURATION_S:-60}"
OUT="${OUT:-/tmp/loadtest}"
mkdir -p "$OUT"

# Sample container resource use every 2 s until the test ends
( while true; do
    docker stats --no-stream --format '{{.Name}} {{.CPUPerc}} {{.MemUsage}}' 2>/dev/null | grep jeeneet >> "$OUT/stats.txt"
    echo "--- $(date +%T)" >> "$OUT/stats.txt"
    sleep 2
  done ) &
SAMPLER=$!

docker run --rm --network host -e NODE_TLS_REJECT_UNAUTHORIZED=0 \
  -e BASE="${BASE:-https://localhost}" -e USERS="$USERS" -e DURATION_S="$DURATION_S" \
  -e RAMP_S="${RAMP_S:-0}" \
  -v "$PWD/scripts:/scripts:ro" node:22-alpine node /scripts/loadtest.mjs > "$OUT/result.json" 2> "$OUT/run.log"
RC=$?

kill "$SAMPLER" 2>/dev/null
wait "$SAMPLER" 2>/dev/null

# Remove the load-test students (and, through cascades, their attempts and mock rows)
docker compose --env-file .env exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -tA -q -c "DELETE FROM \"User\" WHERE email LIKE '"'"'lt-%@example.com'"'"';"' >/dev/null 2>&1

echo "exit=$RC result=$OUT/result.json stats=$OUT/stats.txt"
cat "$OUT/result.json"
