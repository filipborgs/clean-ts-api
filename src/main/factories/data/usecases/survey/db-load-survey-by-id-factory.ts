import { DbLoadSurveysById } from '@/data/usecases/survey/load-survey-by-id/load-survey-by-id'
import { LoadSurveyById } from '@/domain/use-cases'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbLoadSurveyById = (): LoadSurveyById => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveysById(surveyMongoRepository)
}
