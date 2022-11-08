import { AccountModel, SurveyModel } from '@/domain/models'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'

describe('SurveyResultMongoRepository', () => {
  const makeAccount = async (): Promise<AccountModel> => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = {
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    }
    await accountCollection.insertOne(account)
    return MongoHelper.map(account)
  }

  const makeSurvey = async (): Promise<SurveyModel> => {
    const surveyCollection = await MongoHelper.getCollection('survey')
    const survey = {
      question: 'Question',
      answers: [{
        image: 'http://image.com',
        answer: 'answer 1'
      },
      {
        answer: 'answer 2'
      }]
    }
    await surveyCollection.insertOne(survey)
    return MongoHelper.map(survey)
  }

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
      const [account, survey] = await Promise.all([makeAccount(), makeSurvey()])
      const sut = makeSut()
      const params = {
        date: new Date(),
        answer: survey.answers[0].answer,
        surveyId: survey.id,
        accountId: account.id
      }
      const surveyResult = await sut.save(params)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
    })
  })
})
