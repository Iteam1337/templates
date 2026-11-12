# Introduction

Template for a backend in [Koa](https://koajs.com/).

`src/api` includes a few routed endpoints with various usages of standard HTTP input and output.

`src/services/search-service` is a self-contained service with its own route and adapter, prepared to be
extracted into a separate micro service if/when appropriate.

## Installation

1. Install nvm
2. `nvm install`
3. `nvm use`
4. `pnpm install`

## Development

`pnpm dev`

## Tests

`pnpm test`

## Misc

- [koa-pino-http](https://www.npmjs.com/package/koa-pino-logger) provides logging
- [Vitest](https://vitest.dev/) is used for testing along with [supertest](https://www.npmjs.com/package/supertest)
- There is a simple error handler provided in [src/middleware/error-handler.ts]()

## Dependency maintenance

This project uses pnpm with a four-day minimum release age and dependency build scripts disabled by default. Resolve audit findings by upgrading to patched package releases and running the tests. Avoid version overrides and audit suppressions, which require ongoing manual monitoring.
