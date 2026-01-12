FROM node:24-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
COPY turbo.json ./
COPY packages/db ./packages/db

RUN npm ci --workspaces

CMD ["sh", "-c", "cd packages/db && npx prisma migrate deploy"]