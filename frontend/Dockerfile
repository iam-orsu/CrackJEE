# ── Stage 1: Install dependencies from the committed lockfile ──
FROM node:22-alpine AS deps
WORKDIR /app

# package.json and package-lock.json are committed. `npm ci` installs exactly the locked versions of every
# package, including transitive ones, and fails if the two files disagree.
COPY package.json package-lock.json ./
RUN npm ci

# ── Stage 2: Lint, type-check, unit-test, then build Next.js ──
FROM node:22-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json

COPY tsconfig.json ./
COPY next.config.ts ./
COPY eslint.config.mjs ./
COPY vitest.config.mts ./
COPY src/ ./src/
COPY public/ ./public/

ARG NEXT_PUBLIC_API_URL=/api
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Quality gates: a lint error, type error or failing unit test stops the build before anything is deployed
RUN ./node_modules/.bin/eslint src --quiet && \
    ./node_modules/.bin/tsc --noEmit && \
    ./node_modules/.bin/vitest run && \
    ./node_modules/.bin/next build

# ── Stage 3: Minimal production runner ──
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

COPY --from=builder --chown=nodejs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nodejs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nodejs:nodejs /app/public ./public

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ || exit 1

CMD ["node", "server.js"]
