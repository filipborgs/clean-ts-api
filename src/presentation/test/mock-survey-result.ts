import { SurveyResultModel } from '@/domain/models'
import { mockSurveyResultModel } from '@/domain/test/mock-survey-result'
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/use-cases'

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return mockSurveyResultModel()
    }
  }

  return new SaveSurveyResultStub()
}
