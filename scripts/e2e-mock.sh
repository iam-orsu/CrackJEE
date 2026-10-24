#!/bin/bash
# End-to-end mock check for a running stack. Run it on the server, from the project folder.
# Creates two throwaway students, runs one JEE Main mock for each, submits 10 answers each, checks the
# result and one explanation, compares the two papers, then removes both students.
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

# Registers a student, starts a medium mock, waits for the paper, answers 10, submits. Sets EXAM_ID.
run_student() {
  local label=$1 email=$2 jar=$3
  echo "Student $label"

  api POST "$jar" /api/auth/register "{\"name\":\"E2E $label\",\"email\":\"$email\",\"password\":\"$PASSWORD\",\"class\":\"12\",\"targetExam\":\"Main\",\"currentLevel\":\"beginner\"}"
  [ "$STATUS" = "201" ] && pass "register $label" || { fail "register $label (HTTP $STATUS)"; return 1; }

  api POST "$jar" /api/mock/start '{"examType":"Main","difficultyMode":"medium"}'
  [ "$STATUS" = "200" ] && pass "start mock $label" || { fail "start mock $label (HTTP $STATUS)"; return 1; }
  EXAM_ID=$(echo "$BODY" | grep -o '"id":"[^"]*"' | head -n 1 | cut -d'"' -f4)

  # Paper generation can take several minutes on a new bank
  local status="" waited=0
  while [ "$waited" -lt 1500 ]; do
    api GET "$jar" "/api/mock/$EXAM_ID"
    status=$(echo "$BODY" | grep -o '"status":"[^"]*"' | head -n 1 | cut -d'"' -f4)
    if [ "$status" = "ready" ] || [ "$status" = "error" ]; then break; fi
    echo "  waiting for paper $label: status $status (${waited}s so far, a new paper can take several minutes)"
    sleep 15
    waited=$((waited + 15))
  done
  [ "$status" = "ready" ] && pass "paper ready $label" || { fail "paper not ready $label (status: $status)"; return 1; }

  local count
  count=$(db "SELECT count(*) FROM \"MockExamQuestion\" WHERE \"examId\" = '$EXAM_ID';")
  [ "$count" = "75" ] && pass "75 questions $label" || fail "question count $label is $count, expected 75"

  api POST "$jar" "/api/mock/$EXAM_ID/begin"
  local ids
  ids=$(db "SELECT id FROM \"MockExamQuestion\" WHERE \"examId\" = '$EXAM_ID' ORDER BY \"questionNumber\" LIMIT 10;")
  for id in $ids; do
    api PATCH "$jar" "/api/mock/$EXAM_ID/answer" "{\"mockQuestionId\":\"$id\",\"answer\":\"A\"}"
  done
  api POST "$jar" "/api/mock/$EXAM_ID/submit" '{"questionTimes":{}}'
  [ "$STATUS" = "200" ] && pass "submit $label" || fail "submit $label (HTTP $STATUS)"

  api GET "$jar" "/api/mock/$EXAM_ID/result"
  echo "$BODY" | grep -q '"totalScore"' && pass "result page data $label" || fail "result data $label (HTTP $STATUS)"

  local first
  first=$(db "SELECT id FROM \"MockExamQuestion\" WHERE \"examId\" = '$EXAM_ID' ORDER BY \"questionNumber\" LIMIT 1;")
  api POST "$jar" "/api/mock/$EXAM_ID/questions/$first/explanation"
  echo "$BODY" | grep -q '"explanation"' && pass "explanation $label" || fail "explanation $label (HTTP $STATUS)"
}

echo "End-to-end mock check against $BASE"
run_student A "$EMAIL_A" "$JAR_A" || true
run_student B "$EMAIL_B" "$JAR_B" || true

# Cross-check the two papers
if [ -n "${EXAM_ID:-}" ]; then
  echo "Cross-check"
  for email in "$EMAIL_A" "$EMAIL_B"; do
    subj=$(db "SELECT mq.subject || ' ' || count(*) || ' questions, ' || count(DISTINCT q.topic) || ' topics' FROM \"MockExamQuestion\" mq JOIN \"Question\" q ON q.id = mq.\"questionId\" JOIN \"MockExam\" me ON me.id = mq.\"examId\" JOIN \"User\" u ON u.id = me.\"userId\" WHERE u.email = '$email' GROUP BY mq.subject ORDER BY mq.subject;")
    echo "  $email"
    echo "$subj" | sed 's/^/    /'
  done
  shared=$(db "SELECT count(*) FROM \"MockExamQuestion\" a JOIN \"MockExam\" ea ON ea.id = a.\"examId\" JOIN \"User\" ua ON ua.id = ea.\"userId\" JOIN \"MockExamQuestion\" b ON b.\"questionId\" = a.\"questionId\" JOIN \"MockExam\" eb ON eb.id = b.\"examId\" JOIN \"User\" ub ON ub.id = eb.\"userId\" WHERE ua.email = '$EMAIL_A' AND ub.email = '$EMAIL_B';")
  echo "  questions shared between the two papers: $shared (expected: some, from the bank)"
  [ "$shared" -gt 0 ] 2>/dev/null && pass "shared questions are reused from the bank" || echo "  NOTE  no shared questions: the bank was empty for these topics"
fi

# Remove both throwaway students and their mocks
db "DELETE FROM \"User\" WHERE email IN ('$EMAIL_A', '$EMAIL_B');" >/dev/null
rm -f "$JAR_A" "$JAR_B" /tmp/e2e_body
echo
echo "$PASS passed, $FAIL failed (test students removed)"
[ "$FAIL" -eq 0 ]
