import { LoadSurvey } from '../../../../domain/use-cases/survey/load-surveys'
import { serverError } from '../../../helpers/http/http-helper'
import { Controller, HttpResponse } from './load-survey-protocols'

export class LoadSurveyController implements Controller {
  constructor (private readonly loadSurvey: LoadSurvey) {}
  async handle (): Promise<HttpResponse> {
    try {
      await this.loadSurvey.load()
      return null as any
    } catch (error) {
      return serverError(error)
    }
  }
}
