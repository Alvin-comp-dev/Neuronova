# Multi-stage build for production optimization
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps

# Add necessary packages
RUN apk add --no-cache libc6-compat python3 make g++

WORKDIR /app

# Copy package files
COPY package.json ./
COPY package-lock.json* ./

# Install dependencies with more verbose output and error handling
RUN set -x && \
    npm install --legacy-peer-deps --verbose || \
    (echo "Failed to install dependencies" && exit 1)

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy dependencies and source code
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables for build
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Build the application with error handling
RUN set -x && \
    npm run build || \
    (echo "Build failed" && exit 1)

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files and set permissions
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Set up .next directory
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy the server directory
COPY --from=builder --chown=nextjs:nodejs /app/server ./server

USER nextjs

# Expose ports
EXPOSE 3000
EXPOSE 3003

# Environment variables
ENV PORT 3000
ENV BACKEND_PORT 3003
ENV HOSTNAME "0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start both frontend and backend
CMD ["sh", "-c", "node server.js & node server/app.js"] 