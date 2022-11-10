import {
  Controller,
  HttpResponse,
  LoadSurveys,
  serverError, ok, noContent
} from './load-surveys-protocols'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurvey: LoadSurveys) {}
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
