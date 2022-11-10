import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-surveys-by-id'
import { SurveyModel } from '@/domain/models'
import { AddSurveyParams } from '@/domain/use-cases'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { ObjectId } from 'mongodb'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
  async loadById (id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection('survey')
    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) })
    return MongoHelper.map(survey)
  }

  async load (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('survey')
    const surveys = await surveyCollection.find().toArray()
    return MongoHelper.mapArray(surveys)
  }

  async add (surveyData: AddSurveyParams): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('survey')
    await surveyCollection.insertOne({ ...surveyData })
  }
}
