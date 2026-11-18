# JEENEET.ai

Practice and CBT mock exam platform for **JEE Main**, **JEE Advanced**, and **NEET UG**, featuring adaptive question generation, weak-area analytics, faculty paper studios, and psychometric evaluation.

---

## Tech Stack

* **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
* **Backend:** Node.js, Express, TypeScript (layered architecture), Prisma ORM
* **Database & Cache:** MySQL 8+, optional Redis (falls back to built-in in-memory TTL cache)
* **Production Deployment:** PM2 Process Manager, Nginx Reverse Proxy, Let's Encrypt SSL

---

## Part 1: Local Development Setup (From Scratch)

### Prerequisites
* Node.js `>= 20` (Node 20 or 22 LTS recommended)
* Ubuntu, Debian, WSL2 (Windows Subsystem for Linux), or macOS

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

### Step 3: Clone Repository & Setup Environment Files

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

# Optional: DeepSeek API Key (Leave empty to use built-in question bank)
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

### Step 5: (Optional) Create a Faculty Mentor Account

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

## Part 2: Production Deployment on Ubuntu / AWS EC2 (Step-by-Step)

Follow these exact steps to deploy on a clean Ubuntu 22.04 / 24.04 LTS server or AWS EC2 instance.

---

### Step 1: Install Required System Packages

Run on your fresh server:

```bash
# 1. Update OS packages
sudo apt update && sudo apt upgrade -y

# 2. Install base system utilities, Nginx, MySQL, and Certbot
sudo apt install -y curl ca-certificates git nginx mysql-server certbot python3-certbot-nginx chromium-browser

# 3. Install Node.js 22 LTS
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# 4. Install PM2 process manager globally
sudo npm install -g pm2

# 5. Verify installations
node -v && npm -v && pm2 -v && nginx -v && mysql --version && chromium-browser --version
```

---

### Step 2: Configure Production MySQL (Tuned for Concurrency)

1. Tune MySQL configuration for high concurrency (e.g. 1,000+ active students taking tests).  
   Edit `/etc/mysql/mysql.conf.d/mysqld.cnf` or `/etc/mysql/my.cnf`:
   ```bash
   sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
   ```
   Add or update these directives under `[mysqld]`:
   ```ini
   [mysqld]
   max_connections = 500
   innodb_buffer_pool_size = 2G
   wait_timeout = 600
   interactive_timeout = 600
   ```

2. Restart and enable MySQL:
   ```bash
   sudo systemctl restart mysql
   sudo systemctl enable mysql
   ```

3. Create the database and dedicated application user:
   ```bash
   sudo mysql <<'SQL'
   CREATE DATABASE IF NOT EXISTS jeeneet CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

   CREATE USER IF NOT EXISTS 'crackjee'@'127.0.0.1' IDENTIFIED BY 'YOUR_STRONG_DB_PASSWORD';
   GRANT ALL PRIVILEGES ON jeeneet.* TO 'crackjee'@'127.0.0.1';

   CREATE USER IF NOT EXISTS 'crackjee'@'localhost' IDENTIFIED BY 'YOUR_STRONG_DB_PASSWORD';
   GRANT ALL PRIVILEGES ON jeeneet.* TO 'crackjee'@'localhost';

   FLUSH PRIVILEGES;
   SQL
   ```

4. Test MySQL connection:
   ```bash
   mysql -u crackjee -p'YOUR_STRONG_DB_PASSWORD' -h 127.0.0.1 -e "SHOW DATABASES;"
   ```

---

### Step 3: Clone the Repository

```bash
cd ~
git clone https://github.com/iam-orsu/CrackJEE.git
cd CrackJEE
```

---

### Step 4: Configure Production Environment Variables

1. Copy the template files:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env.local
   ```

2. Generate a secure 64-character random secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. Edit `backend/.env` (`nano backend/.env`):
   ```env
   NODE_ENV=production
   PORT=3001
   LOG_LEVEL=info
   FRONTEND_URL=https://jeeneet.ai
   EXTRA_CORS_ORIGINS=https://www.jeeneet.ai

   # Database connection with connection pool limit and timeout
   DATABASE_URL="mysql://crackjee:YOUR_STRONG_DB_PASSWORD@127.0.0.1:3306/jeeneet?connection_limit=50&pool_timeout=30"
   DB_CONNECTION_LIMIT=50
   DB_FANOUT_CONCURRENCY=5

   # Security
   JWT_SECRET=YOUR_64_CHAR_HEX_SECRET_FROM_STEP_2

   # DeepSeek AI (Optional: leave empty to use built-in question bank)
   DEEPSEEK_API_KEY=your_deepseek_api_key_or_leave_empty
   DEEPSEEK_CONCURRENCY=6
   DEEPSEEK_CIRCUIT_FAILURE_THRESHOLD=5
   DEEPSEEK_CIRCUIT_COOLDOWN_MS=300000

   # Redis (Optional: enable for multi-instance distributed caching)
   # REDIS_URL=redis://127.0.0.1:6379

   # Superadmin credentials for /superadmin
   SUPERADMIN_EMAIL=admin@crackjee.com
   SUPERADMIN_PASSWORD_HASH=$2b$10$0qT/0ARRyR3CxTHuSyY5cecUxSyhdzWJiYJ5t.tB8WZk/BJhtKwR2
   ```

4. Edit `frontend/.env.local` (`nano frontend/.env.local`):
   ```env
   NEXT_PUBLIC_API_URL=https://jeeneet.ai/api/v1
   ```

---

### Step 5: Install Dependencies, Migrate Database & Build Applications

1. Build backend:
   ```bash
   cd ~/CrackJEE/backend
   npm ci
   npm run db:generate
   npm run db:migrate
   npm run build
   npm run db:seed
   ```

2. Build frontend:
   ```bash
   cd ~/CrackJEE/frontend
   npm ci
   npm run build
   ```

---

### Step 6: Verify Chromium & PDF Engine (Server-Side)

Faculty paper PDF exports run headless Chromium on the server.
Verify that Chromium runs without missing library errors:
```bash
chromium-browser --version --no-sandbox
```
If you ever need to clean the Puppeteer cache or reinstall pinned Chrome:
```bash
rm -rf ~/.cache/puppeteer
cd ~/CrackJEE/backend && npx puppeteer browsers install chrome
```

---

### Step 7: Launch Applications with PM2

Start both frontend and backend using PM2:

```bash
cd ~/CrackJEE

# Start applications defined in ecosystem.config.cjs
pm2 start ecosystem.config.cjs

# Save PM2 process list so it automatically restarts on server reboot
pm2 save

# Setup systemd startup hook
pm2 startup
```
*(Copy and run the `sudo env PATH=...` command that `pm2 startup` displays in your terminal).*

Check that both processes are online:
```bash
pm2 status
```

---

### Step 8: Configure Nginx Reverse Proxy & SSL Certificate

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

2. Enable the site and reload Nginx:
   ```bash
   sudo ln -sf /etc/nginx/sites-available/jeeneet.conf /etc/nginx/sites-enabled/jeeneet.conf
   sudo rm -f /etc/nginx/sites-enabled/default
   sudo nginx -t && sudo systemctl reload nginx
   ```

3. Obtain Let's Encrypt SSL certificate:
   ```bash
   sudo certbot --nginx -d jeeneet.ai -d www.jeeneet.ai
   ```

4. Verify live deployment:
   ```bash
   curl -s https://jeeneet.ai/health && echo ""
   ```

---

## Part 3: Deploying Updates (Zero-Downtime)

Whenever you push new code to `main`, run this block on your server to pull, rebuild, and reload:

```bash
cd ~/CrackJEE
git pull origin main

# Backend update
cd ~/CrackJEE/backend
npm ci && npm run db:generate && npm run db:migrate && npm run build

# Frontend update
cd ~/CrackJEE/frontend
npm ci && npm run build

# Reload PM2 processes with updated environment
cd ~/CrackJEE
pm2 restart ecosystem.config.cjs --update-env
pm2 status
curl -s https://jeeneet.ai/health && echo ""
```

---

## Part 4: High-Scale Tuning Guide (1,000+ Concurrent Students)

When running institutional or multi-batch exams where 1,000+ students are simultaneously answering questions:

| Component | Setting | Recommendation |
| :--- | :--- | :--- |
| **MySQL `max_connections`** | `/etc/mysql/mysql.conf.d/mysqld.cnf` | Set `max_connections = 500` (default 151). |
| **Node Connection Pool** | `backend/.env` | Set `DB_CONNECTION_LIMIT=50` and append `&pool_timeout=30` to `DATABASE_URL`. |
| **Node Cluster Mode** | PM2 Process Manager | Run backend with `pm2 start dist/server.js -i max --name jeeneet-backend` to utilize all CPU cores. |
| **Distributed Cache** | `backend/.env` | Set `REDIS_URL=redis://127.0.0.1:6379` so rate limits and caches are shared across cluster workers. |
| **Express Body Limit** | Built-in | Hardened to `2mb` to easily support 180-question submissions and bulk rosters. |

---

## Part 5: Faculty Portal — Bulk Student Upload via CSV

Faculty members can create student accounts one-by-one or import dozens/hundreds of students at once using a `.csv` file.

### How to Import Students in Bulk
1. Log in to the Faculty Portal at **`/faculty`**.
2. Navigate to **Batches & Students** and click **"+ Add Student"**.
3. Select the **"Bulk Upload (CSV)"** tab.
4. *(Optional)* Click **"Download Sample CSV"** to download a ready-to-fill template.
5. Upload or drag-and-drop your `.csv` file. The portal parses and previews all valid student records and highlights any formatting errors.
6. Select the target batch from the dropdown (or specify batch codes in the CSV) and click **"Create Students"**.

---

### CSV File Format & Specification

Create a standard comma-separated `.csv` file with the following header row:

```csv
name,rollNumber,email,password,batchCode
Sumanth Varma,JEE-2026-042,sumanth@example.com,Welcome@123,TARGET-26
Priya Sharma,JEE-2026-043,priya@example.com,Welcome@123,TARGET-26
Rahul Reddy,JEE-2026-044,,,TARGET-26
Ananya Patel,NEET-2026-015,ananya@example.com,Pass@456,NEET-CRACK
```

#### Column Reference:

| Column Header | Required? | Description & Rules |
| :--- | :--- | :--- |
| **`name`** | **Yes** | Full name of the student (e.g. `Sumanth Varma`). |
| **`rollNumber`** | **Yes** | Unique student roll number or institutional ID (e.g. `JEE-2026-042`). Used by the student as their login username. |
| **`email`** | No | Registered email address (e.g. `sumanth@example.com`). Can be left blank. |
| **`password`** | No | Initial login password. **If left blank, the student's password automatically defaults to their `rollNumber`**. |
| **`batchCode`** | No | The target batch code (e.g. `TARGET-26`). If omitted in the CSV row, the student is assigned to the batch currently selected in the portal dropdown. |

> **Flexible Header Aliases:** The CSV parser also recognizes common variations such as `student_name` or `fullName` for `name`, `roll_no` or `roll` for `rollNumber`, and `batch` for `batchCode`.

---

## Useful Server Cheatsheet

| Task | Command |
| :--- | :--- |
| **Check PM2 process status** | `pm2 status` |
| **View live logs** | `pm2 logs` *(or `pm2 logs jeeneet-backend --lines 20`)* |
| **Restart backend only** | `pm2 restart jeeneet-backend --update-env` |
| **Restart frontend only** | `pm2 restart jeeneet-frontend --update-env` |
| **Install / Fix PDF Chromium** | `sudo apt install -y chromium-browser` |
| **Test Nginx config** | `sudo nginx -t` |
| **Reload Nginx** | `sudo systemctl reload nginx` |
| **Check MySQL service** | `sudo systemctl status mysql` |
| **Access MySQL CLI** | `sudo mysql -u crackjee -p jeeneet` |
| **Check platform health** | `curl -s https://jeeneet.ai/health` |
