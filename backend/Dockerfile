FROM node:24-slim AS builder
WORKDIR /app
USER root
RUN apt-get update && apt-get install -y openssl
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate

FROM node:24-slim
WORKDIR /app
RUN apt-get update && apt-get install -y openssl
COPY --from=builder /app .
EXPOSE 3333
CMD ["node", "src/server.js"]