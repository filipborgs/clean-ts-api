import { SurveyResultModel } from '@/domain/models'

export interface LoadSurveyResultByIdRepository {
  loadById: (id: string) => Promise<SurveyResultModel>
}
