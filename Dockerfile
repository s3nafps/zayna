# Single image for the app and the worker. Compose picks the command per service.
FROM node:22-bookworm-slim AS base
# Prisma's schema engine needs OpenSSL. bookworm-slim does not ship it, and Prisma
# then guesses openssl-1.1.x.
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*
# Prepare pnpm once, in a home the runtime user can read. Otherwise corepack
# re-downloads pnpm on every start, because the default cache lives under /root.
ENV COREPACK_HOME=/usr/local/share/corepack
RUN corepack enable && corepack prepare pnpm@10.28.0 --activate \
  && chmod -R a+rX "$COREPACK_HOME"
ENV COREPACK_ENABLE_NETWORK=0
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml .npmrc ./
COPY prisma ./prisma
COPY prisma.config.ts ./
# prisma generate loads prisma.config.ts, which requires DATABASE_URL. Generate does not connect.
# The URL is scoped to this command so it is not baked into later stages.
RUN pnpm install --frozen-lockfile --ignore-scripts \
  && DATABASE_URL="postgresql://build:build@127.0.0.1:5432/zayna?schema=public" pnpm exec prisma generate

FROM base AS build
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN DATABASE_URL="postgresql://build:build@127.0.0.1:5432/zayna?schema=public" pnpm exec prisma generate \
  && pnpm exec next build

FROM base AS runner
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=3000
# The runner keeps the full dependency tree so `prisma migrate deploy` and `tsx` work in the container.
# Slimming it down is a DEPLOY.md task (Phase 6).
COPY --from=build /app ./
USER node
EXPOSE 3000
CMD ["sh", "-c", "pnpm db:migrate && pnpm start"]
