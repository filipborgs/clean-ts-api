import { SurveyResultModel } from '@/domain/models'

export interface LoadSurveyResultByIdRepository {
  loadBySurveyId: (id: string) => Promise<SurveyResultModel>
}
