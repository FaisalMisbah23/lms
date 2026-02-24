# LMS server - TypeScript, Node.js, Express, MongoDB, Redis, Socket.IO
FROM node:18-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --only=production
COPY --from=builder /app/build ./build
EXPOSE 4000
CMD ["node", "build/server.js"]
