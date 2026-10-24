#!/bin/bash
# Multi-student reuse check. Run it on the server, from the project folder.
# Creates STUDENTS throwaway students (default 5). Each takes one medium JEE Main mock, answers 10 and submits.
# Then reports: how many questions each student got from earlier students' papers (reuse from the bank),
# how many questions the AI wrote, and whether any two students got the same paper. Each student also takes
# a second mock, checked for repeats against their first. Removes all the students at the end.
# Usage: ./scripts/e2e-multi.sh                    (5 students, https://localhost)
#        STUDENTS=8 BASE_URL=https://<server> ./scripts/e2e-multi.sh
# Note: new questions cost AI credit. Papers that reuse the bank cost little.
set -u

BASE="${BASE_URL:-https://localhost}"
STUDENTS="${STUDENTS:-5}"
PASSWORD='E2ETest12345!'
RUN=$(date +%s)
WORK=$(mktemp -d)
PASS=0
FAIL=0

pass() { PASS=$((PASS + 1)); echo "  PASS  $1"; }
fail() { FAIL=$((FAIL + 1)); echo "  FAIL  $1"; }

db() {
  docker compose --env-file .env exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -tA' <<<"$1" 2>/dev/null
}

api() {
  local method=$1 jar=$2 path=$3 data=${4:-}
  local args=(-sk -m 120 -X "$method" "$BASE$path" -b "$jar" -c "$jar" -H 'Content-Type: application/json' -o "$WORK/body" -w '%{http_code}')
  [ -n "$data" ] && args+=(--data "$data")
  STATUS=$(curl "${args[@]}")
  BODY=$(cat "$WORK/body" 2>/dev/null || true)
}

# Starts a medium mock for the student and waits for it. Sets NEW_EXAM.
mock_for() {
  local jar=$1 label=$2
  api POST "$jar" /api/mock/start '{"examType":"Main","difficultyMode":"medium"}'
  [ "$STATUS" = "200" ] || { fail "start $label (HTTP $STATUS)"; NEW_EXAM=""; return 1; }
  NEW_EXAM=$(echo "$BODY" | grep -o '"id":"[^"]*"' | head -n 1 | cut -d'"' -f4)
  local status="" waited=0
  while [ "$waited" -lt 1500 ]; do
    api GET "$jar" "/api/mock/$NEW_EXAM"
    status=$(echo "$BODY" | grep -o '"status":"[^"]*"' | head -n 1 | cut -d'"' -f4)
    if [ "$status" = "ready" ] || [ "$status" = "error" ]; then break; fi
    sleep 15
    waited=$((waited + 15))
  done
  [ "$status" = "ready" ] || { fail "paper not ready for $label (status: $status)"; NEW_EXAM=""; return 1; }
  return 0
}

# Ids of the questions in one exam, one per line
questions_of() {
  db "SELECT \"questionId\" FROM \"MockExamQuestion\" WHERE \"examId\" = '$1' ORDER BY \"questionNumber\";"
}

EMAILS=()
echo "Multi-student mock check against $BASE, $STUDENTS students"
BANK_BEFORE=$(db 'SELECT count(*) FROM "Question" WHERE "mockOnly" = true;')

# First mock for each student, one after another
for i in $(seq 1 "$STUDENTS"); do
  email="multi.$RUN.$i@example.com"
  jar="$WORK/jar$i"
  EMAILS+=("$email")
  api POST "$jar" /api/auth/register "{\"name\":\"Multi $i\",\"email\":\"$email\",\"password\":\"$PASSWORD\",\"class\":\"12\",\"targetExam\":\"Main\",\"currentLevel\":\"beginner\"}"
  [ "$STATUS" = "201" ] || { fail "register $i (HTTP $STATUS)"; continue; }
  if mock_for "$jar" "student $i"; then
    echo "$NEW_EXAM" > "$WORK/exam1_$i"
    questions_of "$NEW_EXAM" > "$WORK/q1_$i"
    count=$(wc -l < "$WORK/q1_$i" | tr -d ' ')
    [ "$count" = "75" ] && pass "student $i: first mock has 75 questions" || fail "student $i: $count questions"
    api POST "$jar" "/api/mock/$NEW_EXAM/begin"
    for id in $(db "SELECT id FROM \"MockExamQuestion\" WHERE \"examId\" = '$NEW_EXAM' ORDER BY \"questionNumber\" LIMIT 10;"); do
      api PATCH "$jar" "/api/mock/$NEW_EXAM/answer" "{\"mockQuestionId\":\"$id\",\"answer\":\"A\"}"
    done
    api POST "$jar" "/api/mock/$NEW_EXAM/submit" '{"questionTimes":{}}'
    [ "$STATUS" = "200" ] && pass "student $i: submitted" || fail "student $i: submit (HTTP $STATUS)"
  fi
done

BANK_AFTER=$(db 'SELECT count(*) FROM "Question" WHERE "mockOnly" = true;')
echo
echo "Reuse report"
echo "  new questions the AI wrote for these papers: $((BANK_AFTER - BANK_BEFORE))"
for i in $(seq 1 "$STUDENTS"); do
  [ -s "$WORK/q1_$i" ] || continue
  earlier=$(for j in $(seq 1 $((i - 1))); do [ -s "$WORK/q1_$j" ] && cat "$WORK/q1_$j"; done | sort -u)
  reused=0
  if [ -n "$earlier" ]; then
    reused=$(sort -u "$WORK/q1_$i" | comm -12 - <(echo "$earlier" | sort -u) | wc -l | tr -d ' ')
  fi
  echo "  student $i: $reused of 75 questions were also in an earlier student's paper"
done
for i in $(seq 1 "$STUDENTS"); do
  for j in $(seq $((i + 1)) "$STUDENTS"); do
    [ -s "$WORK/q1_$i" ] && [ -s "$WORK/q1_$j" ] || continue
    if [ "$(sort "$WORK/q1_$i")" = "$(sort "$WORK/q1_$j")" ]; then
      echo "  students $i and $j got the same 75 questions (same paper, in a different order)"
    fi
  done
done

# Second mock for each student: must not repeat the first
echo
echo "Second mock"
for i in $(seq 1 "$STUDENTS"); do
  [ -s "$WORK/exam1_$i" ] || continue
  jar="$WORK/jar$i"
  if mock_for "$jar" "student $i (second)"; then
    questions_of "$NEW_EXAM" > "$WORK/q2_$i"
    repeats=$(comm -12 <(sort "$WORK/q1_$i") <(sort "$WORK/q2_$i") | wc -l | tr -d ' ')
    [ "$repeats" = "0" ] && pass "student $i: second mock repeats none of the first" || fail "student $i: $repeats questions repeated"
  fi
done

# Remove all throwaway students
for email in "${EMAILS[@]}"; do
  db "DELETE FROM \"User\" WHERE email = '$email';" >/dev/null
done
rm -rf "$WORK"
echo
echo "$PASS passed, $FAIL failed (students removed)"
[ "$FAIL" -eq 0 ]
