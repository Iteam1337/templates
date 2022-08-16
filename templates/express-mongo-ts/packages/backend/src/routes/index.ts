import { Application } from 'express'
import RootRouter from './RootRouter'
import UserRouter from './UserRouter'

export default function setupRoutes(app: Application): Application {
  app.use('/', RootRouter)
  app.use('/api/v1/users', UserRouter)
  return app
}
