import mongoose from 'mongoose'
import { getConfig } from '../../src/config/database'
import * as database from '../../src/lib/database'

beforeAll(async () => {
  await database.connect()
})

beforeEach(() => {
  return database.truncate()
})

afterAll(async () => {
  await database.disconnect()
})
