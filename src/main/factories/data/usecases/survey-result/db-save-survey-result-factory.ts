import { DbSaveSurveyResult } from '@/data/usecases/survey-result/save-survey-result/save-survey-result'
import { SaveSurveyResult } from '@/domain/use-cases'
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result/survey-result-mongo-repository'

export const makeDbSaveSurveyResult = (): SaveSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository()
  return new DbSaveSurveyResult(surveyResultMongoRepository)
}
