# JEENEET.ai

Practice and CBT mock exam platform for **JEE Main**, **JEE Advanced**, and **NEET UG**, featuring adaptive question generation, weak-area analytics, and faculty paper studios.

---

## Tech Stack

* **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
* **Backend:** Node.js, Express, TypeScript, Prisma ORM
* **Database & Cache:** MySQL 8+, optional Redis (falls back to built-in in-memory cache)
* **Production:** PM2 process manager + Nginx reverse proxy + Let's Encrypt SSL

---

## 🛠️ Local Development Setup

### Prerequisites
* Node.js `>= 20`
* MySQL `8.0+` running locally or via WSL

### 1. Clone & Env Setup
```bash
# In repository root:
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

### 2. Configure `backend/.env`
Create a database in MySQL (`CREATE DATABASE jeeneet;`) and update `backend/.env`:
```env
DATABASE_URL="mysql://root:password@127.0.0.1:3306/jeeneet"
JWT_SECRET="any_random_32_char_secret_key_here"
PORT=3001
FRONTEND_URL=http://localhost:3000

# Optional (Leave empty to use built-in question bank):
DEEPSEEK_API_KEY=
```
*(Frontend `.env.local` works out of the box with defaults).*

### 3. Install, Migrate & Seed Questions
```bash
# Backend setup
cd backend
npm install
npm run db:generate
npm run db:migrate
npm run db:seed          # Seeds 12,677+ verified JEE & NEET questions

# Frontend setup
cd ../frontend
npm install
```

### 4. Run Development Servers
Open two terminals:

```bash
# Terminal 1 - Backend (port 3001)
cd backend && npm run dev

# Terminal 2 - Frontend (port 3000)
cd frontend && npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🚀 Production Deployment (Ubuntu / EC2)

### 1. One-Time Server Prerequisites
```bash
sudo apt update && sudo apt install -y curl git nginx mysql-server certbot python3-certbot-nginx
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

### 2. Setup MySQL Database
```bash
sudo mysql -e "CREATE DATABASE IF NOT EXISTS jeeneet; CREATE USER IF NOT EXISTS 'crackjee'@'127.0.0.1' IDENTIFIED BY 'YOUR_STRONG_PASSWORD'; GRANT ALL PRIVILEGES ON jeeneet.* TO 'crackjee'@'127.0.0.1'; FLUSH PRIVILEGES;"
```

### 3. Clone Repository & Setup `.env`
```bash
cd ~
git clone https://github.com/iam-orsu/CrackJEE.git
cd CrackJEE
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```
Edit `backend/.env`:
```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://jeeneet.ai
EXTRA_CORS_ORIGINS=https://www.jeeneet.ai

DATABASE_URL=mysql://crackjee:YOUR_STRONG_PASSWORD@127.0.0.1:3306/jeeneet
JWT_SECRET=YOUR_RANDOM_64_CHAR_HEX

DEEPSEEK_API_KEY=your_deepseek_api_key

# Superadmin credentials for /superadmin:
SUPERADMIN_EMAIL=admin@crackjee.com
SUPERADMIN_PASSWORD_HASH=$2b$10$...
```

### 4. Install, Build & Seed
```bash
cd ~/CrackJEE/backend
npm ci && npm run db:generate && npm run db:migrate && npm run build && npm run db:seed

cd ~/CrackJEE/frontend
npm ci && npm run build
```

### 5. Start with PM2
```bash
cd ~/CrackJEE
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

### 6. Configure Nginx & SSL
Create `/etc/nginx/sites-available/jeeneet.conf`:
```nginx
upstream frontend_app { server 127.0.0.1:3000; }
upstream backend_api   { server 127.0.0.1:3001; }

server {
    listen 80;
    server_name jeeneet.ai www.jeeneet.ai;

    location /api/ {
        proxy_pass http://backend_api;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location = /health {
        proxy_pass http://backend_api/health;
    }

    location / {
        proxy_pass http://frontend_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```
Enable site and get SSL certificate:
```bash
sudo ln -sf /etc/nginx/sites-available/jeeneet.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d jeeneet.ai -d www.jeeneet.ai
```

---

## 🔄 Deploying Future Updates (Production)

Whenever you push changes to `main`, run this one-liner on your EC2:

```bash
cd ~/CrackJEE && git pull origin main && \
cd backend && npm ci && npm run db:generate && npm run db:migrate && npm run build && \
cd ../frontend && npm ci && npm run build && \
cd ~/CrackJEE && pm2 restart ecosystem.config.cjs --update-env
```

---

## 📌 Useful Commands & Cheatsheet

| Task | Command |
| :--- | :--- |
| **Check PM2 status** | `pm2 status` |
| **View live logs** | `pm2 logs` |
| **Restart backend only** | `pm2 restart jeeneet-backend` |
| **Restart frontend only** | `pm2 restart jeeneet-frontend` |
| **Check health endpoint** | `curl -s https://jeeneet.ai/health` |
| **Reload Nginx** | `sudo nginx -t && sudo systemctl reload nginx` |
