import { LoadSurveyResult } from '@/domain/use-cases/survey-result/load-survey-result'
import { Controller, forbidden, HttpRequest, HttpResponse, InvalidParamError, LoadSurveyById, ok, serverError } from './load-survey-result-controller-protocols'

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly loadSurvey: LoadSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const survey = await this.loadSurvey.loadById(surveyId)
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }
      const surveyResult = await this.loadSurveyResult.load(surveyId)
      return ok({ surveyResult })
    } catch (error) {
      return serverError(error)
    }
  }
}
