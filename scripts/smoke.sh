#!/bin/bash
# Smoke test for a running stack. Creates one throwaway student and exercises the core flows.
# Usage: ./deploy.sh test      (or BASE_URL=http://localhost bash scripts/smoke.sh)
set -u

BASE="${BASE_URL:-https://localhost}"
CURL=(curl -sk -m 30)
FAILS=0
PASSES=0

pass() { PASSES=$((PASSES + 1)); echo "  PASS  $1"; }
fail() { FAILS=$((FAILS + 1)); echo "  FAIL  $1"; }

# Calls the API and stores the HTTP status in $STATUS and the body in $BODY
call() {
  local method=$1 path=$2 token=${3:-} data=${4:-}
  local args=(-X "$method" "$BASE$path" -H 'Content-Type: application/json' -o /tmp/smoke_body -w '%{http_code}')
  [ -n "$token" ] && args+=(-H "Authorization: Bearer $token")
  [ -n "$data" ] && args+=(--data "$data")
  STATUS=$("${CURL[@]}" "${args[@]}")
  BODY=$(cat /tmp/smoke_body 2>/dev/null || true)
}

json_field() { echo "$BODY" | grep -o "\"$1\":\"[^\"]*\"" | head -n 1 | cut -d'"' -f4; }

echo "Smoke test against $BASE"

# 1. Health: the backend's own health endpoint is internal (nginx does not route it), so ask the container
if docker compose --env-file .env exec -T backend wget -qO- http://127.0.0.1:3001/health >/dev/null 2>&1; then
  pass "backend health (one instance checked; compose health checks cover each replica)"
else
  fail "backend health"
fi

# 2. Register a fresh student
EMAIL="smoke-$(date +%s)-$RANDOM@example.com"
call POST /api/auth/register "" "{\"name\":\"Smoke Test\",\"email\":\"$EMAIL\",\"password\":\"SmokeTest123!\",\"class\":\"12\",\"targetExam\":\"Main\",\"currentLevel\":\"beginner\"}"
TOKEN=$(json_field token)
if [ "$STATUS" = "201" ] && [ -n "$TOKEN" ]; then pass "register"; else fail "register (HTTP $STATUS)"; fi

if [ -n "$TOKEN" ]; then
  # 3. Practice batch returns questions
  call POST /api/questions/batch "$TOKEN" '{"selections":[{"subject":"Mathematics","topic":"Sets"}],"difficulty":"mixed","examType":"Main","studentClass":"12","count":3,"mode":"practice"}'
  QID=$(json_field id)
  if [ "$STATUS" = "200" ] && [ -n "$QID" ]; then pass "practice batch returns questions"; else fail "practice batch (HTTP $STATUS)"; fi

  # 4. Answer submission records an attempt
  if [ -n "$QID" ]; then
    call POST /api/answers/submit "$TOKEN" "{\"questionId\":\"$QID\",\"answer\":\"A\",\"timeSpent\":10}"
    if [ "$STATUS" = "200" ]; then pass "answer submission"; else fail "answer submission (HTTP $STATUS)"; fi
  fi

  # 5. Analytics endpoints
  call GET /api/user/dashboard "$TOKEN"
  [ "$STATUS" = "200" ] && pass "dashboard" || fail "dashboard (HTTP $STATUS)"
  call GET /api/stats/leaderboard "$TOKEN"
  [ "$STATUS" = "200" ] && pass "leaderboard" || fail "leaderboard (HTTP $STATUS)"

  # 6. Malformed JSON is a client error, not a server error
  call POST /api/auth/login "" '{"email":'
  [ "$STATUS" = "400" ] && pass "malformed JSON returns 400" || fail "malformed JSON (HTTP $STATUS, expected 400)"
fi

# Remove the throwaway student this run created, so repeated runs don't pile up accounts in the database.
# The SQL goes in on stdin, so the email never needs shell quoting.
printf '%s' "DELETE FROM \"User\" WHERE email = '$EMAIL';" \
  | docker compose --env-file .env exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -q' >/dev/null 2>&1 \
  || echo "  WARN  could not remove the smoke test user $EMAIL"

rm -f /tmp/smoke_body
echo
echo "$PASSES passed, $FAILS failed"
[ "$FAILS" -eq 0 ]
