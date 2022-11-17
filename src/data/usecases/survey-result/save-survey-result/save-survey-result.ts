import { LoadSurveyResultByIdRepository } from '@/data/protocols/db/survey-result/load-survey-result-by-id'
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result'
import { SaveSurveyResult, SaveSurveyResultParams, SurveyResultModel } from './save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (private readonly surveyRepo: SaveSurveyResultRepository,
    private readonly loadSurveyResult: LoadSurveyResultByIdRepository) {}

  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    await this.surveyRepo.save(data)
    return await this.loadSurveyResult.loadBySurveyId(data.surveyId)
  }
}
