import { SurveyResultModel } from '@/domain/models'
import { SaveSurveyResultModel } from '@/domain/use-cases'

export interface SaveSurveyResultRepository {
  save: (surveyData: SaveSurveyResultModel) => Promise<SurveyResultModel>
}
