# JEENEET.ai

JEENEET.ai is a practice and full-length mock test platform for **JEE Main**, **JEE Advanced**, and **NEET UG**. Students get adaptive topic practice, timed CBT mock exams, instant scoring, weak-area detection, and AI-backed question generation/explanations via DeepSeek.

---

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript (class-based layered architecture), Prisma ORM
- **Database**: MySQL 8+ (local instance for dev, remote MySQL server via `DATABASE_URL` in production)
- **Cache**: Optional Redis (`REDIS_URL`); automatically falls back to a built-in bounded in-memory TTL store when omitted
- **Process Manager & Proxy (Prod)**: PM2 + manual Nginx + manual SSL certificates

---

## Project Structure

```text
├── data/                         # Seed banks (JEE 7,456 Qs + NEET 5,221 Qs)
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma         # MySQL Prisma schema
│   │   └── migrations/           # MySQL SQL migrations
│   └── src/
│       ├── config/               # env validation (.env loader), MySQL client, CORS, constants
│       ├── middlewares/          # auth, adminAuth, rateLimiter, errorHandler, requestId
│       ├── repositories/         # Prisma & MySQL raw query data-access classes
│       ├── services/             # Business logic classes (Auth, Mock, Question, Grading, DeepSeek, etc.)
│       ├── controllers/          # Thin HTTP request/response controllers
│       ├── routes/               # Express route wiring
│       ├── utils/                # Logger, circuit breaker, concurrency limiter, prompts, IST helpers
│       ├── scripts/seedQuestions.ts # Idempotent JEE + NEET bank seeder
│       ├── app.ts                # Express app factory
│       └── server.ts             # Process entry point & graceful shutdown
├── frontend/                     # Next.js application
├── nginx/jeeneet.conf            # Reference manual Nginx + SSL site config
└── ecosystem.config.cjs          # PM2 production process definitions
```

---

## Local Development Setup

### Prerequisites
- Node.js `>= 20`
- MySQL `8.0+` (local or remote server)

### 1. Configure Environment

```bash
cp .env.example .env
```

Update `DATABASE_URL`, `JWT_SECRET`, and `DEEPSEEK_API_KEY` in `.env` (place `.env` in repo root or `backend/.env` — both are loaded automatically). `REDIS_URL` is optional.

### 2. Backend Setup, Migration & JSON Seeding

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy       # or `npm run db:migrate:dev` on fresh local MySQL
npm run db:seed                 # seeds both data/jee/jee_master_questions.json & data/neet/neet_master_questions.json
npm run dev                     # starts hot-reload TypeScript dev server on :3001
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev                     # starts Next.js dev server on :3000 (proxies /api/* -> http://127.0.0.1:3001)
```

### Backend Tests & Build

```bash
cd backend
npm run build
npm test
```

---

## Production Deployment (PM2 + Manual Nginx & SSL)

```bash
# 1. Build backend & frontend
cd backend && npm ci && npx prisma generate && npx prisma migrate deploy && npm run build && npm run db:seed
cd ../frontend && npm ci && npm run build

# 2. Start / reload with PM2 from repo root
cd ..
pm2 start ecosystem.config.cjs --env production
pm2 save
```

Configure Nginx manually on the server using [`nginx/jeeneet.conf`](nginx/jeeneet.conf) with your SSL certificate and key paths, then reload Nginx (`sudo nginx -t && sudo systemctl reload nginx`).
