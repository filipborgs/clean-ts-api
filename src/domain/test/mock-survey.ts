import { SurveyModel } from '@/domain/models'
import { AddSurveyParams } from '@/domain/use-cases'

export const mockSurveyModel = (): SurveyModel => (
  {
    id: 'any_survey_id',
    question: 'any_question',
    date: new Date(),
    answers: [{
      answer: 'any_answer'
    },
    {
      image: 'any_image',
      answer: 'any_answer2'
    }]
  }
)

export const mockSurveysModel = (): SurveyModel[] => ([
  {
    id: 'any_id',
    question: 'any_question',
    date: new Date(),
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }]
  },
  {
    id: 'any_id2',
    question: 'any_question2',
    date: new Date(),
    answers: [{
      image: 'any_image2',
      answer: 'any_answer2'
    }]
  }
])

export const mockAddSurveyParams = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})
