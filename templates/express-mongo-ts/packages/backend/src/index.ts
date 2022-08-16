import app from './app'

const port: number = parseInt(process.env.PORT || '3000')

app.listen(port, (): void => {
  console.log(`Example app listening on port http://localhost:${port}`)
})

export default app
