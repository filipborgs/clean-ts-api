import { SurveyResultModel } from '@/domain/models/survey-result'

export interface LoadSurveyResult {
  load: (surveyId) => Promise<SurveyResultModel>
}
