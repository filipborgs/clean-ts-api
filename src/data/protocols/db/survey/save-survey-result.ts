import { SurveyResultModel } from '@/domain/models'
import { SaveSurveyResultParams } from '@/domain/use-cases'

export interface SaveSurveyResultRepository {
  save: (surveyData: SaveSurveyResultParams) => Promise<SurveyResultModel>
}
