FROM node:26.12.1-slim AS builder

WORKDIR /app
ADD package.json pnpm-lock.yaml .
RUN npm install --global pnpm@12.6.0 && pnpm install --frozen-lockfile
ADD . .
RUN pnpm build

FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
