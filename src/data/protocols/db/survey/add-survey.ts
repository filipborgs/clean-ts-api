import { AddSurveyParams } from '@/domain/use-cases'

export interface AddSurveyRepository {
  add: (surveyData: AddSurveyParams) => Promise<void>
}
