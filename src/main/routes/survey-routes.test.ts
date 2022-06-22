import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

describe('Survey Routes', () => {
  let surveyCollection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('survey')
    await surveyCollection.deleteMany({})
  })

  describe('POST /surveys', () => {
    test('Should return 204 on survey creation succeeds', async () => {
      await request(app).post('/api/surveys').send({
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
})
