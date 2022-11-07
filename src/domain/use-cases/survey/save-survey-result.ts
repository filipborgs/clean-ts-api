import { SurveyResultModel } from '@/domain/models/survey-result'

export interface SaveSurveyResultModel {
  surveyId: string
  accountId: string
  date: Date
  answer: string
}

export interface SaveSurveyResult {
  save: (data: SaveSurveyResultModel) => Promise<SurveyResultModel>
}
