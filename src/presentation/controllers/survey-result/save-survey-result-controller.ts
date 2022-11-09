import { Controller, HttpRequest, HttpResponse, LoadSurveyById, SaveSurveyResult } from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly saveSurveyResult: SaveSurveyResult,
    private readonly loadSurvey: LoadSurveyById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { params: { surveyId } } = httpRequest
    await this.loadSurvey.loadById(surveyId)
    return httpRequest as any
  }
}
