FROM node:26.12.1-slim AS BUILDER

WORKDIR /home/app

# Help Docker cache pnpm install if neither of these files have changed
ADD ./package.json ./pnpm-lock.yaml ./
RUN npm install --global pnpm@12.6.0 && pnpm install --frozen-lockfile

ADD ./ ./
RUN pnpm build

# Remove stuff in node_modules we no longer need
ENV NODE_ENV production
RUN pnpm prune --prod

# A slimmed down runner image with only the bare necessities
FROM node:26.12.1-slim AS runner
WORKDIR /home/app
COPY --from=BUILDER /home/app/node_modules ./node_modules
COPY --from=BUILDER /home/app/package* ./
COPY --from=BUILDER /home/app/build ./

ENV PORT 80
EXPOSE 80

CMD node index.js