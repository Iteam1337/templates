import compression from 'compression'
import express, { Application } from 'express'
import cors from 'cors'
import path from 'path'

import setupRoutes from './routes'

const app: Application = express()

app.use(express.json())
app.use(compression())
app.use(cors())

setupRoutes(app)

app.use(express.static(path.join(__dirname, 'public')))

export default app
