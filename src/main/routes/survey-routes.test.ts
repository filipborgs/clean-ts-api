import { sign } from 'jsonwebtoken'
import request from 'supertest'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import app from '@/main/config/app'
import env from '@/main/config/env'
describe('Survey Routes', () => {
  let surveyCollection
  let accountCollection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
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

  const makeUser = async (role?): Promise<string> => {
    const { insertedId: id } = await accountCollection.insertOne({
      name: 'Filipe',
      email: 'filipborgs48@gmail.com',
      password: 'password',
      role
    })
    const accessToken = sign({ id }, env.jwtSecret)
    await accountCollection.updateOne({ _id: id }, { $set: { accessToken } })
    return accessToken
  }

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
      const accessToken = await makeUser('admin')

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
    const makeFakeSurveys = (): any => ([
      {
        question: 'any_question',
        date: new Date(),
        answers: []
      },
      {
        question: 'any_question2',
        date: new Date(),
        answers: []
      }
    ])

    test('Should return 403 on load surveys without access token', async () => {
      await request(app).get('/api/surveys').send().expect(403)
    })

    test('Should return 204 if has no surveys', async () => {
      const accessToken = await makeUser()

      await request(app).get('/api/surveys').set('x-access-token', accessToken).send().expect(204)
    })

    test('Should return 200 with surveys', async () => {
      await surveyCollection.insertMany(makeFakeSurveys())
      const accessToken = await makeUser()

      await request(app).get('/api/surveys').set('x-access-token', accessToken).send().expect(200)
    })
  })
})
