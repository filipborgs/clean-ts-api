import {
  Controller, InvalidParamError,
  forbidden, HttpRequest, HttpResponse,
  LoadSurveyById, SaveSurveyResult, serverError, ok
} from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly saveSurveyResult: SaveSurveyResult,
    private readonly loadSurvey: LoadSurveyById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const { answer } = httpRequest.body
      const survey = await this.loadSurvey.loadById(surveyId)
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }
      const answers = survey.answers.map(a => a.answer)
      if (!answers.includes(answer)) {
        return forbidden(new InvalidParamError('answer'))
      }

      const surveyResult = await this.saveSurveyResult.save({
        surveyId,
        answer,
        date: new Date(),
        accountId: httpRequest.accountId
      })

      return ok({ surveyResult })
    } catch (error) {
      return serverError(error)
    }
  }
}
