import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey'
import { SurveyModel } from '@/domain/models'
import { mockSurveyModel, mockSurveysModel } from '@/domain/test'
import { AddSurveyParams } from '@/domain/use-cases'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-surveys-by-id'

export const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (data: AddSurveyParams): Promise<void> { }
  }
  return new AddSurveyRepositoryStub()
}

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<SurveyModel> {
      return mockSurveyModel()
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async load (): Promise<SurveyModel[]> {
      return mockSurveysModel()
    }
  }
  return new LoadSurveysRepositoryStub()
}
