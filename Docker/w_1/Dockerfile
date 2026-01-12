# FROM node:24-alpine

# RUN apk update && apk upgrade
# RUN apk add --no-cache openssl
# RUN apk add --no-cache \
#     graphicsmagick \
#     ghostscript

# WORKDIR app

# COPY package-lock.json .
# COPY package.json .
# COPY turbo.json .
# COPY packages ./packages
# COPY apps/worker_1 ./apps/worker_1

# RUN npm install esbuild
# RUN npm install

# CMD ["npm","run","w_1-start"]

FROM node:24-alpine as builder

RUN apk update && apk upgrade
RUN apk add --no-cache openssl
RUN apk add --no-cache \
    graphicsmagick \
    ghostscript

WORKDIR /app

COPY package*.json ./
COPY turbo.json ./
COPY packages ./packages
COPY apps/worker_1 ./apps/worker_1

RUN npm ci

RUN cd packages/db && npx prisma generate

RUN npm run build


FROM node:24-alpine as runner

RUN apk add --no-cache openssl

WORKDIR /app

RUN addgroup --system --gid 1001 user
RUN adduser --system --uid 1001 user

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY --from=builder --chown=user:user /app/packages/db ./packages/db

COPY --from=builder --chown=user:user /app/apps/worker_1/dist ./apps/worker_1/dist

COPY --from=builder --chown=user:user /app/packages/db/prisma ./packages/db/prisma

USER user

CMD ["sh", "-c", "node apps/worker_1/dist/index.js"]