#!/bin/bash
# End-to-end mock check for a running stack. Run it on the server, from the project folder.
# For two throwaway students: a first mock (answer 10, submit, check result and explanation), then a
# second mock. Checks that the second mock repeats no question from the first, and shares at most two
# topics per subject with it (the weak topic, plus at most one wrap-around topic). Then removes both students.
# Usage: ./scripts/e2e-mock.sh            (uses https://localhost)
#        BASE_URL=https://<server> ./scripts/e2e-mock.sh
# Note: each new paper calls DeepSeek, so a run uses some AI credit.
set -u

BASE="${BASE_URL:-https://localhost}"
CURL=(curl -sk -m 60)
PASS=0
FAIL=0
RUN=$(date +%s)
PASSWORD='E2ETest12345!'
EMAIL_A="e2e.a.$RUN@example.com"
EMAIL_B="e2e.b.$RUN@example.com"
JAR_A=$(mktemp)
JAR_B=$(mktemp)

pass() { PASS=$((PASS + 1)); echo "  PASS  $1"; }
fail() { FAIL=$((FAIL + 1)); echo "  FAIL  $1"; }

# Runs SQL inside the postgres container and prints the result without headers
db() {
  docker compose --env-file .env exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -tA' <<<"$1" 2>/dev/null
}

# Calls the API with a cookie jar. Sets STATUS and BODY.
api() {
  local method=$1 jar=$2 path=$3 data=${4:-}
  local args=(-X "$method" "$BASE$path" -b "$jar" -c "$jar" -H 'Content-Type: application/json' -o /tmp/e2e_body -w '%{http_code}')
  [ -n "$data" ] && args+=(--data "$data")
  STATUS=$("${CURL[@]}" "${args[@]}")
  BODY=$(cat /tmp/e2e_body 2>/dev/null || true)
}

# Starts a medium JEE Main mock and waits for its paper. Sets NEW_EXAM_ID. Returns 1 if the paper fails.
start_and_wait() {
  local label=$1 jar=$2
  api POST "$jar" /api/mock/start '{"examType":"Main","difficultyMode":"medium"}'
  [ "$STATUS" = "200" ] || { fail "start mock $label (HTTP $STATUS)"; return 1; }
  NEW_EXAM_ID=$(echo "$BODY" | grep -o '"id":"[^"]*"' | head -n 1 | cut -d'"' -f4)

  # Paper generation can take several minutes on a new bank
  local status="" waited=0
  while [ "$waited" -lt 1500 ]; do
    api GET "$jar" "/api/mock/$NEW_EXAM_ID"
    status=$(echo "$BODY" | grep -o '"status":"[^"]*"' | head -n 1 | cut -d'"' -f4)
    if [ "$status" = "ready" ] || [ "$status" = "error" ]; then break; fi
    echo "  waiting for paper $label: status $status (${waited}s so far, a new paper can take several minutes)"
    sleep 15
    waited=$((waited + 15))
  done
  [ "$status" = "ready" ] || { fail "paper not ready $label (status: $status)"; return 1; }
  return 0
}

# Registers a student and runs the first mock: 10 answers, submit, result and explanation checks.
first_mock() {
  local label=$1 email=$2 jar=$3
  echo "Student $label, first mock"

  api POST "$jar" /api/auth/register "{\"name\":\"E2E $label\",\"email\":\"$email\",\"password\":\"$PASSWORD\",\"class\":\"12\",\"targetExam\":\"Main\",\"currentLevel\":\"beginner\"}"
  [ "$STATUS" = "201" ] && pass "register $label" || { fail "register $label (HTTP $STATUS)"; return 1; }

  start_and_wait "$label" "$jar" || return 1
  pass "paper ready $label"
  local exam=$NEW_EXAM_ID

  local count
  count=$(db "SELECT count(*) FROM \"MockExamQuestion\" WHERE \"examId\" = '$exam';")
  [ "$count" = "75" ] && pass "75 questions $label" || fail "question count $label is $count, expected 75"

  api POST "$jar" "/api/mock/$exam/begin"
  local ids
  ids=$(db "SELECT id FROM \"MockExamQuestion\" WHERE \"examId\" = '$exam' ORDER BY \"questionNumber\" LIMIT 10;")
  for id in $ids; do
    api PATCH "$jar" "/api/mock/$exam/answer" "{\"mockQuestionId\":\"$id\",\"answer\":\"A\"}"
  done
  api POST "$jar" "/api/mock/$exam/submit" '{"questionTimes":{}}'
  [ "$STATUS" = "200" ] && pass "submit $label" || fail "submit $label (HTTP $STATUS)"

  api GET "$jar" "/api/mock/$exam/result"
  echo "$BODY" | grep -q '"totalScore"' && pass "result page data $label" || fail "result data $label (HTTP $STATUS)"

  local first
  first=$(db "SELECT id FROM \"MockExamQuestion\" WHERE \"examId\" = '$exam' ORDER BY \"questionNumber\" LIMIT 1;")
  api POST "$jar" "/api/mock/$exam/questions/$first/explanation"
  echo "$BODY" | grep -q '"explanation"' && pass "explanation $label" || fail "explanation $label (HTTP $STATUS)"

  FIRST_EXAM[$label]=$exam
}

# Runs a second mock and compares it with the first: no repeated questions, at most two shared topics per subject.
second_mock() {
  local label=$1 jar=$2 first=$3
  echo "Student $label, second mock"

  start_and_wait "$label" "$jar" || return 1
  local second=$NEW_EXAM_ID

  local count
  count=$(db "SELECT count(*) FROM \"MockExamQuestion\" WHERE \"examId\" = '$second';")
  [ "$count" = "75" ] && pass "75 questions in second mock $label" || fail "second mock $label has $count questions, expected 75"

  local repeats
  repeats=$(db "SELECT count(*) FROM \"MockExamQuestion\" a JOIN \"MockExamQuestion\" b ON b.\"questionId\" = a.\"questionId\" WHERE a.\"examId\" = '$first' AND b.\"examId\" = '$second';")
  [ "$repeats" = "0" ] && pass "no question repeated from the first mock ($label)" || fail "$repeats questions repeated from the first mock ($label)"

  local worst
  worst=$(db "SELECT COALESCE(max(n), 0) FROM (SELECT count(DISTINCT a.topic) AS n FROM (SELECT DISTINCT mq.subject, q.topic FROM \"MockExamQuestion\" mq JOIN \"Question\" q ON q.id = mq.\"questionId\" WHERE mq.\"examId\" = '$first') a JOIN (SELECT DISTINCT mq.subject, q.topic FROM \"MockExamQuestion\" mq JOIN \"Question\" q ON q.id = mq.\"questionId\" WHERE mq.\"examId\" = '$second') b ON b.subject = a.subject AND b.topic = a.topic GROUP BY a.subject) s;")
  [ "${worst:-0}" -le 2 ] 2>/dev/null && pass "topics shared with the first mock: at most $worst per subject ($label)" || fail "$worst topics shared in one subject ($label), expected at most 2"
}

declare -A FIRST_EXAM
echo "End-to-end mock check against $BASE"
first_mock A "$EMAIL_A" "$JAR_A" || true
first_mock B "$EMAIL_B" "$JAR_B" || true

[ -n "${FIRST_EXAM[A]:-}" ] && second_mock A "$JAR_A" "${FIRST_EXAM[A]}" || true
[ -n "${FIRST_EXAM[B]:-}" ] && second_mock B "$JAR_B" "${FIRST_EXAM[B]}" || true

# Remove both throwaway students and their mocks
db "DELETE FROM \"User\" WHERE email IN ('$EMAIL_A', '$EMAIL_B');" >/dev/null
rm -f "$JAR_A" "$JAR_B" /tmp/e2e_body
echo
echo "$PASS passed, $FAIL failed (test students removed)"
[ "$FAIL" -eq 0 ]
