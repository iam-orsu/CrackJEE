#!/bin/bash
set -euo pipefail

ACTION=${1:-start}
ENV_FILE=".env"

if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: .env file not found. Copy .env.example to .env and fill in values."
  exit 1
fi

# Read a single value from .env (strips quotes and CR characters)
env_value() {
  grep -E "^$1=" "$ENV_FILE" | tail -n1 | cut -d= -f2- | tr -d '"\r' || true
}

# ── Check VPS_IP is set to a real address ─────────────────────────────────────
require_vps_ip() {
  VPS_IP=$(env_value VPS_IP)
  if [ -z "$VPS_IP" ] || [ "$VPS_IP" = "YOUR_VPS_PUBLIC_IP" ]; then
    echo "ERROR: VPS_IP is not set in .env. Set it to your VPS public IP, e.g. VPS_IP=203.0.113.10"
    exit 1
  fi
  export VPS_IP
  echo "  Server address: https://$VPS_IP"
}

# ── Stop our own stack, then free ports 80 and 443 from anything else ────────
free_port_80() {
  echo ""
  echo "Freeing ports 80 and 443..."

  # 1) Containers from any compose project that publish port 80
  local ids
  ids=$(docker ps -q --filter "publish=80" 2>/dev/null || true)
  if [ -n "$ids" ]; then
    echo "  Removing containers on port 80: $ids"
    docker rm -f $ids >/dev/null 2>&1 || true
  fi

  # 2) Host web servers that are installed as system services
  for svc in nginx apache2 httpd caddy; do
    if systemctl is-active --quiet "$svc" 2>/dev/null; then
      echo "  Stopping host service: $svc"
      systemctl stop "$svc" 2>/dev/null || true
      systemctl disable "$svc" 2>/dev/null || true
    fi
  done

  # 3) Any other process still listening on port 80
  if command -v fuser >/dev/null 2>&1; then
    fuser -k -9 80/tcp >/dev/null 2>&1 || true
  elif command -v lsof >/dev/null 2>&1; then
    lsof -ti :80 2>/dev/null | xargs -r kill -9 2>/dev/null || true
  fi

  sleep 2

  # 4) Verify port 80 is now free
  if ss -ltn 2>/dev/null | awk '{print $4}' | grep -qE '(:|\.)80$'; then
    echo "ERROR: port 80 is still in use after cleanup. Check with: sudo ss -ltnp | grep ':80 '"
    exit 1
  fi
  echo "  Port 80 is free."
}

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

# ── Wait until backend is fully ready (migrations + seeding done) ────────────
# Polls the /health endpoint inside the backend container — no host curl/wget needed.
# First deploy with 5000+ questions can take up to 3 minutes; subsequent ~30s.
wait_ready() {
  echo ""
  echo "  Waiting for backend to finish initializing..."
  echo "  (first deploy: up to 3 min for question seeding — subsequent deploys: ~30 sec)"
  local attempts=0
  while [ $attempts -lt 48 ]; do
    if docker compose --env-file "$ENV_FILE" exec -T backend \
        wget -qO- http://127.0.0.1:3001/health >/dev/null 2>&1; then
      echo "  Backend is ready."
      return 0
    fi
    attempts=$((attempts + 1))
    elapsed=$(( attempts * 5 ))
    if [ $(( attempts % 6 )) -eq 0 ]; then
      echo "  ... still initializing (${elapsed}s elapsed)"
    fi
    sleep 5
  done
  echo ""
  echo "  WARNING: Backend did not become ready within 4 minutes."
  echo "  It may still be starting. Run: ./deploy.sh logs backend"
}

# ── Run database migrations ───────────────────────────────────────────────────
# Uses prisma migrate deploy — applies pending migration files in order.
# Safe to run on every deploy; never drops columns.
run_migrations() {
  echo ""
  echo "Running database migrations..."
  wait_postgres

  docker compose --env-file "$ENV_FILE" exec -T backend \
    sh -c "node_modules/.bin/prisma migrate deploy 2>&1"

  echo "Migrations complete."
}

# ── Ensure SSL certificates exist ─────────────────────────────────────────────
# ENABLE_SSL=false (default) → self-signed cert via docker alpine/openssl (no host deps)
# ENABLE_SSL=true            → Let's Encrypt via certbot standalone (requires DOMAIN + SSL_EMAIL)
ensure_ssl() {
  if [ -f "./nginx/ssl/fullchain.pem" ] && [ -f "./nginx/ssl/privkey.pem" ]; then
    echo "  SSL certificates already exist — skipping generation."
    return 0
  fi

  mkdir -p ./nginx/ssl

  local ENABLE_SSL
  local DOMAIN
  local SSL_EMAIL
  ENABLE_SSL=$(env_value ENABLE_SSL)
  DOMAIN=$(env_value DOMAIN)
  SSL_EMAIL=$(env_value SSL_EMAIL)

  # Fall back to VPS_IP if DOMAIN not set
  DOMAIN="${DOMAIN:-${VPS_IP:-localhost}}"

  if [ "${ENABLE_SSL:-false}" = "true" ]; then
    # ── Let's Encrypt via certbot ──────────────────────────────────────────────
    if [ -z "$SSL_EMAIL" ]; then
      echo "ERROR: SSL_EMAIL must be set in .env when ENABLE_SSL=true"
      echo "  e.g. SSL_EMAIL=admin@example.com"
      exit 1
    fi
    echo "  Obtaining Let's Encrypt certificate for $DOMAIN..."
    echo "  (port 80 must be open and pointing to this server)"
    mkdir -p ./certbot/conf ./certbot/www
    docker run --rm \
      -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
      -v "$(pwd)/certbot/www:/var/www/certbot" \
      -p 80:80 \
      certbot/certbot certonly --standalone \
      --domain "$DOMAIN" \
      --email "$SSL_EMAIL" \
      --agree-tos --no-eff-email --non-interactive
    cp "$(pwd)/certbot/conf/live/$DOMAIN/fullchain.pem" ./nginx/ssl/
    cp "$(pwd)/certbot/conf/live/$DOMAIN/privkey.pem"   ./nginx/ssl/
    echo "  Let's Encrypt certificate installed."
    echo "  Renew later with: ./deploy.sh renew-ssl"
  else
    # ── Self-signed via Docker (zero host dependencies) ────────────────────────
    echo "  Generating self-signed certificate for $DOMAIN..."
    docker run --rm \
      -v "$(pwd)/nginx/ssl:/ssl" \
      alpine/openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
      -keyout /ssl/privkey.pem \
      -out    /ssl/fullchain.pem \
      -subj "/C=IN/ST=India/L=City/O=CrackJEE/CN=$DOMAIN" 2>/dev/null
    echo "  Self-signed certificate created."
    echo "  For a trusted cert: set ENABLE_SSL=true, DOMAIN=yourdomain.com, SSL_EMAIL=you@example.com"
    echo "  Then run: ./deploy.sh ssl-setup"
  fi
}

print_access() {
  echo ""
  echo "Platform is live."
  echo "  Access at:    https://$VPS_IP"
  echo "  Watch logs:   ./deploy.sh logs"
  echo "  Check status: ./deploy.sh status"
}

case "$ACTION" in
  start)
    require_vps_ip
    echo "Starting CrackJEE platform..."
    docker compose --env-file "$ENV_FILE" down --remove-orphans >/dev/null 2>&1 || true
    free_port_80
    ensure_ssl
    docker compose --env-file "$ENV_FILE" up -d --build
    wait_ready
    print_access
    ;;

  restart)
    require_vps_ip
    echo "Rebuilding and restarting CrackJEE platform..."
    docker compose --env-file "$ENV_FILE" down --remove-orphans >/dev/null 2>&1 || true
    free_port_80
    ensure_ssl
    docker compose --env-file "$ENV_FILE" up -d --build
    wait_ready
    print_access
    ;;

  migrate)
    # Explicit migration run — useful after pulling new schema changes.
    echo "Running database migrations against running containers..."
    run_migrations
    ;;

  baseline)
    # Mark all existing migrations as already applied WITHOUT running them.
    # Use this once on a database that was set up with 'prisma db push' (before
    # this project switched to migration files). After running this command,
    # future deploys will apply only NEW migration files.
    #
    # Usage: ./deploy.sh baseline
    echo "Marking all migrations as applied (baseline for existing database)..."
    wait_backend
    docker compose --env-file "$ENV_FILE" exec -T backend \
      sh -c "node_modules/.bin/prisma migrate resolve --applied 20241001000000_init 2>&1 && \
             node_modules/.bin/prisma migrate resolve --applied 20241002000000_add_partial_count 2>&1"
    echo "Baseline complete. Run './deploy.sh migrate' to verify."
    ;;

  ssl-setup)
    # Force-generate SSL certificates (overwrites any existing ones).
    # ENABLE_SSL=false (default) → self-signed cert, good for IP-based access
    # ENABLE_SSL=true            → Let's Encrypt cert (requires real domain + open port 80)
    require_vps_ip
    echo "Setting up SSL certificates..."
    # Remove existing certs so ensure_ssl regenerates them
    rm -f ./nginx/ssl/fullchain.pem ./nginx/ssl/privkey.pem
    ensure_ssl
    echo ""
    echo "Certificates are at ./nginx/ssl/"
    echo "Restart the stack to apply: ./deploy.sh restart"
    ;;

  renew-ssl)
    # Renew an existing Let's Encrypt certificate using webroot mode (nginx stays up, zero downtime).
    # Run this every ~60 days or set up a cron job.
    # Nginx must already be running (webroot challenge is served via /.well-known/acme-challenge/).
    local ENABLE_SSL DOMAIN
    ENABLE_SSL=$(env_value ENABLE_SSL)
    DOMAIN=$(env_value DOMAIN)
    if [ "${ENABLE_SSL:-false}" != "true" ]; then
      echo "ENABLE_SSL is not true — nothing to renew (self-signed certs don't expire for 365 days)."
      exit 0
    fi
    if [ -z "$DOMAIN" ] || [ "$DOMAIN" = "YOUR_DOMAIN_OR_VPS_IP" ]; then
      echo "ERROR: DOMAIN must be set in .env for Let's Encrypt renewal."
      exit 1
    fi
    echo "Renewing Let's Encrypt certificate for $DOMAIN (webroot mode — nginx stays up)..."
    mkdir -p ./certbot/conf ./certbot/www
    docker run --rm \
      -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
      -v "$(pwd)/certbot/www:/var/www/certbot" \
      certbot/certbot renew --webroot -w /var/www/certbot --non-interactive
    cp "$(pwd)/certbot/conf/live/$DOMAIN/fullchain.pem" ./nginx/ssl/
    cp "$(pwd)/certbot/conf/live/$DOMAIN/privkey.pem"   ./nginx/ssl/
    echo "Certificate renewed. Reloading nginx..."
    docker compose --env-file "$ENV_FILE" exec -T nginx nginx -s reload
    echo "Done. Next renewal: run this command again in ~60 days."
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
    read -r -p "Are you sure? (yes/no): " confirm
    if [ "$confirm" = "yes" ]; then
      docker compose --env-file "$ENV_FILE" down -v
      echo "All containers and volumes deleted."
    else
      echo "Aborted."
    fi
    ;;

  logs)
    SERVICE=${2:-""}
    if [ -n "$SERVICE" ]; then
      docker compose --env-file "$ENV_FILE" logs -f "$SERVICE"
    else
      docker compose --env-file "$ENV_FILE" logs -f
    fi
    ;;

  status)
    docker compose --env-file "$ENV_FILE" ps
    ;;

  *)
    echo "Usage: ./deploy.sh [start|restart|stop|delete|logs|status|migrate|seed|baseline|ssl-setup|renew-ssl]"
    echo ""
    echo "  start      - Free port 80/443, generate SSL if needed, build and start all services"
    echo "  restart    - Stop, free port 80/443, rebuild and restart all services"
    echo "  stop       - Stop all services (keep data)"
    echo "  delete     - Stop and delete all data volumes"
    echo "  logs       - Tail logs (optionally pass service name: ./deploy.sh logs backend)"
    echo "  status     - Show service status"
    echo ""
    echo "  migrate    - Run pending database migrations against running containers"
    echo "  seed       - Import questions without touching existing ones (usage: ./deploy.sh seed [path])"
    echo "  baseline   - Mark all migrations applied (run once when upgrading from prisma db push)"
    echo ""
    echo "  ssl-setup  - (Re)generate SSL certs:"
    echo "               ENABLE_SSL=false → self-signed (default, no host deps)"
    echo "               ENABLE_SSL=true  → Let's Encrypt (requires DOMAIN + SSL_EMAIL in .env)"
    echo "  renew-ssl  - Renew an existing Let's Encrypt certificate"
    exit 1
    ;;
esac
