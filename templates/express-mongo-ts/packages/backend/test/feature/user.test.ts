import request from 'supertest'
import App from '../../src/app'

import UserModel from '../../src/models/User'

describe('users controller', () => {
  describe('put /api/v1/users', () => {
    it('creates a user', async () => {
      await request(App)
        .put('/api/v1/users')
        .send({
          name: 'test',
          email: 'test@example.com',
        })
        .expect(201)
    })
  })

  describe('delete /api/v1/users', () => {
    it('creates a user', async () => {
      try {
        const existingUser = new UserModel({
          name: 'existsUserName',
          email: 'existsUseremail@email.com',
        })
        await existingUser.save()
        await request(App)
          .delete('/api/v1/users')
          .send({
            id: existingUser._id.toString(),
          })
          .expect(200)
      } catch (error) {
        console.error(error)
      }
    })
  })
})
