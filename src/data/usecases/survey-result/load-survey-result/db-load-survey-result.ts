import { LoadSurveyResultByIdRepository } from '@/data/protocols/db/survey-result/load-survey-result-by-id'
import { LoadSurveyResult } from '@/domain/use-cases/survey-result/load-survey-result'
import { SurveyResultModel } from '@/domain/models'
import { LoadSurveyByIdRepository } from '../../survey/load-survey-by-id/load-survey-by-id-protocols'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (
    private readonly loadSurveyResultRepository: LoadSurveyResultByIdRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async load (surveyId: string): Promise<SurveyResultModel> {
    let surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId)
    if (!surveyResult) {
      const survey = await this.loadSurveyByIdRepository.loadById(surveyId)
      surveyResult = {
        surveyId: survey.id,
        question: survey.question,
        date: survey.date,
        answers: survey.answers.map(answer => Object.assign({}, answer, {
          count: 0,
          percent: 0
        }))
      }
    }
    return surveyResult
  }
}
