import { LoadSurveyResultByIdRepository } from '@/data/protocols/db/survey-result/load-survey-result-by-id'
import { mockLoadSurveyResultByIdRepository, mockSaveSurveyResultRepository } from '@/data/test'
import { mockSaveSurveyResultParams, mockSurveyResultModel } from '@/domain/test/mock-survey-result'
import { mockThrowError, throwError } from '@/domain/test/test-helpers'
import { DbSaveSurveyResult } from './save-survey-result'
import { SaveSurveyResultRepository } from './save-survey-result-protocols'

describe('DbSaveSurveyResult UseCase', () => {
  interface SutTypes {
    sut: DbSaveSurveyResult
    saveSurveyResultRepositoryStub: SaveSurveyResultRepository
    loadSurveyResultRepositoryStub: LoadSurveyResultByIdRepository
  }

  const makeSut = (): SutTypes => {
    jest.useFakeTimers()
    const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
    const loadSurveyResultRepositoryStub = mockLoadSurveyResultByIdRepository()
    const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub, loadSurveyResultRepositoryStub)
    return {
      sut,
      saveSurveyResultRepositoryStub,
      loadSurveyResultRepositoryStub
    }
  }

  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
    const data = mockSaveSurveyResultParams()
    await sut.save(data)
    expect(saveSpy).toBeCalledWith(data)
  })

  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockImplementationOnce(mockThrowError)
    const promise = sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow(throwError)
  })

  test('Should return corret value on sucess', async () => {
    const { sut } = makeSut()
    const survey = await sut.save(mockSaveSurveyResultParams())
    expect(survey).toEqual(mockSurveyResultModel())
  })

  test('Should call LoadSurveyResultByIdRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadId = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    const data = mockSaveSurveyResultParams()
    await sut.save(data)
    expect(loadId).toBeCalledWith(data.surveyId)
  })

  test('Should throw if LoadSurveyResultByIdRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockImplementationOnce(mockThrowError)
    const promise = sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow(throwError)
  })
})
