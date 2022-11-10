import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result'
import { SurveyResultModel } from '@/domain/models'
import { mockSurveyResultModel } from '@/domain/test/mock-survey-result'
import { SaveSurveyResultParams } from '@/domain/use-cases'

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return mockSurveyResultModel()
    }
  }
  return new SaveSurveyResultRepositoryStub()
}
