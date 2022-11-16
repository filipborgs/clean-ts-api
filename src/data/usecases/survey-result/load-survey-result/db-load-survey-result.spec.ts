import { LoadSurveyResultByIdRepository } from '@/data/protocols/db/survey-result/load-survey-result-by-id'
import { mockSurveyResultModel } from '@/domain/test/mock-survey-result'
import { SurveyResultModel } from '../save-survey-result/save-survey-result-protocols'
import { DbLoadSurveyResult } from './db-load-survey-result'

describe('DbLoadSurveyResult', () => {
  interface SutTypes {
    sut: DbLoadSurveyResult
    loadSurveyResultRepositoryStub: LoadSurveyResultByIdRepository
  }

  const makeSut = (): SutTypes => {
    class LoadSurveyResultByIdRepositoryStub implements LoadSurveyResultByIdRepository {
      async loadById (id: string): Promise<SurveyResultModel> {
        return mockSurveyResultModel()
      }
    }

    jest.useFakeTimers()
    const loadSurveyResultRepositoryStub = new LoadSurveyResultByIdRepositoryStub()
    const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub)
    return {
      sut,
      loadSurveyResultRepositoryStub
    }
  }

  test('Should call LoadSurveyResultByIdRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadById')
    const params = 'any_id'
    await sut.load(params)
    expect(loadSpy).toHaveBeenCalledWith(params)
  })
})
