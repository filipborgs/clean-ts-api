import { mockLoadSurveysRepository } from '@/data/test'
import { mockSurveysModel } from '@/domain/test'
import { mockThrowError, throwError } from '@/domain/test/test-helpers'
import { DbLoadSurveys } from './db-load-surveys'
import { LoadSurveysRepository } from './db-load-surveys-protocols'

describe('DbLoadSurveys', () => {
  interface SutTypes {
    sut: DbLoadSurveys
    loadSurveyRepositoryStub: LoadSurveysRepository
  }

  const makeSut = (): SutTypes => {
    jest.useFakeTimers()
    const loadSurveyRepositoryStub = mockLoadSurveysRepository()
    const sut = new DbLoadSurveys(loadSurveyRepositoryStub)
    return {
      sut,
      loadSurveyRepositoryStub
    }
  }

  test('Should calls LoadSurveysRepository with no values', async () => {
    const { sut, loadSurveyRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyRepositoryStub, 'load')
    await sut.load()
    expect(loadSpy).toBeCalledWith()
  })

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveyRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyRepositoryStub, 'load').mockImplementationOnce(mockThrowError)
    await expect(sut.load()).rejects.toThrow(throwError)
  })

  test('Should return corret values on sucess', async () => {
    const { sut } = makeSut()
    const surveys = await sut.load()
    expect(surveys).toEqual(mockSurveysModel())
  })
})
