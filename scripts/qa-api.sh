#!/bin/bash
# Full API QA against the running stack (through nginx, HTTPS). Run after ./deploy.sh start:
#   ./deploy.sh qa        (or: bash scripts/qa-api.sh)
# Creates its own test students and mock exam rows, and deletes them at the end.
cd "$(dirname "$0")/.." || exit 1
B="${BASE_URL:-https://localhost}"
C="curl -sk -m 40"
PASS=0; FAIL=0
ok()  { PASS=$((PASS+1)); echo "PASS  $1"; }
bad() { FAIL=$((FAIL+1)); echo "FAIL  $1  :: $2"; }
field() { grep -o "\"$1\":\"[^\"]*\"" | head -n1 | cut -d'"' -f4; }
psqlq() { docker compose --env-file .env exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -tA -q'; }

echo "== transport =="
code=$(curl -s -o /dev/null -w '%{http_code}' -m 20 http://localhost/api/auth/me)
loc=$(curl -s -o /dev/null -w '%{redirect_url}' -m 20 http://localhost/api/auth/me)
[ "$code" = "301" ] && [[ "$loc" == https://localhost/* ]] && ok "http->https redirect" || bad "http redirect" "$code $loc"
[ "$($C -I $B/ | grep -ci '^content-security-policy')" -ge 1 ] && ok "CSP header" || bad "CSP header" "missing"
[ "$($C $B/metrics | grep -c process_uptime)" = "0" ] && ok "/metrics not public" || bad "/metrics" "exposed"

echo "== auth (HttpOnly session cookie) =="
JAR=$(mktemp); JAR2=$(mktemp)
tokjar() { awk '$6=="jee_session"{print $7}' "$1" | tail -n1; }
EMAIL="qa-$(date +%s)-$RANDOM@example.com"
reg=$($C -c "$JAR" -X POST $B/api/auth/register -H 'Content-Type: application/json' \
  -d "{\"name\":\"QA User\",\"email\":\"$EMAIL\",\"password\":\"QaPassword123\",\"class\":\"12\",\"targetExam\":\"Main\",\"currentLevel\":\"beginner\"}")
echo "$reg" | grep -q '"token"' && bad "token must not be in the response body" "$reg" || ok "register body has no token"
grep -q '#HttpOnly_' "$JAR" && ok "session cookie is HttpOnly" || bad "cookie not HttpOnly" "$(cat "$JAR")"
grep -q 'jee_session' "$JAR" && ok "register sets the session cookie" || bad "no session cookie" ""
[ "$($C -b "$JAR" -o /dev/null -w '%{http_code}' $B/api/auth/me)" = "200" ] && ok "me 200 with cookie" || bad "me with cookie" ""
T1=$(tokjar "$JAR")
[ "$($C -o /dev/null -w '%{http_code}' $B/api/auth/me -H "Authorization: Bearer $T1")" = "200" ] && ok "me 200 with Bearer (scripts)" || bad "me bearer" ""
$C -b "$JAR" -c "$JAR" -X POST $B/api/auth/logout | grep -q '"success":true' && ok "logout" || bad "logout" ""
[ "$($C -b "$JAR" -o /dev/null -w '%{http_code}' $B/api/auth/me)" = "401" ] && ok "revoked cookie rejected" || bad "revocation" ""
[ "$($C -o /dev/null -w '%{http_code}' $B/api/auth/me -H "Authorization: Bearer $T1")" = "401" ] && ok "revoked Bearer rejected" || bad "revoked bearer" ""
login=$($C -c "$JAR2" -X POST $B/api/auth/login -H 'Content-Type: application/json' -d "{\"email\":\"$EMAIL\",\"password\":\"QaPassword123\"}")
echo "$login" | grep -q '"expiresAt"' && ok "login returns expiresAt" || bad "login body" "$login"
T2=$(tokjar "$JAR2"); [ -n "$T2" ] && ok "login after logout" || bad "login" ""
REF=$($C -b "$JAR2" -c "$JAR2" -X POST $B/api/auth/refresh | grep -c expiresAt)
[ "$REF" -ge 1 ] && [ "$($C -b "$JAR2" -o /dev/null -w '%{http_code}' $B/api/auth/me)" = "200" ] && ok "refresh via cookie" || bad "refresh" ""
[ "$($C -o /dev/null -w '%{http_code}' -X POST $B/api/auth/login -H 'Content-Type: application/json' -d "{\"email\":\"$EMAIL\",\"password\":\"wrongpassword\"}")" = "401" ] && ok "wrong password 401" || bad "wrong password" ""

echo "== admin token must not act as a student =="
ADMIN_TOKEN=$(docker compose --env-file .env exec -T backend node -e "const jwt=require('jsonwebtoken');console.log(jwt.sign({role:'admin'},process.env.JWT_SECRET,{algorithm:'HS256',expiresIn:'1h'}))")
[ "$($C -o /dev/null -w '%{http_code}' $B/api/questions/topics -H "Authorization: Bearer $ADMIN_TOKEN")" = "401" ] && ok "admin token -> 401 on student route" || bad "admin token" ""
[ "$($C -o /dev/null -w '%{http_code}' $B/api/auth/me -H "Cookie: jee_admin=$ADMIN_TOKEN")" = "401" ] && ok "admin cookie -> 401 on student route" || bad "admin cookie on student route" ""
[ "$($C -o /dev/null -w '%{http_code}' $B/api/admin/stats)" = "401" ] && ok "admin stats requires an admin session" || bad "admin stats anonymous" ""
[ "$($C -o /dev/null -w '%{http_code}' $B/api/admin/stats -H "Cookie: jee_session=$T2")" = "401" ] && ok "student cookie -> 401 on admin route" || bad "student cookie on admin route" ""
[ "$($C -o /dev/null -w '%{http_code}' -X POST $B/api/admin/logout)" = "200" ] && ok "admin logout endpoint" || bad "admin logout" ""

echo "== practice =="
batch=$($C -X POST $B/api/questions/batch -H "Authorization: Bearer $T2" -H 'Content-Type: application/json' \
  -d '{"selections":[{"subject":"Mathematics","topic":"Sets"}],"difficulty":"mixed","examType":"Main","studentClass":"12","count":3,"mode":"practice"}')
QID=$(echo "$batch" | field id)
[ -n "$QID" ] && ok "practice batch" || bad "practice batch" "$batch"
echo "$batch" | grep -q '"answer"' && bad "answer key leaked in batch" "" || ok "no answer key in batch"
$C -X POST $B/api/answers/submit -H "Authorization: Bearer $T2" -H 'Content-Type: application/json' \
  -d "{\"questionId\":\"$QID\",\"answer\":\"A\",\"timeSpent\":5}" | grep -q '"correctAnswer"' && ok "answer submit" || bad "answer submit" ""
[ "$($C -o /dev/null -w '%{http_code}' -X POST $B/api/answers/submit -H "Authorization: Bearer $T2" -H 'Content-Type: application/json' -d '{"questionId":"does_not_exist_1","answer":"A","timeSpent":5}')" = "404" ] && ok "unknown question 404" || bad "unknown question" ""

echo "== mock: persistence, deadline, double submit (DB-seeded exam, no DeepSeek) =="
UID2=$(echo "SELECT id FROM \"User\" WHERE email='$EMAIL';" | psqlq | head -n1)
S=$RANDOM$RANDOM; MQ_QID="qa_mockq_$S"; EXAM="qa_exam_$S"; MQID="qa_mq_$S"
psqlq <<SQL >/dev/null
INSERT INTO "Question" (id,topic,subject,"questionText",options,answer,explanation,difficulty,"examType","questionType","validatedAt","mockOnly")
SELECT '$MQ_QID', topic, subject, "questionText", options, 'B', explanation, difficulty, 'Main', 'mcq_single', now(), true
FROM "Question" WHERE "questionType"='mcq_single' AND "examType"='Main' AND "validatedAt" IS NOT NULL LIMIT 1;
INSERT INTO "MockExam" (id,"userId","examType","difficultyMode",status,"durationSeconds","startedAt","createdAt")
VALUES ('$EXAM','$UID2','Main','medium','in_progress',10800, now(), now());
INSERT INTO "MockExamQuestion" (id,"examId","questionId",subject,"questionNumber","subjectIndex")
VALUES ('$MQID','$EXAM','$MQ_QID','Physics',1,0);
SQL
$C $B/api/mock/$EXAM -H "Authorization: Bearer $T2" | grep -q '"status":"in_progress"' && ok "mock loads" || bad "mock load" ""
[ "$($C -o /dev/null -w '%{http_code}' -X PATCH $B/api/mock/$EXAM/answer -H "Authorization: Bearer $T2" -H 'Content-Type: application/json' -d "{\"mockQuestionId\":\"$MQID\",\"answer\":\"C\"}")" = "200" ] && ok "answer saved in time" || bad "save in time" ""
[ "$($C $B/api/mock/$EXAM -H "Authorization: Bearer $T2" | grep -o '"savedAnswer":"[^"]*"' | cut -d'"' -f4)" = "C" ] && ok "answer persisted" || bad "persist" ""
psqlq <<SQL >/dev/null
UPDATE "MockExam" SET "startedAt" = now() - interval '5 hours' WHERE id='$EXAM';
SQL
$C -X PATCH $B/api/mock/$EXAM/answer -H "Authorization: Bearer $T2" -H 'Content-Type: application/json' -d "{\"mockQuestionId\":\"$MQID\",\"answer\":\"D\"}" | grep -q 'Time is up' && ok "answer after deadline rejected" || bad "deadline" ""
[ "$($C $B/api/mock/$EXAM -H "Authorization: Bearer $T2" | grep -o '"savedAnswer":"[^"]*"' | cut -d'"' -f4)" = "C" ] && ok "post-deadline answer not stored" || bad "post-deadline stored" ""
R1=$($C -X POST $B/api/mock/$EXAM/submit -H "Authorization: Bearer $T2" -H 'Content-Type: application/json' -d '{}' | field resultId)
R2=$($C -X POST $B/api/mock/$EXAM/submit -H "Authorization: Bearer $T2" -H 'Content-Type: application/json' -d '{}' | field resultId)
[ -n "$R1" ] && ok "submit after deadline" || bad "submit" ""
[ "$R1" = "$R2" ] && [ -n "$R1" ] && ok "double submit returns same result" || bad "double submit" "$R1 vs $R2"
TK=$(echo "SELECT \"timeTaken\" FROM \"MockExamResult\" WHERE \"examId\"='$EXAM';" | psqlq)
[ -n "$TK" ] && [ "$TK" -le 10800 ] && ok "timeTaken capped" || bad "timeTaken" "$TK"

echo "== mock questions are invisible to practice =="
[ "$(echo "SELECT count(*) FROM \"Question\" WHERE \"mockOnly\"=false AND id='$MQ_QID';" | psqlq)" = "0" ] && ok "mock question flagged mockOnly" || bad "mockOnly" ""
EMAIL_B="qa-b-$(date +%s)-$RANDOM@example.com"
JAR3=$(mktemp)
$C -c "$JAR3" -X POST $B/api/auth/register -H 'Content-Type: application/json' \
  -d "{\"name\":\"QA Other\",\"email\":\"$EMAIL_B\",\"password\":\"QaPassword123\",\"class\":\"12\",\"targetExam\":\"Main\",\"currentLevel\":\"beginner\"}" >/dev/null
T3=$(tokjar "$JAR3")
$C -X POST $B/api/answers/submit -H "Authorization: Bearer $T3" -H 'Content-Type: application/json' \
  -d "{\"questionId\":\"$MQ_QID\",\"answer\":\"B\",\"timeSpent\":5}" | grep -q 'not part of your session' && ok "other student cannot get a mock answer" || bad "cross-student" ""

echo "== infrastructure =="
[ "$(docker compose --env-file .env exec -T redis redis-cli CONFIG GET maxmemory-policy | tail -n1)" = "noeviction" ] && ok "redis noeviction" || bad "redis policy" ""
docker compose --env-file .env exec -T backend sh -c 'touch /app/data/.qa_write' >/dev/null 2>&1 && bad "data volume writable" "" || ok "data volume read-only"
./deploy.sh renew-ssl >/dev/null 2>&1 && ok "renew-ssl runs" || bad "renew-ssl" ""
[ "$($C -o /dev/null -w '%{http_code}' $B/api/questions/bank-stats -H "Authorization: Bearer $T2")" = "200" ] && ok "bank-stats" || bad "bank-stats" ""

echo "== cleanup =="
psqlq <<SQL >/dev/null
DELETE FROM "User" WHERE email LIKE 'qa-%@example.com';
DELETE FROM "Question" WHERE "mockOnly" = true AND id LIKE 'qa_mockq_%';
SQL
ok "test data removed"

echo
echo "QA API: $PASS passed, $FAIL failed"
[ "$FAIL" -eq 0 ]
