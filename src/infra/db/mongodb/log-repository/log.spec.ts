import { MongoHelper } from '../helpers/mongo-helper'
import { LogMongoErrorRepository } from './log'

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const errors = await MongoHelper.getCollection('errors')
    await errors.deleteMany({})
  })

  test('Should create an error log on success', async () => {
    const sut = new LogMongoErrorRepository()
    await sut.logError('any_stack')
    const errors = await MongoHelper.getCollection('errors')
    const error = await errors.findOne({ stack: 'any_stack' })
    expect(error).toBeTruthy()
  })
})
