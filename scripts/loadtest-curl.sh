#!/bin/bash
# Load check with curl. Many throwaway students sign up at once, then each reads its dashboard, insights,
# leaderboard, mock history and weak areas. No mocks are started, so no AI credit is used.
# Creates the students, measures the results, then removes them.
# Usage: ./scripts/loadtest-curl.sh                       (uses https://localhost)
#        USERS=100 CONCURRENCY=20 BASE_URL=https://<server> ./scripts/loadtest-curl.sh
set -u

BASE="${BASE_URL:-https://localhost}"
USERS="${USERS:-50}"
CONCURRENCY="${CONCURRENCY:-10}"
RUN=$(date +%s)
PASSWORD='E2ETest12345!'
WORK=$(mktemp -d)

# One student: sign up, then read each page. Writes "path status seconds" lines to its own file.
one_student() {
  local n=$1
  local READS=(/api/v1/user/dashboard /api/v1/stats/mock-insights /api/v1/stats/leaderboard /api/v1/mock/history /api/v1/progress/weak-areas)
  local jar="$WORK/jar$n"
  local out="$WORK/res$n"
  local email="load.$RUN.$n@example.com"
  local body="{\"name\":\"Load $n\",\"email\":\"$email\",\"password\":\"$PASSWORD\",\"class\":\"12\",\"targetExam\":\"Main\",\"currentLevel\":\"beginner\"}"
  local code time
  read -r code time < <(curl -sk -m 120 -c "$jar" -b "$jar" -o /dev/null -w '%{http_code} %{time_total}' \
    -X POST "$BASE/api/v1/auth/register" -H 'Content-Type: application/json' --data "$body")
  echo "/api/v1/auth/register $code $time" >> "$out"
  for path in "${READS[@]}"; do
    read -r code time < <(curl -sk -m 120 -b "$jar" -o /dev/null -w '%{http_code} %{time_total}' "$BASE$path")
    echo "$path $code $time" >> "$out"
  done
}

export -f one_student
export BASE PASSWORD RUN WORK

echo "Load check against $BASE: $USERS students, $CONCURRENCY at a time"
START=$(date +%s)
seq 1 "$USERS" | xargs -P "$CONCURRENCY" -I{} bash -c 'one_student {}'
ELAPSED=$(( $(date +%s) - START ))

cat "$WORK"/res* > "$WORK/all.txt" 2>/dev/null
echo
echo "Results (requests per endpoint, status counts, latency in seconds)"
awk '
  { count[$1]++; code[$1" "$2]++; t[$1]=t[$1]" "$3 }
  END {
    for (p in count) {
      n = split(t[p], arr, " ")
      # sort latencies for percentiles
      for (i = 1; i <= n; i++) for (j = i + 1; j <= n; j++) if (arr[j] + 0 < arr[i] + 0) { x = arr[i]; arr[i] = arr[j]; arr[j] = x }
      p50 = arr[int(n * 0.5) + 1]; p95 = arr[int(n * 0.95) + 1]; mx = arr[n]
      printf "  %-32s requests=%-4d p50=%ss p95=%ss max=%ss\n", p, count[p], p50, p95, mx
    }
    print ""
    print "Status codes:"
    for (k in code) printf "  %-40s %d\n", k, code[k]
  }' "$WORK/all.txt"
echo
echo "Total time: ${ELAPSED}s"

# Remove the throwaway students
docker compose --env-file .env exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -tA' \
  <<<"DELETE FROM \"User\" WHERE email LIKE 'load.$RUN.%';" >/dev/null 2>&1
rm -rf "$WORK"
echo "Test students removed."
