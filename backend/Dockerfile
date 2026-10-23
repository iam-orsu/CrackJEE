# ── Stage 1: Install all dependencies + generate Prisma client (needs network) ──
FROM node:22-alpine AS deps
WORKDIR /app

RUN apk add --no-cache python3 make g++

RUN npm init -y && \
    npm pkg set name="jee-backend" version="1.0.0" && \
    npm pkg set scripts.build="tsc" && \
    npm pkg set scripts.start="node dist/index.js" && \
    npm pkg set scripts.test="node --test dist/__tests__/*.test.js" && \
    # Exact versions: these are the ones the QA run tested. Bump deliberately, then re-run the QA suite.
    npm install --save-exact \
      "@prisma/client@6.19.3" \
      "bcryptjs@2.4.3" \
      "cors@2.8.6" \
      "express@4.22.3" \
      "helmet@8.3.0" \
      "ioredis@5.11.1" \
      "jsonwebtoken@9.0.3" \
      "openai@4.104.0" \
      "pino@9.14.0" \
      "pino-pretty@13.2.0" \
      "zod@3.25.76" && \
    npm install --save-dev --save-exact \
      "@types/bcryptjs@2.4.6" \
      "@types/cors@2.8.19" \
      "@types/express@5.0.6" \
      "@types/jsonwebtoken@9.0.10" \
      "@types/node@22.20.5" \
      "prisma@6.19.3" \
      "typescript@5.9.3"

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
