import { LoadSurvey } from '../../../../domain/use-cases/survey/load-surveys'
import { serverError, ok } from '../../../helpers/http/http-helper'
import { Controller, HttpResponse } from './load-survey-protocols'

export class LoadSurveyController implements Controller {
  constructor (private readonly loadSurvey: LoadSurvey) {}
  async handle (): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurvey.load()
      return ok({
        surveys
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
