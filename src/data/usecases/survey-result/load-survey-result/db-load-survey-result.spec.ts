import { LoadSurveyResultByIdRepository } from '@/data/protocols/db/survey-result/load-survey-result-by-id'
import { mockLoadSurveyByIdRepository, mockLoadSurveyResultByIdRepository } from '@/data/test'
import { mockSurveyResultModel } from '@/domain/test/mock-survey-result'
import { mockThrowError, throwError } from '@/domain/test/test-helpers'
import { LoadSurveyById } from '../save-survey-result/save-survey-result-protocols'
import { DbLoadSurveyResult } from './db-load-survey-result'

describe('DbLoadSurveyResult', () => {
  interface SutTypes {
    sut: DbLoadSurveyResult
    loadSurveyResultRepositoryStub: LoadSurveyResultByIdRepository
    loadSurveyByIdRepositoryStub: LoadSurveyById
  }

  const makeSut = (): SutTypes => {
    jest.useFakeTimers()
    const loadSurveyResultRepositoryStub = mockLoadSurveyResultByIdRepository()
    const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
    const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub)
    return {
      sut,
      loadSurveyResultRepositoryStub,
      loadSurveyByIdRepositoryStub
    }
  }

  test('Should call LoadSurveyResultRepository', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    await sut.load('any_survey_id')
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should throw if LoadSurveyResultByIdRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockImplementationOnce(mockThrowError)
    await expect(sut.load('any_id')).rejects.toThrow(throwError)
  })

  test('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(Promise.resolve(null))
    await sut.load('any_survey_id')
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should return surveyResultModel with all answers with count 0 if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(Promise.resolve(null))
    const surveyResult = await sut.load('any_survey_id')
    expect(surveyResult).toEqual(mockSurveyResultModel())
  })

  test('Should return surveyResultModel on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.load('any_survey_id')
    expect(surveyResult).toEqual(mockSurveyResultModel())
  })
})
