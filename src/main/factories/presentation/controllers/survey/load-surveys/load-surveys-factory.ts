import { LogMongoErrorRepository } from '@/infra/db/mongodb/log/log-repository'
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator'
import { makeDbLoadSurvey } from '@/main/factories/data/usecases/survey/db-load-surveys-factory'
import { LoadSurveysController } from '@/presentation/controllers/survey/load-surveys/load-surveys-controller'
import { Controller } from '@/presentation/protocols'

export const makeLoadSurveyController = (): Controller => {
  const loadSurveyController = new LoadSurveysController(makeDbLoadSurvey())
  return new LogControllerDecorator(loadSurveyController, new LogMongoErrorRepository())
}
