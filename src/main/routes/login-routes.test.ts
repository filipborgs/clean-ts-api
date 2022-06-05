import request from 'supertest'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

describe('Login Routes', () => {
  let accountCollection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /singup', () => {
    test('Should return 201 on singup', async () => {
      await request(app).post('/api/signup').send({
        name: 'Filipe',
        email: 'filipe@gmail.com',
        password: '123',
        passwordConfirmation: '123'
      }).expect(201)
    })
  })

  describe('POST /login', () => {
    test('Should return 200 on login', async () => {
      const bcrypt = new BcryptAdapter(12)
      const password = await bcrypt.hash('123')
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'mail@mail.com',
        password
      })

      await request(app).post('/api/login').send({
        email: 'mail@mail.com',
        password: '123'
      }).expect(200)
    })
  })
})
