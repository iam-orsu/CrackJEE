# ── Stage 1: Install dependencies from the committed lockfile + generate Prisma client (needs network) ──
FROM node:22-alpine AS deps
WORKDIR /app

RUN apk add --no-cache python3 make g++

# package.json and package-lock.json are committed. `npm ci` installs exactly the locked versions of every
# package, including transitive ones, and fails if the two files disagree.
COPY backend/package.json backend/package-lock.json ./
RUN npm ci

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
