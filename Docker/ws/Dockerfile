# FROM node:24-alpine

# WORKDIR app

# COPY package-lock.json .
# COPY package.json .
# COPY turbo.json .
# COPY packages ./packages
# COPY apps/webSocket ./apps/webSocket

# RUN npm install esbuild
# RUN npm install

# EXPOSE 3001

# CMD ["npm","run","ws-start"]

FROM node:24-alpine as builder

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
COPY turbo.json ./
COPY packages ./packages
COPY apps/webSocket ./apps/webSocket

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

COPY --from=builder --chown=user:user /app/apps/webSocket/dist ./apps/webSocket/dist

USER user

EXPOSE 3001

CMD ["sh", "-c", "node apps/webSocket/dist/index.js"]