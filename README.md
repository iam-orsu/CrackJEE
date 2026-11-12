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

### 1. Server Prerequisites (Ubuntu / Debian)

```bash
sudo apt-get update && sudo apt-get install -y curl ca-certificates git nginx mysql-server
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
node -v && npm -v && pm2 -v && nginx -v && mysql --version
```

*(Omit `mysql-server` above if connecting to a dedicated/separate MySQL server.)*

### 2. MySQL Database & User Setup (if hosting MySQL on this server)

```bash
sudo systemctl enable --now mysql
sudo mysql <<'SQL'
CREATE DATABASE IF NOT EXISTS jeeneet;
CREATE USER IF NOT EXISTS 'crackjee'@'127.0.0.1' IDENTIFIED BY 'CHANGE_ME_STRONG_PASS';
GRANT ALL PRIVILEGES ON jeeneet.* TO 'crackjee'@'127.0.0.1';
FLUSH PRIVILEGES;
SQL
```

### 3. Clone & Configure Environment

```bash
git clone https://github.com/iam-orsu/CrackJEE.git
cd CrackJEE
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Your production `backend/.env` should look like this (with your own generated secret/passwords):

```env
NODE_ENV=production
PORT=3001
LOG_LEVEL=info
FRONTEND_URL=https://jeeneet.ai
EXTRA_CORS_ORIGINS=https://www.jeeneet.ai

DATABASE_URL=mysql://crackjee:<YOUR_MYSQL_PASSWORD>@127.0.0.1:3306/jeeneet
DB_CONNECTION_LIMIT=10
DB_FANOUT_CONCURRENCY=5

JWT_SECRET=<YOUR_64_CHAR_HEX_SECRET>

DEEPSEEK_API_KEY=<YOUR_DEEPSEEK_API_KEY_OR_LEAVE_EMPTY>
DEEPSEEK_CONCURRENCY=6
DEEPSEEK_CIRCUIT_FAILURE_THRESHOLD=5
DEEPSEEK_CIRCUIT_COOLDOWN_MS=300000

# Optional Super Admin (/superadmin) — generate hash:
#   node -e "require('bcrypt').hash('yourpassword', 12).then(console.log)"
SUPERADMIN_EMAIL=
SUPERADMIN_PASSWORD_HASH=
```

*(Leave `REDIS_URL` commented out to use the built-in in-memory TTL store, and leave `COOKIE_SECURE` unset in production HTTPS so `Secure` cookies turn on automatically. `frontend/.env.local` works as-is with its defaults.)*

### 4. Build, Migrate & Seed

```bash
cd backend && npm ci && npm run db:generate && npm run db:migrate && npm run build && npm run db:seed
cd ../frontend && npm ci && npm run build
```

### 5. Start Services with PM2

```bash
cd ~/CrackJEE
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

*(Run the `sudo env PATH=...` command printed by `pm2 startup` so PM2 auto-starts on server reboot.)*

### 6. Configure Nginx & HTTPS (Let's Encrypt via Certbot on Server)

Ensure TCP ports `80` and `443` are open in your firewall / AWS Security Group (keep MySQL port `3306` closed to `0.0.0.0/0` when MySQL runs locally).

1. **Create the Nginx site config (HTTP port 80 first so Certbot can verify the domain):**

```bash
sudo tee /etc/nginx/sites-available/jeeneet.conf > /dev/null <<'EOF'
upstream jeeneet_frontend {
    server 127.0.0.1:3000;
    keepalive 32;
}

upstream jeeneet_backend {
    server 127.0.0.1:3001;
    keepalive 32;
}

server {
    listen 80;
    listen [::]:80;
    server_name jeeneet.ai www.jeeneet.ai;

    server_tokens off;
    client_max_body_size 1m;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    location /api/ {
        proxy_pass http://jeeneet_backend;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 180s;
        proxy_send_timeout 180s;
    }

    location = /health {
        proxy_pass http://jeeneet_backend/health;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    location / {
        proxy_pass http://jeeneet_frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/jeeneet.conf /etc/nginx/sites-enabled/jeeneet.conf
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl enable --now nginx && sudo systemctl reload nginx
```

2. **Issue SSL certificate and enable HTTPS + HTTP→HTTPS redirect:**

```bash
sudo apt-get update && sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d jeeneet.ai -d www.jeeneet.ai
```

*(Certbot sets up background auto-renewal automatically. If you prefer installing your own manual `.pem` certs in `/etc/nginx/ssl/fullchain.pem` and `/etc/nginx/ssl/privkey.pem` instead, use [`nginx/jeeneet.conf`](nginx/jeeneet.conf) directly.)*

3. **Verify live HTTPS health:**

```bash
curl -s https://jeeneet.ai/health && echo ""
curl -sI https://jeeneet.ai | head -n 5
```

---

### 7. Deploying Future Updates (`main` → Production Server)

Whenever you push new changes from your local machine to `origin/main`, run this on the production server to pull, migrate, rebuild, and restart cleanly:

```bash
cd ~/CrackJEE
git pull origin main

# Backend: install deps, regenerate Prisma client, apply new migrations, build, re-seed (idempotent)
cd ~/CrackJEE/backend
npm ci && npm run db:generate && npm run db:migrate && npm run build && npm run db:seed

# Frontend: install deps & rebuild Next.js
cd ~/CrackJEE/frontend
npm ci && npm run build

# Restart PM2 processes with any updated env values & check health
cd ~/CrackJEE
pm2 restart ecosystem.config.cjs --update-env
pm2 status
curl -s https://jeeneet.ai/health && echo ""
```

*(If only frontend or only backend changed, you can rebuild/restart just that side — e.g. `pm2 restart jeeneet-backend` or `pm2 restart jeeneet-frontend` — and run `sudo nginx -t && sudo systemctl reload nginx` only if Nginx config changed.)*
