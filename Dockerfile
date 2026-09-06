# ============================================================
# LUXIMA Magazine & Editorial Journal — Dockerfile
# Astro v7 SSR + Hono v4.7 Hybrid Production Container
# ============================================================

FROM oven/bun:latest

WORKDIR /app

# 1. Copy package manifests for dependency caching
COPY package.json bun.lock ./

# 2. Install all dependencies (including devDependencies needed for Astro build)
RUN bun install --frozen-lockfile

# 3. Copy application source code
COPY . .

# 4. Build Astro SSR production bundle (compiles CSS and generates dist/)
ENV NODE_ENV=production
RUN bun run build

# 5. Runtime environment configuration
ENV HOST=0.0.0.0
ENV PORT=3000

# Expose container port
EXPOSE 3000

# 6. Start Astro SSR server (serves frontend UI & bridges /api/* to Hono)
CMD ["bun", "./dist/server/entry.mjs"]
