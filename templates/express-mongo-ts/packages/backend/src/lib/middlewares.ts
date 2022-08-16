import express, { Application } from 'express'
import compression from 'compression'
import cors from 'cors'

export default function setupMiddlewares(app: Application): Application {
  app.use(express.json())
  app.use(compression())
  app.use(cors())
  return app
}
