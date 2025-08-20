FROM node:18-alpine

WORKDIR /app

COPY client/package.json client/package-lock.json* ./

RUN npm install

WORKDIR /app/client

COPY client/ .

RUN npm run build

EXPOSE 4173

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
