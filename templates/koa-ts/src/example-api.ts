import KoaRouter from '@koa/router';

const router = new KoaRouter();

router.get('/', async (ctx) => {
  ctx.body = 'Hello world';
});

router.get('/search', async (ctx) => {
  const { query } = ctx.request;
  if (!query.freeTextQuery) {
    ctx.status = 400;
    ctx.body = { errorMessage: 'Missing parameter: freeTextQuery' };
    return;
  }

  ctx.body = { results: [], freeTextQuery: ctx.request.query.freeTextQuery };
});

router.get('/echo/:param', async (ctx) => {
  ctx.body = { param: ctx.params.param };
});

router.post('/', async (ctx) => {
  ctx.body = ctx.request.body;
  ctx.set('X-Iteam-Header', ctx.get('X-Iteam-Header'));
});

export default router;
