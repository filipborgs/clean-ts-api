import { sign } from 'jsonwebtoken'
import request from 'supertest'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import app from '@/main/config/app'
import env from '@/main/config/env'
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

  describe('PUT /surveys/:surveyId/results', () => {
    console.log(makeUser)

    test('Should return 403 on save survey result without access token', async () => {
      await request(app).put('/api/surveys/any_id/results').send({
        answer: 'answer'
      }).expect(403)
    })

    // test('Should return 204 on add survey with valid access token', async () => {
    //   const accessToken = await makeUser('admin')

    //   await request(app).post('/api/surveys').set('x-access-token', accessToken).send({
    //     question: 'Question',
    //     answers: [{
    //       image: 'http://image.com',
    //       answer: 'answer 1'
    //     },
    //     {
    //       answer: 'answer 2'
    //     }]
    //   }).expect(204)
    // })
  })
})
