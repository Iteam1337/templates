FROM node:19-slim AS builder

WORKDIR /app
ADD package*.json .
RUN npm ci
ADD . .
RUN npm run build

FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
