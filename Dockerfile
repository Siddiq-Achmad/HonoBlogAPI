# Use the official Bun image as base
FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package.json bun.lock ./

# Install dependencies (production only to keep image small)
RUN bun install --frozen-lockfile --production

# Copy the rest of the application
COPY . .

# Environment configuration
ENV NODE_ENV=production
ENV PORT=3000

# Expose the application port
EXPOSE 3000

# Start the application using Bun
# Note: We run src/index.ts directly as Bun supports TypeScript natively
CMD ["bun", "src/index.ts"]
