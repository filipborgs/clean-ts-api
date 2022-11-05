import { LoadSurvey } from '../../../../domain/use-cases/survey/load-surveys'
import { Controller, HttpResponse } from './load-survey-protocols'

export class LoadSurveyController implements Controller {
  constructor (private readonly loadSurvey: LoadSurvey) {}
  async handle (): Promise<HttpResponse> {
    await this.loadSurvey.load()
    return null as any
  }
}
