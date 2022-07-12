import { Application } from 'express'
import RootRouter from './RootRouter'

export default function setupRoutes(app: Application): void {
  app.use('/', RootRouter)
}
