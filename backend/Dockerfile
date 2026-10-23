# ── Stage 1: Install all dependencies + generate Prisma client (needs network) ──
FROM node:22-alpine AS deps
WORKDIR /app

RUN apk add --no-cache python3 make g++

RUN npm init -y && \
    npm pkg set name="jee-backend" version="1.0.0" && \
    npm pkg set scripts.build="tsc" && \
    npm pkg set scripts.start="node dist/index.js" && \
    npm pkg set scripts.test="node --test dist/__tests__/*.test.js" && \
    npm install \
      "@prisma/client@^6" \
      "bcryptjs@^2.4.3" \
      "cors@^2.8.5" \
      "express@^4.21.2" \
      "helmet@^8.0.0" \
      "ioredis@^5.4.2" \
      "jsonwebtoken@^9.0.2" \
      "openai@^4.73.0" \
      "pino@^9.5.0" \
      "pino-pretty@^13.0.0" \
      "zod@^3.23.8" && \
    npm install --save-dev \
      "@types/bcryptjs@^2.4.6" \
      "@types/cors@^2.8.17" \
      "@types/express@^5.0.0" \
      "@types/jsonwebtoken@^9.0.7" \
      "@types/node@^22.0.0" \
      "prisma@^6" \
      "typescript@^5.7.0"

# Copy schema and generate Prisma client while network is still available
COPY backend/prisma/ ./prisma/
RUN ./node_modules/.bin/prisma generate

# ── Stage 2: Compile TypeScript (no network needed — Prisma client already generated) ──
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json

COPY backend/tsconfig.json ./
COPY backend/src/ ./src/
COPY backend/prisma/ ./prisma/

RUN ./node_modules/.bin/tsc --project tsconfig.json

# ── Stage 3: Minimal production runner ──
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

COPY --from=builder --chown=nodejs:nodejs /app/dist        ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/prisma      ./prisma
COPY --from=deps    --chown=nodejs:nodejs /app/package.json ./package.json

# Copy JEE question bank (required)
COPY --chown=nodejs:nodejs data/jee/jee_master_questions.json ./data/jee/jee_master_questions.json
# Copy NEET question bank
COPY --chown=nodejs:nodejs data/neet/neet_master_questions.json ./data/neet/neet_master_questions.json

# One-shot migrate + seed job, run by the `migrate` compose service (not by every backend container)
COPY --chown=nodejs:nodejs backend/docker/migrate.sh ./migrate.sh

USER nodejs

EXPOSE 3001

HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3001/health || exit 1

CMD ["node", "dist/index.js"]
