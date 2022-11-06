import { sign } from 'jsonwebtoken'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import env from '../config/env'
describe('Survey Routes', () => {
  let surveyCollection
  let accountCollection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('survey')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /surveys', () => {
    test('Should return 403 on add survey without access token', async () => {
      await request(app).post('/api/surveys').send({
        question: 'Question',
        answers: [{
          image: 'http://image.com',
          answer: 'answer 1'
        },
        {
          answer: 'answer 2'
        }]
      }).expect(403)
    })

    test('Should return 204 on add survey with valid access token', async () => {
      const { insertedId: id } = await accountCollection.insertOne({
        name: 'Filipe',
        email: 'filipborgs48@gmail.com',
        password: 'password',
        role: 'admin'
      })
      const accessToken = sign({ id }, env.jwtSecret)
      console.log(id)
      await accountCollection.updateOne({ _id: id }, { $set: { accessToken } })

      await request(app).post('/api/surveys').set('x-access-token', accessToken).send({
        question: 'Question',
        answers: [{
          image: 'http://image.com',
          answer: 'answer 1'
        },
        {
          answer: 'answer 2'
        }]
      }).expect(204)
    })
  })

  describe('GET /surveys', () => {
    test('Should return 403 on add survey without access token', async () => {
      await request(app).get('/api/surveys').send().expect(403)
    })
  })
})
