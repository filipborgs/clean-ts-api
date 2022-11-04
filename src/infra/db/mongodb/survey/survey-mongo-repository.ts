import { AddSurveyRepository } from '../../../../data/protocols/db/survey/add-survey'
import { AddSurveyModel } from '../../../../domain/use-cases'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('survey')
    await surveyCollection.insertOne({ ...surveyData })
  }
}
