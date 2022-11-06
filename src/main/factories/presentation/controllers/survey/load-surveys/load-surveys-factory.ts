import { LogMongoErrorRepository } from '../../../../../../infra/db/mongodb/log/log-repository'
import { LoadSurveyController } from '../../../../../../presentation/controllers/survey/load-survey/load-survey-controller'
import { Controller } from '../../../../../../presentation/protocols'
import { LogControllerDecorator } from '../../../../../decorators/log-controller-decorator'
import { makeDbLoadSurvey } from '../../../../data/usecases/survey/db-load-surveys-factory'

export const makeLoadSurveyController = (): Controller => {
  const loadSurveyController = new LoadSurveyController(makeDbLoadSurvey())
  return new LogControllerDecorator(loadSurveyController, new LogMongoErrorRepository())
}
