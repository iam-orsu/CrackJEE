# Deployment and Engineering Progress Reference

This document serves as an operational and architectural reference for AI assistants working on the JEENEET platform.

---

## 1. Environment & Infrastructure Topology

### VPS Host (Application Server)
- Hostname: `proctorview`
- IP Address: `137.59.52.114`
- OS: Ubuntu 24.04.3 LTS (GNU/Linux 6.8.0-53-generic x86_64)
- Path on Server: `/root/CrackJEE`
- Current Direct Access URL: `http://137.59.52.114:7000`
- Target Production Domain: `jeeneet.ai` and `www.jeeneet.ai`

### Remote Database Server (MySQL)
- Host: `167.104.222.218`
- Port: `3306`
- Database Name: `jeeneet`
- Connection String Protocol: `mysql://root:<PASSWORD>@167.104.222.218:3306/jeeneet?connection_limit=10`
- Migrations Status: All 10 Prisma database migrations applied cleanly via `npx prisma migrate deploy`.
- Question Bank Seeding: Fully seeded with all 14,497 production questions (9,276 JEE questions from `data/jee/jee_master_questions.json` and 5,221 NEET questions from `data/neet/neet_master_questions.json`).

---

## 2. Process Management (PM2)

Both application layers run under PM2 using `/root/CrackJEE/ecosystem.config.cjs`:

| App Name | Port | Directory | Mode | Script / Command |
|---|---|---|---|---|
| `jeeneet-backend` | 7001 | `./backend` | fork | `dist/server.js` |
| `jeeneet-frontend` | 7000 | `./frontend` | fork | `npm run start` |

### Key Operational Commands
- Restart/Reload: `cd /root/CrackJEE && pm2 reload ecosystem.config.cjs --update-env`
- Save State: `pm2 save`
- Health Checks:
  - Backend: `curl -I http://127.0.0.1:7001/health`
  - Frontend: `curl -I http://127.0.0.1:7000`

---

## 3. Reverse Proxy & Nginx Setup

The server hosts multiple applications. Ports 7000 and 7001 are assigned specifically to JEENEET to avoid collisions with other running projects.

- Config Location on Server: `/etc/nginx/sites-available/jeeneet.ai.conf`
- Symlink: `/etc/nginx/sites-enabled/jeeneet.ai.conf`
- Git Repo Template: `nginx/jeeneet.ai.conf`
- Routing Map:
  - `/api/` -> `http://127.0.0.1:7001`
  - `/health` -> `http://127.0.0.1:7001/health`
  - `/` -> `http://127.0.0.1:7000`
- Next.js Internal Proxy: `frontend/next.config.ts` has built-in rewrites forwarding `/api/:path*` to `process.env.BACKEND_URL` (`http://127.0.0.1:7001`), ensuring that direct port access (`http://137.59.52.114:7000`) works seamlessly without Nginx dependency.

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

---

## 5. Verification Status

- Backend Vitest Suite: 235 passed, 0 failed.
- Frontend Vitest Suite: 40 passed, 0 failed.
- Next.js Production Build: Successfully generated all 18 routes with zero type or lint errors.
- Live HTTP Status: Returning `200 OK` on `http://137.59.52.114:7000`.

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
