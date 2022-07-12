import request from 'supertest'
import App from '../../src/app'

describe('static files', () => {
  describe('GET /robots.txt', () => {
    it('responds', (done) => {
      request(App)
        .get('/robots.txt')
        .expect(200, 'User-agent: *\nDisallow: /', done)
    })
  })
})
