import { mockLoadSurveyByIdRepository } from '@/data/test'
import { mockSurveyModel } from '@/domain/test'
import { mockThrowError, throwError } from '@/domain/test/test-helpers'
import { DbLoadSurveysById } from './load-survey-by-id'
import { LoadSurveyByIdRepository } from './load-survey-by-id-protocols'

describe('DbLoadSurveysById', () => {
  interface SutTypes {
    sut: DbLoadSurveysById
    loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
  }

  const makeSut = (): SutTypes => {
    jest.useFakeTimers()
    const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
    const sut = new DbLoadSurveysById(loadSurveyByIdRepositoryStub)
    return {
      sut,
      loadSurveyByIdRepositoryStub
    }
  }

  const mockFakeParams = (): string => ('any_id')

  test('Should calls LoadSurveyByIdRepository with id', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    const params = mockFakeParams()
    const loadSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.loadById(params)
    expect(loadSpy).toBeCalledWith(params)
  })

  test('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockImplementationOnce(mockThrowError)
    await expect(sut.loadById('id')).rejects.toThrow(throwError)
  })

  test('Should return corret value on sucess', async () => {
    const { sut } = makeSut()
    const survey = await sut.loadById('any_id')
    expect(survey).toEqual(mockSurveyModel())
  })
})
