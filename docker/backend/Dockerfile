# ===========================================
# TaskFlow Backend Dockerfile
# ===========================================
# Multi-stage build for optimized production image
# Follows Docker best practices

# -----------------------------------------
# Stage 1: Dependencies
# -----------------------------------------
FROM node:20-alpine AS deps

WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# -----------------------------------------
# Stage 2: Development
# -----------------------------------------
FROM node:20-alpine AS development

WORKDIR /app

# Install dependencies including devDependencies
# Using npm install instead of npm ci for development flexibility
COPY backend/package*.json ./
RUN npm install

# Copy source code
COPY backend/ .

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start development server with hot reload
CMD ["npm", "run", "dev"]

# -----------------------------------------
# Stage 3: Build
# -----------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install all dependencies
COPY backend/package*.json ./
RUN npm install

# Copy source code
COPY backend/ .

# Build TypeScript
RUN npm run build

# -----------------------------------------
# Stage 4: Production
# -----------------------------------------
FROM node:20-alpine AS production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 taskflow

WORKDIR /app

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Set ownership
RUN chown -R taskflow:nodejs /app

# Switch to non-root user
USER taskflow

# Expose port
EXPOSE 3000

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start production server
CMD ["node", "dist/server.js"]
