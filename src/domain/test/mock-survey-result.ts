import { SurveyResultModel } from '@/domain/models'
import { SaveSurveyResultParams } from '@/domain/use-cases'

export const mockSurveyResultModel = (): SurveyResultModel => (
  {
    id: 'any_id',
    accountId: 'any_account_id',
    surveyId: 'any_survey_id',
    date: new Date(),
    answer: 'any_answer'
  }
)

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  date: new Date(),
  answer: 'any_answer'
})
