const dbUrl =
  process.env.DB_URL || 'mongodb://localhost:27017/express-mongo-ts-template' // TODO: CHANGE ME!
const isTestEnv = process.env.NODE_ENV === 'test'

const getConfig = () => ({
  url: isTestEnv ? (process.env.__MONGO_URL__ as string) : dbUrl,
  Memory: isTestEnv,
})

export { getConfig }
