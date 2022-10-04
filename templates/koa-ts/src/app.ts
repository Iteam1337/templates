import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import pinoLogger from 'koa-pino-logger';
import cors from '@koa/cors';

import exampleApi from './example-api';
import errorHandler from './middlewares/error-handler';

const app = new Koa();
const logger = pinoLogger();

app.use(cors());
app.use(logger);

app.on('error', (err) => {
  console.log('on:error');
  logger.logger.error(err);
});

app.use(errorHandler());

// TODO: Remove me. koa-pino-logger uses standard log levels
app.use(async (ctx, next) => {
  ctx.log.warn('Hello');
  await next();
});

app.use(bodyParser());
app.use(exampleApi.routes());

export default app;
