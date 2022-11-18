import { LogMongoErrorRepository } from '@/infra/db/mongodb/log/log-repository'
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator'
import { makeDbLoadSurveyResult } from '@/main/factories/data/usecases/survey-result/db-load-survey-result-factory'
import { makeDbLoadSurveyById } from '@/main/factories/data/usecases/survey/db-load-survey-by-id-factory'
import { LoadSurveyResultController } from '@/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller'
import { Controller } from '@/presentation/protocols'

export const makeLoadSurveyResultController = (): Controller => {
  const saveSurveyResultController = new LoadSurveyResultController(makeDbLoadSurveyById(), makeDbLoadSurveyResult())
  return new LogControllerDecorator(saveSurveyResultController, new LogMongoErrorRepository())
}
