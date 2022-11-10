import { SurveyAnswer } from '@/domain/models'

export interface AddSurveyParams {
  question: string
  answers: SurveyAnswer[]
  date: Date
}

export interface AddSurvey {
  add: (data: AddSurveyParams) => Promise<void>
}
