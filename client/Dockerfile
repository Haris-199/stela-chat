# syntax=docker/dockerfile:1
FROM node:18-alpine AS builder

WORKDIR /app

COPY client/package.json client/package-lock.json* ./
RUN npm ci

COPY client/ .
RUN npm run build

FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]