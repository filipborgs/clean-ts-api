import { MongoHelper as sut } from './mongo-helper'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL as string)
  })
  afterAll(async () => {
    await sut.disconnect()
  })
  it('Should reconnect if mongodb is down', async () => {
    let collection = await sut.getCollection('any_collection')
    expect(collection).toBeTruthy()
    await sut.disconnect()
    collection = await sut.getCollection('any_collection')
    expect(collection).toBeTruthy()
  })
})
