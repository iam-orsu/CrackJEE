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

## Local Deployment & Development Setup

### Prerequisites
- Node.js `>= 20`
- MySQL `8.0+` (local Windows/macOS MySQL, Ubuntu WSL MySQL, or a separate MySQL server)

---

### Step 1: Create MySQL Database and User

Without Docker, MySQL does not read `.env` to create accounts automatically — create a database and user once in MySQL (any username, password, and database name you want; each developer can use their own locally).

**On Ubuntu / WSL (`sudo mysql`):**
```bash
sudo mysql <<'SQL'
CREATE DATABASE IF NOT EXISTS jeeneet;
CREATE USER IF NOT EXISTS 'crackjee'@'%' IDENTIFIED BY 'CrackJee_Local123!';
GRANT ALL PRIVILEGES ON jeeneet.* TO 'crackjee'@'%';
FLUSH PRIVILEGES;
SQL
```

*(If running from Windows PowerShell against WSL Ubuntu MySQL, you can also run `wsl -d ubuntu -e sudo mysql -e "..."`. If you already have an existing remote/separate MySQL server with a DB and user, skip Step 1.)*

---

### Step 2: Copy the `.env` Templates

From the repository root (`CrackJEE/`):

**PowerShell (Windows):**
```powershell
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env.local
```

**Bash (Linux / macOS / WSL):**
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

*(Putting `.env` directly inside `backend/` ensures backend scripts always load it cleanly and ignore any old root `.env`.)*

---

### Step 3: Fill in Values in `backend/.env`

1. Generate a secure `JWT_SECRET` (minimum 16 chars):
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
2. Open `backend/.env` and fill in your values:
   - **`DATABASE_URL`**: replace `CHANGE_ME` with your MySQL credentials from Step 1 (keep a single `DATABASE_URL=` prefix):
     ```env
     DATABASE_URL=mysql://crackjee:CrackJee_Local123!@127.0.0.1:3306/jeeneet
     ```
   - **`JWT_SECRET`**: paste the random hex string generated above:
     ```env
     JWT_SECRET=<your-generated-64-char-hex>
     ```
   - **`DEEPSEEK_API_KEY`** *(optional)*: paste your `sk-...` key for AI generation/explanations, or leave empty (`DEEPSEEK_API_KEY=`) to run mocks and practice purely from the seeded question bank.
   - **`REDIS_URL`** *(optional)*: leave commented out for local/single-node runs (uses built-in in-memory TTL cache).
   - **`SUPERADMIN_EMAIL` & `SUPERADMIN_PASSWORD_HASH`** *(optional)*: set only if using `/superadmin`.
3. `frontend/.env.local` already defaults `BACKEND_URL=http://127.0.0.1:3001` and `NEXT_PUBLIC_API_URL=/api/v1` — no edits needed for local development.

---

### Step 4: Install Backend Dependencies, Migrate & Seed

From `backend/` (run in the same OS where you will run `npm run dev` so native modules like `bcrypt` match):

```bash
cd backend
npm install
npm run db:generate
npm run db:migrate              # applies MySQL migrations (`prisma migrate deploy`)
npm run db:seed                 # seeds 12,677 questions (7,456 JEE + 5,221 NEET)
```

*(If running inside WSL/Linux instead of Windows and `backend/node_modules` already existed from Windows, run `npm ci` first.)*

---

### Step 5: Install Frontend Dependencies

```bash
cd frontend
npm install
```

> **Note:** Use `npm install` on Windows so Windows-specific optional native packages (`lightningcss`, `sharp`, etc.) resolve cleanly alongside the lockfile. Do not commit local Windows-only `package-lock.json` edits if your team builds on Linux CI (`git checkout -- frontend/package-lock.json`).

---

### Step 6: Start Backend & Frontend (Two Terminals)

1. **Terminal 1 — Backend (`http://localhost:3001`):**
   ```bash
   cd backend
   npm run dev
   ```
   Wait for `Backend listening on :3001`.

2. **Terminal 2 — Frontend (`http://localhost:3000`):**
   ```bash
   cd frontend
   npm run dev
   ```

Open **http://localhost:3000** in your browser.

---

### Tests, Lint & Typecheck

```bash
# Backend
cd backend && npm run build && npm test

# Frontend
cd frontend && npx tsc --noEmit && npm run lint && npm test
```

---

## Production Deployment (PM2 + Manual Nginx & SSL)

```bash
# 1. Build backend & frontend
cd backend && npm ci && npm run db:generate && npm run db:migrate && npm run build && npm run db:seed
cd ../frontend && npm ci && npm run build

# 2. Start / reload with PM2 from repo root
cd ..
pm2 start ecosystem.config.cjs --env production
pm2 save
```

Configure Nginx manually on the server using [`nginx/jeeneet.conf`](nginx/jeeneet.conf) with your SSL certificate and key paths, then reload Nginx (`sudo nginx -t && sudo systemctl reload nginx`).
