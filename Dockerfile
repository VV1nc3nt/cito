# syntax=docker/dockerfile:1

FROM node:22.23.4-alpine AS base
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Public values are inlined into static pages at build time.
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
# Build-time placeholders: the build does not connect to the database.
# Real values are provided at runtime through the environment.
RUN DATABASE_URL=postgres://build:build@localhost:5432/build \
    PAYLOAD_SECRET=build-time-placeholder \
    pnpm build

# Runtime
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    MEDIA_DIR=/app/media

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 --ingroup nodejs nextjs \
 && mkdir -p /app/media /app/.next \
 && chown nextjs:nodejs /app/media /app/.next

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

# Pending migrations are applied on startup (src/instrumentation.ts) before traffic is served.
CMD ["node", "server.js"]
