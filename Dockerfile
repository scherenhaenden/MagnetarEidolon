# Multi-stage Dockerfile for MagnetarEidolon

# Stage 1: Development & Build
FROM node:22-alpine AS base

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy SDK first (shared dependency)
COPY packages/magnetar-sdk ./packages/magnetar-sdk
RUN cd packages/magnetar-sdk && npm ci && npm run build

# Copy UI application
COPY apps/magnetar-ui ./apps/magnetar-ui
WORKDIR /app/apps/magnetar-ui

# Install UI dependencies
RUN npm ci

# Stage 2: Production Build
FROM base AS builder
RUN npm run build:web

# Stage 3: Production Server (Nginx)
FROM nginx:alpine AS production
COPY --from=builder /app/apps/magnetar-ui/dist/magnetar-ui/browser /usr/share/nginx/html
# Custom nginx config could be added here for SPA routing
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Stage 4: Development Environment
FROM base AS development
ENV NODE_ENV=development
EXPOSE 4200
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0"]
