import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result'
import { SurveyResultModel } from '@/domain/models'
import { mockSurveyResultModel } from '@/domain/test/mock-survey-result'
import { SaveSurveyResultParams } from '@/domain/use-cases'
import { LoadSurveyResultByIdRepository } from '@/data/protocols/db/survey-result/load-survey-result-by-id'

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return mockSurveyResultModel()
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

export const mockLoadSurveyResultByIdRepository = (): LoadSurveyResultByIdRepository => {
  class LoadSurveyResultByIdRepositoryStub implements LoadSurveyResultByIdRepository {
    async loadById (id: string): Promise<SurveyResultModel> {
      return mockSurveyResultModel()
    }
  }
  return new LoadSurveyResultByIdRepositoryStub()
}
