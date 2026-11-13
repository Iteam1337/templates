FROM node:26.12.1-slim AS builder

WORKDIR /home/app

COPY --from=ghcr.io/pnpm/pnpm:12.6.0 /opt/pnpm /opt/pnpm
RUN ln -s /opt/pnpm/pnpm /usr/local/bin/pnpm

# Help Docker cache pnpm install if neither of these files have changed
ADD ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

ADD ./ ./
RUN pnpm build

# Remove stuff in node_modules we no longer need
ENV NODE_ENV production
RUN pnpm prune --prod

# A slimmed down runner image with only the bare necessities
FROM node:26.12.1-slim AS runner
WORKDIR /home/app
COPY --from=builder /home/app/node_modules ./node_modules
COPY --from=builder /home/app/package* ./
COPY --from=builder /home/app/build ./

# The runtime executes Node directly and needs no package managers.
RUN rm -rf /usr/local/lib/node_modules /usr/local/bin/corepack \
  /usr/local/bin/npm /usr/local/bin/npx \
  /usr/local/bin/yarn /usr/local/bin/yarnpkg /opt/yarn-*

ENV PORT 80
EXPOSE 80

CMD node index.js