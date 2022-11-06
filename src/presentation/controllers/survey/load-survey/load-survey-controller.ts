import {
  Controller,
  HttpResponse,
  LoadSurvey,
  serverError, ok, noContent
} from './load-survey-protocols'

export class LoadSurveyController implements Controller {
  constructor (private readonly loadSurvey: LoadSurvey) {}
  async handle (): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurvey.load()
      if (surveys?.length) {
        return ok({
          surveys
        })
      }
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
