FROM node:20 AS builder
WORKDIR /app
USER root
RUN apt-get update && apt-get install -y openssl
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate

FROM node:20-slim
RUN apt-get update && apt-get install -y openssl
WORKDIR /app
COPY --from=builder /app .

COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 3333
CMD ["/app/docker-entrypoint.sh"]