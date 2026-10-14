#!/bin/bash
set -e

ACTION=${1:-start}
ENV_FILE=".env"

if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: .env file not found. Copy .env.example to .env and fill in values."
  exit 1
fi

# ── Wait until postgres is healthy ────────────────────────────────────────────
wait_postgres() {
  echo "  Waiting for PostgreSQL to be ready..."
  local attempts=0
  until docker compose --env-file "$ENV_FILE" exec -T postgres \
      pg_isready -U "${POSTGRES_USER:-jeeuser}" -d "${POSTGRES_DB:-jeedb}" \
      >/dev/null 2>&1; do
    attempts=$((attempts + 1))
    if [ $attempts -ge 30 ]; then
      echo "  ERROR: PostgreSQL did not become ready in time."
      exit 1
    fi
    sleep 2
  done
  echo "  PostgreSQL is ready."
}

# ── Wait until backend container is running ───────────────────────────────────
wait_backend() {
  echo "  Waiting for backend container to start..."
  local attempts=0
  until docker compose --env-file "$ENV_FILE" ps backend \
      | grep -q "running\|Up"; do
    attempts=$((attempts + 1))
    if [ $attempts -ge 20 ]; then
      echo "  ERROR: Backend container did not start in time."
      exit 1
    fi
    sleep 3
  done
  echo "  Backend container is running."
}

# ── Run database migrations ───────────────────────────────────────────────────
# Uses prisma db push (schema sync without migration files).
# This is idempotent — safe to run on every deploy.
run_migrations() {
  echo ""
  echo "Running database migrations..."
  wait_postgres

  # Source .env so POSTGRES_USER is available for the wait_postgres check
  # Migration itself runs inside the backend container which already has DATABASE_URL
  docker compose --env-file "$ENV_FILE" exec -T backend \
    sh -c "node_modules/.bin/prisma db push --skip-generate 2>&1"

  echo "Migrations complete."
}

case "$ACTION" in
  start)
    echo "Starting CrackJEE platform..."
    docker compose --env-file "$ENV_FILE" up -d --build
    run_migrations
    echo ""
    echo "All done. Services are up."
    echo "  Watch logs:   ./deploy.sh logs"
    echo "  Check status: ./deploy.sh status"
    echo "  Access at:    http://localhost:8080"
    ;;

  restart)
    echo "Rebuilding and restarting CrackJEE platform..."
    docker compose --env-file "$ENV_FILE" down
    docker compose --env-file "$ENV_FILE" up -d --build
    run_migrations
    echo ""
    echo "Restart complete."
    echo "  Watch logs:   ./deploy.sh logs"
    echo "  Access at:    http://localhost:8080"
    ;;

  migrate)
    # Explicit migration run — useful after pulling new schema changes.
    # Connects to the running backend container and runs prisma db push.
    echo "Running database migrations against running containers..."
    run_migrations
    ;;

  seed)
    # Manually re-seed the question bank.
    # Reads data/master_questions.json or any custom json path passed as an argument.
    # Checks existing IDs and guarantees existing questions are left 100% untouched.
    RAW_PATH=${2:-"data/master_questions.json"}
    if [[ "$RAW_PATH" == data/* ]]; then
      CONTAINER_PATH="/app/$RAW_PATH"
    elif [[ "$RAW_PATH" != /* ]]; then
      CONTAINER_PATH="/app/data/$RAW_PATH"
    else
      CONTAINER_PATH="$RAW_PATH"
    fi

    echo "Seeding question bank into database from $RAW_PATH..."
    wait_backend
    docker compose --env-file "$ENV_FILE" exec -T backend \
      sh -c "node dist/scripts/seedQuestions.js '$CONTAINER_PATH' 2>&1"
    echo "Seeding complete."
    ;;

  stop)
    echo "Stopping CrackJEE platform..."
    docker compose --env-file "$ENV_FILE" down
    ;;

  delete)
    echo "WARNING: This will delete all containers and data volumes."
    read -p "Are you sure? (yes/no): " confirm
    if [ "$confirm" = "yes" ]; then
      docker compose --env-file "$ENV_FILE" down -v
      echo "All containers and volumes deleted."
    else
      echo "Aborted."
    fi
    ;;

  logs)
    SERVICE=${2:-""}
    docker compose --env-file "$ENV_FILE" logs -f $SERVICE
    ;;

  status)
    docker compose --env-file "$ENV_FILE" ps
    ;;

  *)
    echo "Usage: ./deploy.sh [start|restart|stop|delete|logs|status|migrate|seed]"
    echo "  start   - Build and start all services (runs migrations + seeds question bank automatically)"
    echo "  restart - Rebuild images and restart all services (runs migrations + seeds automatically)"
    echo "  migrate - Run database migrations against running containers"
    echo "  seed    - Import questions without touching existing ones (usage: ./deploy.sh seed [path/to/file.json])"
    echo "  stop    - Stop all services (keep data)"
    echo "  delete  - Stop and delete all data volumes"
    echo "  logs    - Tail logs (optionally pass service name: ./deploy.sh logs backend)"
    echo "  status  - Show service status"
    exit 1
    ;;
esac
