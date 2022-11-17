import { LoadSurveyResultByIdRepository } from '@/data/protocols/db/survey-result/load-survey-result-by-id'
import { mockLoadSurveyResultByIdRepository } from '@/data/test'
import { mockSurveyResultModel } from '@/domain/test/mock-survey-result'
import { mockThrowError, throwError } from '@/domain/test/test-helpers'
import { DbLoadSurveyResult } from './db-load-survey-result'

describe('DbLoadSurveyResult', () => {
  interface SutTypes {
    sut: DbLoadSurveyResult
    loadSurveyResultRepositoryStub: LoadSurveyResultByIdRepository
  }

  const makeSut = (): SutTypes => {
    jest.useFakeTimers()
    const loadSurveyResultRepositoryStub = mockLoadSurveyResultByIdRepository()
    const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub)
    return {
      sut,
      loadSurveyResultRepositoryStub
    }
  }

  test('Should call LoadSurveyResultByIdRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    const params = 'any_id'
    await sut.load(params)
    expect(loadSpy).toHaveBeenCalledWith(params)
  })

  test('Should throw if LoadSurveyResultByIdRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockImplementationOnce(mockThrowError)
    await expect(sut.load('any_id')).rejects.toThrow(throwError)
  })

  test('Should return corret value on sucess', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.load('any_id')
    expect(surveyResult).toEqual(mockSurveyResultModel())
  })
})
