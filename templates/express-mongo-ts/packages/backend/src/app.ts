import express, { Application } from 'express'
import path from 'path'

import { setupDatabase } from './lib/database'
import setupMiddlewares from './lib/middlewares'
import setupRoutes from './routes'

let app: Application = express()

setupDatabase()
app = setupMiddlewares(app)
app = setupRoutes(app)

app.use(express.static(path.join(__dirname, 'public')))

export default app
