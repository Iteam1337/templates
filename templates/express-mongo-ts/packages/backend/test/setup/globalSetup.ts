// eslint-disable-next-line node/no-unpublished-import
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { getConfig } from '../../src/config/database'

export = async function globalSetup() {
  if (getConfig().Memory) {
    // Config to decide if an mongodb-memory-server instance should be used
    // it's needed in global space, because we don't want to create a new instance every test-suite
    const instance = await MongoMemoryServer.create()
    ;(global as any).__MONGOINSTANCE = instance
    const uri = instance.getUri()
    process.env.__MONGO_URL__ = uri.slice(0, uri.lastIndexOf('/'))
  } else {
    process.env.__MONGO_URL__ = getConfig().url
  }

  // The following is to make sure the database is clean before an test starts
  await mongoose.connect(`${process.env.__MONGO_URL__}`)
  await mongoose.connection.db.dropDatabase()
  await mongoose.disconnect()
}
