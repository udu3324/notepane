FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG PASSWORD
ENV PASSWORD=${PASSWORD}
ARG WEBHOOK
ENV WEBHOOK=${WEBHOOK}
ARG POSTGRES_USER
ENV POSTGRES_USER=${POSTGRES_USER}
ARG POSTGRES_PASSWORD
ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
ARG POSTGRES_HOSTNAME
ENV POSTGRES_HOSTNAME=${POSTGRES_HOSTNAME}
ARG POSTGRES_DB
ENV POSTGRES_DB=${POSTGRES_DB}
RUN npm run build
RUN npm prune --production

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY --from=builder /app/static static/
COPY --from=builder /app/src/service-worker src/service-worker/
COPY package.json .
EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "build" ]