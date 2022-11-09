import { Controller, InvalidParamError, forbidden, HttpRequest, HttpResponse, LoadSurveyById, SaveSurveyResult, serverError } from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly saveSurveyResult: SaveSurveyResult,
    private readonly loadSurvey: LoadSurveyById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { params: { surveyId } } = httpRequest
      const survey = await this.loadSurvey.loadById(surveyId)
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }
      return httpRequest as any
    } catch (error) {
      return serverError(error)
    }
  }
}
