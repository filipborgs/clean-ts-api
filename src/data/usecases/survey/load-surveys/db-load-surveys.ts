import { LoadSurveys, LoadSurveysRepository, SurveyModel } from './db-load-surveys-protocols'

export class DbLoadSurveys implements LoadSurveys {
  constructor (private readonly loadSurveys: LoadSurveysRepository) {}
  async load (): Promise<SurveyModel[] | null> {
    return await this.loadSurveys.load()
  }
}
