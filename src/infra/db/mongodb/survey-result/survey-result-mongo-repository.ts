import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result'
import { SurveyResultModel } from '@/domain/models'
import { SaveSurveyResultParams } from '@/domain/use-cases'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (surveyData: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyCollection = await MongoHelper.getCollection('survey_result')
    const { accountId, surveyId, date, answer } = surveyData
    const id = await surveyCollection.findOneAndUpdate({ accountId, surveyId },
      { $set: { date, answer } },
      { upsert: true, returnDocument: 'after' })
    return MongoHelper.mapInserted(surveyData, id.value?._id)
  }
}
