import { SurveyResultModel } from '@/domain/models/survey-result'

export interface SaveSurveyResultParams {
  surveyId: string
  accountId: string
  date: Date
  answer: string
}

export interface SaveSurveyResult {
  save: (data: SaveSurveyResultParams) => Promise<SurveyResultModel>
}
