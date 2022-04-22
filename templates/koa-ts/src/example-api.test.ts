import request from 'supertest';
import Koa from 'koa';
import exampleApi from './example-api';
import bodyParser from 'koa-bodyparser';

const app = new Koa();
app.use(bodyParser());
app.use(exampleApi.routes());

describe('app', () => {
  describe('GET /', () => {
    it('responds', async () => {
      const res = await request(app.callback()).get('/');
      expect(res.status).toBe(200);
    });
  });

  describe('GET /echo/:param', () => {
    it('responds', async () => {
      const res = await request(app.callback()).get('/echo/foobar');
      expect(res.status).toBe(200);
      expect(res.body).toStrictEqual({ param: 'foobar' });
    });
  });

  describe('GET /search?freeTextQuery', () => {
    it('responds', async () => {
      const res = await request(app.callback()).get(
        '/search?freeTextQuery=searchQuery'
      );
      expect(res.status).toBe(200);
      expect(res.body).toStrictEqual({
        results: [],
        freeTextQuery: 'searchQuery',
      });
    });

    it('requires a free text query parameter', async () => {
      const res = await request(app.callback()).get('/search');
      expect(res.status).toBe(400);
      expect(res.body.errorMessage).toBe('Missing parameter: freeTextQuery');
    });
  });

  describe('POST /', () => {
    it('responds', async () => {
      const res = await request(app.callback())
        .post('/')
        .set('X-Iteam-Header', 'Hello Iteam')
        .send({ title: 'Hello world' });
      expect(res.status).toBe(200);
      expect(res.body).toStrictEqual({ title: 'Hello world' });

      // supertest lowercases all headers
      // HTTP spec says that headers are not case sensitive
      expect(res.headers['x-iteam-header']).toBe('Hello Iteam');
    });
  });
});
