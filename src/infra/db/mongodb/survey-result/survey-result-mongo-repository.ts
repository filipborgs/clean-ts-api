import { SaveSurveyResultRepository } from '@/data/protocols/db/survey/save-survey-result'
import { SurveyResultModel } from '@/domain/models'
import { SaveSurveyResultModel } from '@/domain/use-cases'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (surveyData: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyCollection = await MongoHelper.getCollection('survey_result')
    const id = await surveyCollection.insertOne({ ...surveyData })
    return MongoHelper.mapInserted(surveyData, id)
  }
}
