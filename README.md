# CrackJEE

A free AI-powered preparation platform for JEE Main and Advanced. CrackJEE generates unique questions on every session, validates them for correctness, tracks your weak areas automatically, and surfaces exactly where you need to focus.

## Features

- **AI-generated questions** - Every question is freshly generated per the JEE syllabus and validated before you see it
- **Full exam mode** - Full-screen timed practice sessions with a question palette, just like the real exam
- **Syllabus-aware** - Class 11 students get Class 11 topics only; Class 12 students get the full syllabus
- **Weak area detection** - Topics where your accuracy drops below 60% are flagged automatically
- **Never repeat** - Per-user question tracking ensures you never see the same question twice
- **Progress dashboard** - Weekly chart, subject accuracy breakdown, and topic-level stats

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, React 19, TypeScript |
| Backend | Node.js, Express, TypeScript, Zod |
| Database | PostgreSQL 16, Prisma 6 ORM |
| Cache | Redis 7 |
| AI | DeepSeek (question generation), OpenAI (validation) |
| Infrastructure | Docker Compose, Nginx |

## Prerequisites

- Docker and Docker Compose (v2)
- A DeepSeek API key
- An OpenAI API key (or a compatible proxy)

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/iam-orsu/CrackJEE.git
cd CrackJEE

# 2. Copy the example env file and fill in your keys
cp .env.example .env
# Edit .env with your DEEPSEEK_API_KEY, OPENAI_API_KEY, and JWT_SECRET

# 3. Start everything with one command
./deploy.sh start
```

The platform will be available at `http://localhost:8080`.

On first run, Docker builds all images, runs database migrations, and starts all services. This takes a few minutes. Subsequent starts are fast.

## Configuration

Copy `.env.example` to `.env` and set these required values:

```env
# Required
DEEPSEEK_API_KEY=sk-...        # DeepSeek API key for question generation
OPENAI_API_KEY=sk-...          # OpenAI API key for question validation
JWT_SECRET=<random 64 chars>   # Secret for signing JWTs — generate with: openssl rand -hex 32

# Optional — override defaults only if needed
POSTGRES_USER=jeeuser
POSTGRES_PASSWORD=jeepassword
OPENAI_BASE_URL=               # Custom OpenAI-compatible proxy URL
OPENAI_MODEL=gpt-4o-mini
```

The `DATABASE_URL` and `REDIS_URL` in `.env.example` already point to the Docker service names and work out of the box.

## Deploy Commands

The `deploy.sh` script wraps Docker Compose:

```bash
./deploy.sh start    # Build and start all services
./deploy.sh stop     # Stop all services, keep data volumes
./deploy.sh restart  # Restart without rebuilding
./deploy.sh logs     # Tail all logs
./deploy.sh logs backend   # Tail logs for a specific service
./deploy.sh status   # Show container health
./deploy.sh delete   # Stop and delete all data (irreversible)
```

## Architecture

```
Browser
  |
  v
Nginx :8080
  |-- /api/*  --> Backend (Express :3001)
  |-- /*      --> Frontend (Next.js :3000)

Backend
  |-- PostgreSQL (user data, questions, attempts, progress)
  |-- Redis (question cache, per-user deduplication)
  |-- DeepSeek API (question generation)
  |-- OpenAI API (validation)
```

### Question generation flow

```
Student starts session
  -> Choose subjects, topics, count, difficulty
  -> Backend calls DeepSeek in parallel (up to 3 concurrent) per topic
  -> Each question validated by OpenAI (pass/fail)
  -> Results cached in Redis keyed by topic + difficulty
  -> Per-user served-question keys prevent repeats
  -> Batch returned to frontend, exam starts immediately
```

### Answer validation flow

```
Student submits answer
  -> Compare against stored correct answer
  -> If wrong, DeepSeek explanation fetched
  -> TopicProgress updated atomically (attempts, correct count)
  -> If success rate < 60% over 5+ attempts, topic flagged as weak
```

## API Reference

All endpoints are under `/api`. Auth endpoints require no token; all others require `Authorization: Bearer <token>`.

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Log in, get JWT |
| GET | `/api/auth/me` | Current user info |
| GET | `/api/questions/next` | Fetch one question |
| POST | `/api/questions/batch` | Fetch a batch of questions |
| POST | `/api/answers/submit` | Submit answer, get feedback |
| GET | `/api/user/dashboard` | Dashboard stats |
| GET | `/api/progress/weak-areas` | Weak topics list |
| GET | `/api/stats/overview` | All topic progress |

## Project Structure

```
CrackJEE/
  backend/
    src/
      controllers/    # Route handlers (auth, questions, answers, progress)
      middleware/     # Auth, rate limiting, error handling
      routes/         # Express router definitions
      services/       # Business logic (DeepSeek, OpenAI, question caching)
      types/          # Shared TypeScript interfaces
      lib/            # Prisma client, Redis client, logger
    prisma/
      schema.prisma   # Database schema
  frontend/
    src/
      app/            # Next.js App Router pages
      components/     # Sidebar, QuestionCard
      lib/            # API client, auth helpers
      types/          # Shared frontend types
  nginx/
    nginx.conf        # Reverse proxy config with rate limiting
  docker-compose.yml
  deploy.sh
  .env.example
```

## Database Schema

The Prisma schema defines four models:

- **User** - email/password auth, class (11/12/Dropper), target exam
- **Question** - generated question text, options, answer, explanation, topic metadata
- **StudentAttempt** - each answer submission with correctness and time spent
- **TopicProgress** - per-user per-topic accuracy aggregate, weak-area flag

## Security

- Passwords hashed with bcrypt (cost 12)
- JWTs expire after 7 days
- Nginx rate limits: 30 req/min on `/api/`, 5 req/min on `/api/auth/`
- Helmet sets standard security headers
- All secrets loaded from environment variables, never hard-coded
- `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff` headers set by Nginx

## License

MIT
