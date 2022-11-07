import { LogMongoErrorRepository } from '@/infra/db/mongodb/log/log-repository'
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator'
import { makeDbLoadSurvey } from '@/main/factories/data/usecases/survey/db-load-surveys-factory'
import { LoadSurveyController } from '@/presentation/controllers/survey/load-survey/load-survey-controller'
import { Controller } from '@/presentation/protocols'

export const makeLoadSurveyController = (): Controller => {
  const loadSurveyController = new LoadSurveyController(makeDbLoadSurvey())
  return new LogControllerDecorator(loadSurveyController, new LogMongoErrorRepository())
}
