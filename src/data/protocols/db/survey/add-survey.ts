import { AddSurveyModel } from '@/domain/use-cases'

export interface AddSurveyRepository {
  add: (surveyData: AddSurveyModel) => Promise<void>
}
