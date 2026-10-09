#!/bin/bash
set -e

ACTION=${1:-start}
ENV_FILE=".env"

if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: .env file not found. Copy .env.example to .env and fill in values."
  exit 1
fi

case "$ACTION" in
  start)
    echo "Starting CrackJEE platform..."
    docker compose --env-file "$ENV_FILE" up -d --build
    echo ""
    echo "Build complete. Services are starting up (can take 60-90s on first run)."
    echo "  Watch logs:   ./deploy.sh logs"
    echo "  Check status: ./deploy.sh status"
    echo "  Access at:    http://localhost:8080"
    ;;

  restart)
    echo "Rebuilding and restarting CrackJEE platform..."
    docker compose --env-file "$ENV_FILE" down
    docker compose --env-file "$ENV_FILE" up -d --build
    echo ""
    echo "Restart complete."
    echo "  Watch logs:   ./deploy.sh logs"
    echo "  Access at:    http://localhost:8080"
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
    echo "Usage: ./deploy.sh [start|restart|stop|delete|logs|status]"
    echo "  start   - Build and start all services"
    echo "  restart - Rebuild images and restart all services"
    echo "  stop    - Stop all services (keep data)"
    echo "  delete  - Stop and delete all data volumes"
    echo "  logs    - Tail logs (optionally pass service name)"
    echo "  status  - Show service status"
    exit 1
    ;;
esac
