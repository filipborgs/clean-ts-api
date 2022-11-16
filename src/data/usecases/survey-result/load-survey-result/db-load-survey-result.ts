import { LoadSurveyResultByIdRepository } from '@/data/protocols/db/survey-result/load-survey-result-by-id'
import { LoadSurveyResult } from '@/domain/use-cases/survey-result/load-survey-result'
import { SurveyResultModel } from '@/domain/models'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (private readonly loadSurveyResultRepository: LoadSurveyResultByIdRepository) {}

  async load (surveyId: any): Promise<SurveyResultModel> {
    await this.loadSurveyResultRepository.loadById(surveyId)
    return null
  }
}
