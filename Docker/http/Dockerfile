# FROM node:24-alpine

# RUN apk update && apk upgrade
# RUN apk add --no-cache openssl

# WORKDIR app

# RUN npm cache clear --force 
# RUN npm install -g npm@latest
# COPY package-lock.json .
# COPY package.json .
# COPY turbo.json .
# COPY packages ./packages
# COPY apps/http ./apps/http

# RUN npm install esbuild
# RUN npm install

# EXPOSE 3000

# CMD ["npm", "run", "http-start"]





# ============================================
# Stage 1: Dependencies (for building)
# ============================================
FROM node:24-alpine AS deps

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY turbo.json ./

# Install ALL dependencies INCLUDING devDependencies
# (needed for Prisma generate and build process)
RUN npm ci

# ============================================
# Stage 2: Builder
# ============================================
FROM node:24-alpine AS builder

# Install OpenSSL (required for Prisma)
RUN apk add --no-cache openssl

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY package*.json ./
COPY turbo.json ./
COPY packages ./packages
COPY apps/http ./apps/http

# First: Install all workspace dependencies
RUN npm ci --workspaces

# Second: Force install Prisma 7 locally in packages/db
# This ensures prisma/config module is available for prisma.config.ts
RUN cd packages/db && npm install prisma@7.2.0 @prisma/client@7.2.0 --save-exact

# Fourth: Now generate (prisma package is available)
RUN cd packages/db && npx prisma generate

# Build the application
RUN npm run build

# ============================================
# Stage 3: Production Runner
# ============================================
FROM node:24-alpine AS runner

# Install OpenSSL (Prisma needs this at runtime)
RUN apk add --no-cache openssl

WORKDIR /app

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies
RUN npm ci --only=production && npm cache clean --force

COPY --from=builder --chown=nodejs:nodejs /app/apps/http/dist ./apps/http/dist
# COPY --from=builder --chown=nodejs:nodejs /app/packages/db ./packages/db

# Switch to non-root user
USER nodejs

EXPOSE 3000

# Run migrations and start the app
CMD ["sh", "-c", "node apps/http/dist/index.js"]



# "http-start": "npm run prisma-init && cd apps/http && npm run dev",