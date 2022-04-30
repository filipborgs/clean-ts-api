import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

describe('SignUp Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accounts = await MongoHelper.getCollection('accounts')
    await accounts.deleteMany({})
  })

  test('Should return an account on success', async () => {
    await request(app).post('/api/signup').send({
      name: 'Filipe',
      email: 'filipe@gmail.com',
      password: '123',
      passwordConfirmation: '123'
    }).expect(201)
  })
})
