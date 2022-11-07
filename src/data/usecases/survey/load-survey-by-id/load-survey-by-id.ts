import { LoadSurveyById, LoadSurveyByIdRepository, SurveyModel } from './load-survey-by-id-protocols'

export class DbLoadSurveysById implements LoadSurveyById {
  constructor (private readonly surveyRepository: LoadSurveyByIdRepository) {}
  async loadById (id: string): Promise<SurveyModel | null> {
    return await this.surveyRepository.loadById(id)
  }
}
