import { SaveSurveyResultRepository } from '@/data/protocols/db/survey/save-survey-result'
import { SaveSurveyResult, SaveSurveyResultModel, SurveyResultModel } from './save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (private readonly surveyRepo: SaveSurveyResultRepository) {}

  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    await this.surveyRepo.save(data)
    return null as any
  }
}
