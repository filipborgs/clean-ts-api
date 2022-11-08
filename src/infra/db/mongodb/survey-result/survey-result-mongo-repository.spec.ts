import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'

describe('SurveyResultMongoRepository', () => {
  const makeFakeSurveyResult = (): any => (
    {
      date: new Date(),
      answer: '',
      surveyId: 'any_survey_id',
      accountId: 'any_answer_id'
    }
  )

  describe('save()', () => {
    let surveyCollection
    beforeAll(async () => {
      await MongoHelper.connect(process.env.MONGO_URL as string)
    })

    afterAll(async () => {
      await MongoHelper.disconnect()
    })

    beforeEach(async () => {
      surveyCollection = await MongoHelper.getCollection('survey_result')
      await surveyCollection.deleteMany({})
    })

    const makeSut = (): SurveyResultMongoRepository => {
      return new SurveyResultMongoRepository()
    }

    test('Should add a survey result if its new', async () => {
      const sut = makeSut()
      const params = makeFakeSurveyResult()[0]
      const surveyResult = await sut.save(params)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
    })
  })
})
