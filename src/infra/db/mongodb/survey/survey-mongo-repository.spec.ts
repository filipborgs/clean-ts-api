import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

describe('SurveyMongoRepository', () => {
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

  const makeSut = (): SurveyMongoRepository => {
    return new SurveyMongoRepository()
  }
  describe('add', () => {
    it('should create an survey on success', async () => {
      const sut = makeSut()
      await sut.add({
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }],
        date: new Date()
      })
      const survey = await surveyCollection.findOne({ question: 'any_question' })
      expect(survey).toBeTruthy()
    })
  })

  describe('load', () => {
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

    test('Should return an array of surveys if succeeds', async () => {
      await surveyCollection.insertMany(makeFakeSurveys())
      const sut = makeSut()
      const surveys = await sut.load()
      expect(surveys).toBeTruthy()
      const [survey, survey2] = surveys
      expect(survey.id).toBeTruthy()
      expect(survey.date).toBeTruthy()
      expect(survey.question).toEqual('any_question')
      expect(survey2.id).toBeTruthy()
      expect(survey2.date).toBeTruthy()
      expect(survey2.question).toEqual('any_question2')
    })
  })
})
