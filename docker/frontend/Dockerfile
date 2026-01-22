# ===========================================
# TaskFlow Frontend Dockerfile
# ===========================================
# Multi-stage build for React application

# -----------------------------------------
# Stage 1: Development
# -----------------------------------------
FROM node:20-alpine AS development

WORKDIR /app

# Install dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy source code
COPY frontend/ .

# Expose port
EXPOSE 5173

# Start development server
CMD ["npm", "run", "dev", "--", "--host"]

# -----------------------------------------
# Stage 2: Build
# -----------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy source code
COPY frontend/ .

# Build for production
RUN npm run build

# -----------------------------------------
# Stage 3: Production with Nginx
# -----------------------------------------
FROM nginx:alpine AS production

# Copy custom nginx config
COPY docker/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
