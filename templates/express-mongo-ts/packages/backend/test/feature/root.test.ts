import request from 'supertest'
import App from '../../src/app'

describe('app', () => {
  describe('GET /', () => {
    it('responds', async () => {
      await request(App).get('/').expect(200)
    })
  })
})
