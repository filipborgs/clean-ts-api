import { SaveSurveyResultRepository } from '@/data/protocols/db/survey/save-survey-result'
import { SaveSurveyResult, SaveSurveyResultParams, SurveyResultModel } from './save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (private readonly surveyRepo: SaveSurveyResultRepository) {}

  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    return await this.surveyRepo.save(data)
  }
}
