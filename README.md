# JEENEET.ai

Practice and CBT mock exam platform for **JEE Main**, **JEE Advanced**, and **NEET UG**, featuring adaptive question generation, weak-area analytics, and faculty paper studios.

---

## Tech Stack

* **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
* **Backend:** Node.js, Express, TypeScript (layered architecture), Prisma ORM
* **Database & Cache:** MySQL 8+, optional Redis (falls back to built-in in-memory TTL cache)
* **Production Deployment:** PM2 Process Manager + Nginx Reverse Proxy + Let's Encrypt SSL

---

## 🛠️ Part 1: Local Development Setup (From Scratch)

### Prerequisites
* Node.js `>= 20` (Node 20 or 22 LTS recommended)
* Ubuntu / Debian / WSL2 (Windows Subsystem for Linux) / macOS

---

### Step 1: Install & Start MySQL on Ubuntu / WSL
If MySQL is not installed on your machine or WSL:

```bash
# Update package lists and install MySQL server
sudo apt update
sudo apt install -y mysql-server

# Start MySQL service and ensure it runs automatically
sudo systemctl enable --now mysql

# Verify MySQL is active and running
sudo systemctl status mysql --no-pager
```

> **Note:** On Ubuntu/Debian, `sudo mysql` connects directly to the root account via the `auth_socket` plugin without needing a root password.

---

### Step 2: Create MySQL Database & User
Run the following command directly in your terminal to create the database and a dedicated user:

```bash
sudo mysql <<'SQL'
CREATE DATABASE IF NOT EXISTS jeeneet CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Allow connections from TCP (127.0.0.1) and socket (localhost)
CREATE USER IF NOT EXISTS 'crackjee'@'%' IDENTIFIED BY 'CrackJee_Local123!';
GRANT ALL PRIVILEGES ON jeeneet.* TO 'crackjee'@'%';

CREATE USER IF NOT EXISTS 'crackjee'@'localhost' IDENTIFIED BY 'CrackJee_Local123!';
GRANT ALL PRIVILEGES ON jeeneet.* TO 'crackjee'@'localhost';

FLUSH PRIVILEGES;
SQL
```

Test the database connection:
```bash
mysql -u crackjee -p'CrackJee_Local123!' -h 127.0.0.1 -e "SHOW DATABASES;"
```

---

### Step 3: Clone Repository & Setup `.env` Files

```bash
git clone https://github.com/iam-orsu/CrackJEE.git
cd CrackJEE

# Copy environment variable templates
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Generate a secure random secret for JWT:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Open `backend/.env` in your editor (`nano backend/.env`) and verify the database URL and secret:
```env
PORT=3001
FRONTEND_URL=http://localhost:3000
DATABASE_URL="mysql://crackjee:CrackJee_Local123!@127.0.0.1:3306/jeeneet"
JWT_SECRET=your_generated_32_or_64_char_hex_secret

# Optional: DeepSeek API Key (Leave empty to use built-in 12,677+ question bank)
DEEPSEEK_API_KEY=
```
*(Frontend `frontend/.env.local` works out of the box with defaults).*

---

### Step 4: Install Dependencies, Migrate Database & Seed Questions

```bash
# 1. Setup Backend
cd backend
npm install
npm run db:generate             # Generates Prisma client
npm run db:migrate              # Applies database schema migrations
npm run db:seed                 # Seeds 12,677+ verified JEE & NEET questions

# 2. Setup Frontend
cd ../frontend
npm install
```

---

### Step 5: (Optional) Create a Faculty / Mentor Account

To test the Faculty Studio (`/faculty`), create a faculty login:
```bash
cd backend
npm run faculty:create -- "Faculty Mentor" mentor@example.com "Faculty@123"
```

---

### Step 6: Start Local Development Servers

Open two terminals:

```bash
# Terminal 1: Backend (runs on port 3001)
cd backend && npm run dev

# Terminal 2: Frontend (runs on port 3000)
cd frontend && npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🚀 Part 2: Production Deployment on Ubuntu / AWS EC2 (From Scratch)

### Step 1: Install Server Packages (Node 22, Git, Nginx, MySQL, PM2, Certbot)

Run on your fresh Ubuntu / Debian server:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl ca-certificates git nginx mysql-server certbot python3-certbot-nginx

# Install Node.js 22 LTS
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 process manager globally
sudo npm install -g pm2

# Verify all installed tools
node -v && npm -v && pm2 -v && nginx -v && mysql --version
```

---

### Step 2: Configure & Start Production MySQL

```bash
# Ensure MySQL service is running
sudo systemctl enable --now mysql

# Create database and production database user
sudo mysql <<'SQL'
CREATE DATABASE IF NOT EXISTS jeeneet CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'crackjee'@'127.0.0.1' IDENTIFIED BY 'YOUR_STRONG_DB_PASSWORD';
GRANT ALL PRIVILEGES ON jeeneet.* TO 'crackjee'@'127.0.0.1';

CREATE USER IF NOT EXISTS 'crackjee'@'localhost' IDENTIFIED BY 'YOUR_STRONG_DB_PASSWORD';
GRANT ALL PRIVILEGES ON jeeneet.* TO 'crackjee'@'localhost';

FLUSH PRIVILEGES;
SQL
```

Verify connection:
```bash
mysql -u crackjee -p'YOUR_STRONG_DB_PASSWORD' -h 127.0.0.1 -e "SHOW DATABASES;"
```

---

### Step 3: Clone Repository & Configure Production `.env`

```bash
cd ~
git clone https://github.com/iam-orsu/CrackJEE.git
cd CrackJEE

cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Generate a 64-character JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Edit `backend/.env` (`nano backend/.env`):
```env
NODE_ENV=production
PORT=3001
LOG_LEVEL=info
FRONTEND_URL=https://jeeneet.ai
EXTRA_CORS_ORIGINS=https://www.jeeneet.ai

DATABASE_URL="mysql://crackjee:YOUR_STRONG_DB_PASSWORD@127.0.0.1:3306/jeeneet"
DB_CONNECTION_LIMIT=10
DB_FANOUT_CONCURRENCY=5

JWT_SECRET=YOUR_64_CHAR_HEX_SECRET

DEEPSEEK_API_KEY=your_deepseek_api_key_or_leave_empty
DEEPSEEK_CONCURRENCY=6
DEEPSEEK_CIRCUIT_FAILURE_THRESHOLD=5
DEEPSEEK_CIRCUIT_COOLDOWN_MS=300000

# Superadmin credentials for /superadmin
SUPERADMIN_EMAIL=admin@crackjee.com
SUPERADMIN_PASSWORD_HASH=$2b$10$0qT/0ARRyR3CxTHuSyY5cecUxSyhdzWJiYJ5t.tB8WZk/BJhtKwR2
```

> **Note:** The hash above corresponds to password `admin@123`. You can generate a custom bcrypt hash by running:  
> `cd backend && node -e "require('bcrypt').hash('your_password', 10).then(console.log)"`

---

### Step 4: Install Dependencies, Migrate Database, Build & Seed

```bash
# 1. Setup Backend: install deps, run migrations, compile TS, seed questions
cd ~/CrackJEE/backend
npm ci
npm run db:generate
npm run db:migrate
npm run build
npm run db:seed

# 2. Setup Frontend: install deps and compile production Next.js build
cd ~/CrackJEE/frontend
npm ci
npm run build
```

---

### Step 5: Start Applications with PM2

```bash
cd ~/CrackJEE

# Start backend and frontend defined in ecosystem.config.cjs
pm2 start ecosystem.config.cjs

# Save PM2 process list so it survives reboots
pm2 save

# Setup PM2 systemd startup hook
pm2 startup
```
*(Copy and execute the `sudo env PATH=...` command that `pm2 startup` displays in the terminal).*

---

### Step 6: Configure Nginx Reverse Proxy & SSL

1. Create Nginx site configuration:
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
    client_max_body_size 10m;

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
```

2. Enable the site and test Nginx configuration:
```bash
sudo ln -sf /etc/nginx/sites-available/jeeneet.conf /etc/nginx/sites-enabled/jeeneet.conf
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

3. Obtain Let's Encrypt SSL certificate (HTTPS):
```bash
sudo certbot --nginx -d jeeneet.ai -d www.jeeneet.ai
```

4. Verify live production health:
```bash
curl -s https://jeeneet.ai/health && echo ""
```

---

## 🔄 Part 3: Deploying Updates (Production)

Whenever you push new code to `main`, run this block on your EC2 server to pull, migrate, rebuild, and reload:

```bash
cd ~/CrackJEE
git pull origin main

# Backend update
cd ~/CrackJEE/backend
npm ci && npm run db:generate && npm run db:migrate && npm run build

# Frontend update
cd ~/CrackJEE/frontend
npm ci && npm run build

# Reload PM2 processes with updated env
cd ~/CrackJEE
pm2 restart ecosystem.config.cjs --update-env
pm2 status
curl -s https://jeeneet.ai/health && echo ""
```

---

## 📌 Useful Server Cheatsheet

| Task | Command |
| :--- | :--- |
| **Check PM2 process status** | `pm2 status` |
| **View live logs** | `pm2 logs` |
| **Restart backend only** | `pm2 restart jeeneet-backend --update-env` |
| **Restart frontend only** | `pm2 restart jeeneet-frontend --update-env` |
| **Test Nginx config** | `sudo nginx -t` |
| **Reload Nginx** | `sudo systemctl reload nginx` |
| **Check MySQL service** | `sudo systemctl status mysql` |
| **Access MySQL CLI** | `sudo mysql -u crackjee -p jeeneet` |
| **Check platform health** | `curl -s https://jeeneet.ai/health` |
