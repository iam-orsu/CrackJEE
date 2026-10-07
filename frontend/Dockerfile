# ── Stage 1: Install dependencies inside Docker ──
FROM node:22-alpine AS deps
WORKDIR /app

RUN npm init -y && \
    npm pkg set name="jee-frontend" version="1.0.0" && \
    npm pkg set scripts.dev="next dev" && \
    npm pkg set scripts.build="next build" && \
    npm pkg set scripts.start="next start" && \
    npm install \
      "next@15" \
      "react@19" \
      "react-dom@19" && \
    npm install --save-dev \
      "@types/node@^22" \
      "@types/react@^19" \
      "@types/react-dom@^19" \
      "typescript@^5.7.0"

# ── Stage 2: Build Next.js ──
FROM node:22-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json

COPY tsconfig.json ./
COPY next.config.ts ./
COPY src/ ./src/
COPY public/ ./public/

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN ./node_modules/.bin/next build

# ── Stage 3: Minimal production runner ──
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

COPY --from=builder --chown=nodejs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nodejs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nodejs:nodejs /app/public ./public

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ || exit 1

CMD ["node", "server.js"]
