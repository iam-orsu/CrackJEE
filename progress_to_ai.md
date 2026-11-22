# Deployment and Engineering Progress Reference

This document serves as an operational and architectural reference for AI assistants working on the JEENEET platform.

---

## 1. Environment & Infrastructure Topology

### Production VPS Host (Proctorview Server)
- Hostname: `proctorview`
- IP Address: `137.59.52.114`
- User & Path: `root@proctorview:~/CrackJEE`
- Git Remote Tracked: `gouseferoz/jeeneet.git` (`boss/main`)
- Operating System: Ubuntu 24.04.3 LTS (GNU/Linux 6.8.0-53-generic x86_64)
- Direct Access Preview: `http://137.59.52.114:7000`
- Target Production Domain: `jeeneet.ai` and `www.jeeneet.ai`
- Internal Ports: Frontend `7000`, Backend `7001` (to prevent collision with other applications running on this server)

### Staging VPS Host (Staging Server)
- Hostname: `ip-172-31-8-120`
- IP Address: `3.106.213.95`
- User & Path: `jee@ip-172-31-8-120:~/CrackJEE`
- Git Remote Tracked: `iam-orsu/CrackJEE.git` (`origin/main`)
- Operating System: Ubuntu
- Internal Ports: Frontend `3000`, Backend `3001`

### Remote Database Server (MySQL)
- Host: `167.104.222.218`
- Port: `3306`
- Database Name: `jeeneet`
- Connection String Protocol: `mysql://root:<PASSWORD>@167.104.222.218:3306/jeeneet?connection_limit=10`
- Migrations Status: All 10 Prisma database migrations applied cleanly via `npx prisma migrate deploy`.
- Question Bank Seeding: Fully seeded with all 14,497 production questions (9,276 JEE questions from `data/jee/jee_master_questions.json` and 5,221 NEET questions from `data/neet/neet_master_questions.json`).

---

## 2. Process Management (PM2) & Dynamic Port Auto-Detection

Both application layers run under PM2 using `/root/CrackJEE/ecosystem.config.cjs`.

To prevent port conflicts and ensure `git pull` never breaks either server:
`ecosystem.config.cjs` automatically detects `os.hostname()`:
- When running on `proctorview` (`137.59.52.114`): Automatically assigns Backend port `7001`, Frontend port `7000`, and `BACKEND_URL=http://127.0.0.1:7001`.
- When running on `staging` (`3.106.213.95`) or local: Automatically assigns Backend port `3001`, Frontend port `3000`, and `BACKEND_URL=http://127.0.0.1:3001`.

| App Name | Proctorview Port | Staging Port | Script / Command |
|---|---|---|---|
| `jeeneet-backend` | 7001 | 3001 | `dist/server.js` |
| `jeeneet-frontend` | 7000 | 3000 | `npm run start` |

### Key Operational Commands
- Restart/Reload: `pm2 reload ecosystem.config.cjs --update-env`
- Save State: `pm2 save`
- Health Checks:
  - Proctorview Backend: `curl -I http://127.0.0.1:7001/health`
  - Proctorview Frontend: `curl -I http://127.0.0.1:7000`
  - Staging Backend: `curl -I http://127.0.0.1:3001/health`
  - Staging Frontend: `curl -I http://127.0.0.1:3000`

---

## 3. Reverse Proxy & Nginx Setup

### Staging Nginx (`3.106.213.95`)
- Server Config File: `/etc/nginx/sites-available/jeeneet.conf`
- Repository Template: `nginx/jeeneet.conf`
- Reverse Proxies To:
  - `jeeneet_frontend` -> `127.0.0.1:3000`
  - `jeeneet_backend` -> `127.0.0.1:3001`

### Proctorview Production Nginx (`137.59.52.114`)
- Server Config File: `/etc/nginx/sites-available/jeeneet.ai.conf`
- Repository Template: `nginx/jeeneet.ai.conf`
- Reverse Proxies To:
  - `jeeneet_frontend` -> `127.0.0.1:7000`
  - `jeeneet_backend` -> `127.0.0.1:7001`
- Next.js Internal Proxy: `frontend/next.config.ts` has built-in rewrites forwarding `/api/:path*` to `process.env.BACKEND_URL`, ensuring that direct port access works seamlessly without Nginx dependency.

---

## 4. UI Customization: Psychometric Test Sequential Navigation

### Requirements
- For Psychometric assessments (both in faculty-assigned exams at `/student/exam/[id]` and homepage assessments at `/psychometric`), students must NOT see numbered question palettes or buttons.
- Navigation must be strictly sequential: only Previous and Next controls without jumping between numbered questions.
- JEE Main, JEE Advanced, and NEET exams must remain completely untouched with full question palettes and marking controls intact.

### Implementation Details
1. `frontend/src/app/student/exam/[id]/page.tsx`:
   - Checks `isPsychometric = session.examType === 'Psychometric' || session.questions.some((q) => q.subject === 'Psychometric')`.
   - Hides the right-hand `<aside>` Question Palette sidebar containing the 1..24 button grid.
   - Replaces numbered title with `Assessment Question`.
   - Hides subject navigation tabs to prevent jumping.
   - Bottom bar contains only `Previous` and `Next` (`Submit assessment` on final question).
2. `frontend/src/app/(app)/psychometric/page.tsx`:
   - Removed the Quick Question Navigation Palette numbered button strip.
   - Removed question count numbers from header and submit buttons.
   - Navigation contains only `Previous` and `Next Question` (`Submit & View Career Decision` on final question).
3. `frontend/src/app/(app)/mock/[id]/page.tsx`:
   - Conditioned `<ExamPalette>` on `!isPsychometric` so that any psychometric mock test adheres to sequential navigation.
   - JEE and NEET keep full palettes and question numbering.
4. `frontend/src/app/student/result/[id]/page.tsx` & `frontend/src/app/student/page.tsx`:
   - Completely removed the circular percentage gauge (`Ring` with `65% GOAL ALIGNMENT`).
   - Replaced with a clean **Career Path** showcase card featuring the Compass emblem, target role, and behavioral profile analysis without any percentages or score alignment.
   - Dashboard card shows `Psychometric Assessment: Evaluated · View Career Insights` instead of a percentage.
5. 80%+ Psychometric Completion Threshold & Evaluation Guard:
   - Behavioral evaluations require at least 80%+ of questions to be answered for statistical validity and vocational fit.
   - Exact Question Submission Tracking: The system tracks and displays `{attemptedCount} / {totalQuestions}` (e.g. `0 / 24`, `1 / 24`, `2 / 24`, `3 / 24`).
   - If completion rate is `< 80%` (e.g. 0 to 19 questions answered out of 24):
     * The system strictly suppresses career role predictions (such as "AI/ML Research Engineer").
     * Role title displays: `Insufficient Responses to Evaluate` (or `Insufficient Responses` in badges).
     * Reason card explicitly informs: `Only X of Y questions (Z%) were answered. At least 80% completion is required to evaluate behavioral traits and determine career fit.`
     * Career emblem card displays: `Assessment Status: Assessment Incomplete` (or `No Responses` if 0) with `{attemptedCount} of {totalQuestions} Answered`.
     * Synthesis badge displays: `Incomplete Assessment (Z%)`.
     * Strengths and Faculty Mentoring Guidance sections clarify that at least 80% completion is mandatory before personal strengths can be reliably measured.
     * Synchronous AI evaluation race is skipped when `< 80%` to conserve tokens, and background worker stores the insufficient responses state.
     * Existing student submissions with `< 80%` completion are automatically re-evaluated dynamically on fetch so stale or misleading cached roles are never displayed.
     * Faculty dashboard rank list and CSV exports also display `Insufficient Responses to Evaluate` with the exact answered count and completion percentage.

6. Strict Psychometric Question Count Validation & Automatic Top-Up:
   - Root cause identified: When generating psychometric papers with high question counts (e.g. 45), an overly aggressive token overlap filter (0.35 threshold) dropped valid scenario questions that shared domain vocabulary (e.g. "AI", "project", "code"). Additionally, the fallback padding loop failed to guarantee the exact count, and the paper service previously overwrote `questionCount` with whatever partial count was generated (e.g. 34 Qs).
   - Multi-layer validation fix:
     * Frontend (`frontend/src/app/faculty/page.tsx`): Remainder question distribution across domains now strictly sums to `activeCount`.
     * AI Service (`backend/src/services/DeepSeekPsychometricService.ts`): Deduplication token threshold calibrated to 0.65/0.70. Added `topUpItems` method that guarantees `items.length === input.questionCount` using unique contextualized domain items.
     * Service Layer (`backend/src/services/FacultyPaperService.ts`): Enforced strict assertion validation in `runPsychometricGeneration`. The service tops up any count shortfalls, sequentially indexes questions 1..N, and guarantees `paper.questionCount === input.questionCount`.

---

## 5. Verification Status

- Backend Vitest Suite: 256 passed, 0 failed (includes automated tests for 45 and 100 questions exact count validation).
- Frontend Vitest Suite: 40 passed, 0 failed.
- Next.js Production Build: Successfully generated all 18 routes with zero type or lint errors.
- Backend TypeScript Build: `prisma generate && tsc` completed with 0 errors.
- Proctorview Production Remote: Pushed to `gouseferoz/jeeneet.git` (`boss/main`).
- Staging Remote: Pushed to `iam-orsu/CrackJEE.git` (`origin/main` and `origin/vamsi`).
- Note: `progress_to_ai.md` is strictly maintained only in `iam-orsu/CrackJEE.git` and excluded from `gouseferoz/jeeneet.git`.

---

## 6. Pending Deployment Steps

1. **DNS Mapping**:
   - Boss will point the DNS A-records for `jeeneet.ai` and `www.jeeneet.ai` to `137.59.52.114`.
2. **SSL Activation**:
   - Once DNS has propagated, run on the VPS:
     ```bash
     certbot --nginx -d jeeneet.ai -d www.jeeneet.ai --non-interactive --agree-tos --email admin@jeeneet.ai --redirect
     ```
3. **Post-SSL Verification**:
   - Verify `https://jeeneet.ai` and `https://jeeneet.ai/api/v1/health`.
