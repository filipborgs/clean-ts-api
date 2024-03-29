import { DbLoadSurveys } from '@/data/usecases/survey/load-surveys/db-load-surveys'
import { LoadSurveys } from '@/domain/use-cases'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbLoadSurvey = (): LoadSurveys => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveys(surveyMongoRepository)
}
