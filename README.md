# JEENEET.ai

JEENEET.ai is an open-source test practice platform for students preparing for JEE Main, JEE Advanced and NEET UG. It runs full simulated exams, custom topic tests, tracks student accuracy, and provides instant answer keys with explanations.

The platform is containerized with Docker and ready to deploy on any Linux VPS or local machine.

---

## Core Features

- **JEE Main and Advanced Exam Modes**: Full timed mock tests matching the real exam pattern across Physics, Chemistry, and Mathematics.
- **Custom Practice Mode**: Students can build custom tests by subject, topic, question count, and difficulty.
- **Topic Distribution Logic**: Practice tests balance question selection across selected topics (1 to 2 questions per topic when available).
- **Randomized Question Order**: Questions are randomized per student while preserving section order.
- **Accuracy and Weak Area Tracking**: Logs every attempt, calculates topic-level accuracy, and flags topics below 60% accuracy for revision.
- **Non-Destructive Question Seeding**: Fast seeding tool to import thousands of questions from JSON without duplicating or deleting existing records.
- **Formula Sheets and Review**: Question palette, mark for review, question timers, and reference sheets.
- **Optional AI Integration**: DeepSeek and OpenAI integrations for dynamic question generation and validation if desired.

---

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript, Prisma ORM
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **Reverse Proxy**: Nginx (serves frontend and proxies `/api` requests)
- **Deployment**: Docker Compose

---

## Architecture Overview

```
Client Browser
      │
      ▼
Nginx (:80)
  ├── /api/*   ──> Express Backend (:3001)
  └── /*       ──> Next.js Frontend (:3000)

Backend Connections:
  ├── PostgreSQL (:5432) : User accounts, questions, attempts, test results
  ├── Redis (:6379)      : Session cache and rate limiting
  └── ./data volume      : Read-only mount for question JSON files
```

---

## System Requirements for VPS

- **Operating System**: Ubuntu 22.04 LTS, Ubuntu 24.04 LTS, or Debian 12
- **Memory**: Minimum 2 GB RAM (4 GB recommended)
- **Disk Space**: At least 10 GB free disk space
- **Installed Packages**: Docker and Docker Compose v2, Git

To install Docker and Git on a fresh Ubuntu VPS:

```bash
sudo apt update && sudo apt install -y git curl
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
```

Log out and log back into your VPS terminal after running this command so group permissions take effect.

---

## Deploying to a VPS

### 1. Clone the repository

```bash
git clone https://github.com/iam-orsu/CrackJEE.git
cd CrackJEE
```

### 2. Configure environment variables

Create your `.env` file from the example template:

```bash
cp .env.example .env
```

Open `.env` and set your values:

```bash
nano .env
```

Minimum settings to check:
- `JWT_SECRET`: Put a random secret string here (generate with `openssl rand -hex 32`).
- `POSTGRES_USER` and `POSTGRES_PASSWORD`: Set strong database credentials.
- `DEEPSEEK_API_KEY` and `OPENAI_API_KEY`: Add your keys if using AI generation features (optional for offline question bank mode).

### 3. Start the application

Make the deploy script executable and start the stack:

```bash
chmod +x deploy.sh
./deploy.sh start
```

This command will:
- Build the frontend and backend Docker images.
- Run all Prisma database migrations automatically.
- Start PostgreSQL, Redis, backend, frontend, and Nginx.

Once finished, open your browser and go to `http://your-server-ip` (port 80, no port number needed).

---

## VPS Management Commands

The `./deploy.sh` script handles day-to-day operations:

### Check status of services
```bash
./deploy.sh status
```

### View container logs
View logs from all containers:
```bash
./deploy.sh logs
```
Or view logs from a specific container:
```bash
./deploy.sh logs backend
./deploy.sh logs frontend
./deploy.sh logs nginx
```

### Restart the application
To restart all services on the VPS:
```bash
./deploy.sh restart
```

### Stop the application
To stop containers while keeping all database data safe in Docker volumes:
```bash
./deploy.sh stop
```

### Update the application with new code
When pulling updates from Git:
```bash
git pull origin main
./deploy.sh restart
```

### Complete wipe (dangerous)
To stop containers and permanently delete all database records and volumes:
```bash
./deploy.sh delete
```

---

## Seeding Questions

The platform includes a safe, non-destructive question seeder.

### How the seeder works
- Automatic on container start: When the backend container starts up, it automatically seeds `data/master_questions.json`.
- Manual or on-demand: You can run `./deploy.sh seed` at any time to import new questions or custom files.
- Safe and non-destructive: It checks question IDs against the database. Any existing question is left completely untouched. Only new questions are inserted into PostgreSQL.
- Instant availability: Newly seeded questions are live in tests immediately without needing a container restart.

### Seed the default question bank manually
To check for new questions in `data/master_questions.json` and insert them:

Run:
```bash
./deploy.sh seed
```

Output example:
```
[seed] Reading question bank from: /app/data/master_questions.json
[seed] Checking existing database records...
[seed] Database currently contains: 5799 questions.
[seed] Total questions in JSON:   5800
[seed] Already in DB (untouched):  5799
[seed] New to be inserted:         1
[seed] Starting insertion of 1 new questions...
[seed] Insert progress: 1 / 1
[seed] Seeding complete!
```

### Seed a custom JSON file
You can import custom batches of questions (for example, 500 new physics questions).

1. Copy your JSON file into the `data/` folder on your server:
   ```bash
   cp /path/to/my_new_questions.json data/my_new_questions.json
   ```

2. Run the seed command with the path to your file:
   ```bash
   ./deploy.sh seed data/my_new_questions.json
   ```

The script automatically mounts the `data/` folder inside the backend container and runs the import.

---

## Question JSON Format

Your custom JSON file can be either an object with a `"questions"` array or a root array.

Example format:

```json
{
  "questions": [
    {
      "id": "chem_thermo_001",
      "subject": "CHEMISTRY",
      "topic": "Thermodynamics",
      "type": "SINGLE_CHOICE",
      "difficulty": "MEDIUM",
      "class": "CLASS_11",
      "content": "Which of the following is an intensive property?",
      "options": [
        "Volume",
        "Mass",
        "Enthalpy",
        "Temperature"
      ],
      "correctAnswer": "Temperature",
      "explanation": "Temperature is an intensive property because it does not depend on the amount of matter in the system."
    },
    {
      "id": "phy_kinematics_002",
      "subject": "PHYSICS",
      "topic": "Kinematics",
      "type": "NUMERICAL",
      "difficulty": "EASY",
      "class": "CLASS_11",
      "content": "A car accelerates uniformly from rest to 20 m/s in 5 seconds. What is its acceleration in m/s^2?",
      "options": [],
      "correctAnswer": "4",
      "explanation": "Acceleration a = (v - u) / t = (20 - 0) / 5 = 4 m/s^2."
    }
  ]
}
```

### Field values
- **subject**: `PHYSICS`, `CHEMISTRY`, or `MATHEMATICS`
- **type**: `SINGLE_CHOICE` or `NUMERICAL`
- **difficulty**: `EASY`, `MEDIUM`, or `HARD`
- **class**: `CLASS_11` or `CLASS_12`
- **options**: Array of 4 option strings for `SINGLE_CHOICE`, or empty array `[]` for `NUMERICAL`.

---

## Production Security Notes

- Keep `.env` out of version control.
- In production, place Nginx behind your own SSL certificate (such as Certbot or Cloudflare).
- Set firewall rules on your VPS (allow ports 22, 80, 443; keep internal database ports 5432 and 6379 closed to the public).
- Make regular backups of the PostgreSQL Docker volume `crackjee_postgres_data`.

---

## License

MIT License.
