import { SurveyResultModel } from '@/domain/models'
import { SaveSurveyResultParams } from '@/domain/use-cases'

export const mockSurveyResultModel = (): SurveyResultModel => (
  {
    question: 'any_question',
    surveyId: 'any_survey_id',
    date: new Date(),
    answers: [
      {
        answer: 'any_answer',
        count: 0,
        percent: 0
      },
      {
        answer: 'any_answer2',
        count: 0,
        percent: 0,
        image: 'any_image'
      }
    ]
  }
)

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  date: new Date(),
  answer: 'any_answer'
})
