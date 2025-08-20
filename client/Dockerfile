FROM node:18-alpine AS builder

WORKDIR /app

COPY client/package.json client/package-lock.json* ./

RUN npm ci

COPY client/ ./

RUN npm run build

FROM node:18-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist .

EXPOSE 80

CMD ["serve", "-s", ".", "-l", "80"]
