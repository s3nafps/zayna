# Single image for the app and the worker. Compose picks the command per service.
FROM node:22-bookworm-slim AS base
RUN corepack enable && corepack prepare pnpm@10.28.0 --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml .npmrc ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN pnpm install --frozen-lockfile --ignore-scripts && pnpm exec prisma generate

FROM base AS build
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm exec prisma generate && pnpm exec next build

FROM base AS runner
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=3000
# The runner keeps the full dependency tree so `prisma migrate deploy` and `tsx` work in the container.
# Slimming it down is a DEPLOY.md task (Phase 6).
COPY --from=build /app ./
USER node
EXPOSE 3000
CMD ["sh", "-c", "pnpm db:migrate && pnpm start"]
