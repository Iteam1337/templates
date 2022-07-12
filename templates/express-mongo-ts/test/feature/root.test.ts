import request from 'supertest'
import App from '../../src/app'

describe('app', () => {
  describe('GET /', () => {
    it('responds', (done) => {
      request(App).get('/').expect(200, done)
    })
  })
})
