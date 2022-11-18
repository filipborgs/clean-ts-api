import { SurveyResultModel } from '@/domain/models'
import { mockSurveyResultModel } from '@/domain/test/mock-survey-result'
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/use-cases'
import { LoadSurveyResult } from '@/domain/use-cases/survey-result/load-survey-result'

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return mockSurveyResultModel()
    }
  }

  return new SaveSurveyResultStub()
}

export const mockLoadSurveyResult = (): LoadSurveyResult => {
  class LoadSurveyResultStub implements LoadSurveyResult {
    async load (data: string): Promise<SurveyResultModel> {
      return mockSurveyResultModel()
    }
  }

  return new LoadSurveyResultStub()
}
