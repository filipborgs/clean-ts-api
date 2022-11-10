import { mockSurveyModel, mockSurveysModel } from '@/domain/test'
import { AddSurvey, AddSurveyParams, LoadSurveyById, LoadSurveys } from '@/domain/use-cases'
import { SurveyModel } from '../controllers/survey-result/save-survey-result-controller-protocols'

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurveyParams): Promise<void> {}
  }
  return new AddSurveyStub()
}

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[] | null> {
      return mockSurveysModel()
    }
  }
  return new LoadSurveysStub()
}

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (): Promise<SurveyModel| null> {
      return mockSurveyModel()
    }
  }
  return new LoadSurveyByIdStub()
}
