import mongoose from 'mongoose'

import { getConfig } from '../config/database'

const connect = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(getConfig().url)
  }
}

const truncate = async () => {
  if (mongoose.connection.readyState !== 0) {
    const { collections } = mongoose.connection

    const promises = Object.keys(collections).map((collection) =>
      mongoose.connection.collection(collection).deleteMany({})
    )

    await Promise.all(promises)
  }
}

const disconnect = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect()
  }
}

const setupDatabase = connect

export { connect, truncate, disconnect, setupDatabase }
