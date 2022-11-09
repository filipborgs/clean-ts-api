import { AccountModel, SurveyModel, SurveyResultModel } from '@/domain/models'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'

describe('SurveyResultMongoRepository', () => {
  let surveyResultCollection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyResultCollection = await MongoHelper.getCollection('survey_result')
    await surveyResultCollection.deleteMany({})
  })

  const makeSut = (): SurveyResultMongoRepository => {
    return new SurveyResultMongoRepository()
  }

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

  const insertSurveyResult = async (): Promise<SurveyResultModel> => {
    const [account, survey] = await Promise.all([makeAccount(), makeSurvey()])
    const surveyResult = {
      date: new Date(),
      answer: survey.answers[0].answer,
      surveyId: survey.id,
      accountId: account.id
    }
    await surveyResultCollection.insertOne(surveyResult)

    return MongoHelper.map(surveyResult)
  }

  describe('save()', () => {
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
      expect(typeof surveyResult.id).toEqual('string')
      expect(surveyResult.answer).toEqual(params.answer)
    })

    test('Should update a survey result if exists', async () => {
      const surveyResultOriginal = await insertSurveyResult()
      const params = {
        date: new Date(),
        answer: 'answer 2',
        surveyId: surveyResultOriginal.surveyId,
        accountId: surveyResultOriginal.accountId
      }
      const sut = makeSut()
      const surveyResult = await sut.save(params)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toEqual(surveyResultOriginal.id)
    })
  })
})
