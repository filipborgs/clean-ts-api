import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
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

    test('Should return an empty array if collection is empty', async () => {
      const sut = makeSut()
      const surveys = await sut.load()
      expect(surveys).toEqual([])
    })
  })

  describe('loadById', () => {
    test('Should return an survey on success', async () => {
      const retorno = await surveyCollection.insertMany(makeFakeSurveys())
      const id = retorno.insertedIds['0'].toString()
      const sut = makeSut()
      const survey = await sut.loadById(id)
      expect(survey).toBeTruthy()
      expect(survey.id).toBeTruthy()
      expect(survey.date).toBeTruthy()
      expect(survey.question).toEqual('any_question')
    })

    test('Should return null if the id dont exists', async () => {
      const sut = makeSut()
      const surveys = await sut.loadById('63699b39ba63d49014cd0b05')
      expect(surveys).toEqual(null)
    })
  })
})
