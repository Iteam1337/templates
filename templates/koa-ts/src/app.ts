import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'

import api from './api.ts'
import errorHandler from './middlewares/error-handler.ts'

const app = new Koa()

app.use(cors())

app.on('error', (err) => {
  console.error(err)
})

app.use(errorHandler())

app.use(async (ctx, next) => {
  console.log('Hello')
  await next()
})

app.use(bodyParser())
app.use(api.routes())

export default app
