import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys'
import { SurveyModel } from '@/domain/models'
import { AddSurveyModel } from '@/domain/use-cases'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
  async load (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('survey')
    const surveys = await surveyCollection.find().toArray()
    return MongoHelper.mapArray(surveys)
  }

  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('survey')
    await surveyCollection.insertOne({ ...surveyData })
  }
}
