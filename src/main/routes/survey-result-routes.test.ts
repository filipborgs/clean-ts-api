import { sign } from 'jsonwebtoken'
import request from 'supertest'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import app from '@/main/config/app'
import env from '@/main/config/env'
import { SurveyModel } from '@/domain/models'
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

  const makeSurvey = async (): Promise<SurveyModel> => {
    const survey = {
      question: 'any_question',
      date: new Date(),
      answers: [{
        image: 'http://image.com',
        answer: 'answer 1'
      },
      {
        answer: 'answer 2'
      }]
    }
    const { insertedId: id } = await surveyCollection.insertOne({ ...survey })
    return MongoHelper.mapInserted(survey, id)
  }

  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 403 on save survey result without access token', async () => {
      await request(app).put('/api/surveys/any_id/results').send({
        answer: 'answer'
      }).expect(403)
    })

    test('Should return 200 on save survey with valid access token', async () => {
      const [accessToken, survey] = await Promise.all([makeUser(), makeSurvey()])
      await request(app).put(`/api/surveys/${survey.id}/results`).set('x-access-token', accessToken).send({
        answer: survey.answers[0].answer
      }).expect(200)
    })
  })

  describe('GET /surveys/:surveyId/results', () => {
    test('Should return 403 on load survey result without accessToken', async () => {
      await request(app)
        .get('/api/surveys/any_id/results')
        .expect(403)
    })

    test('Should return 200 on load survey result with accessToken', async () => {
      const [accessToken, survey] = await Promise.all([makeUser(), makeSurvey()])
      await request(app)
        .get(`/api/surveys/${survey.id}/results`)
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
