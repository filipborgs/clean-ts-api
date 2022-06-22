import { LogMongoErrorRepository } from '../../../../../../infra/db/mongodb/log/log-repository'
import { AddSurveyController } from '../../../../../../presentation/controllers/survey/add-survey/add-survey-controller'
import { Controller } from '../../../../../../presentation/protocols'
import { LogControllerDecorator } from '../../../../../decorators/log-controller-decorator'
import { makeDbAddSurvey } from '../../../../data/usecases/db-add-survey-facotry'
import { makeAddSurveyValidation } from './add-survey-validation-factory'

export const makeAddSurveyController = (): Controller => {
  const addSurveyController = new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey())
  return new LogControllerDecorator(addSurveyController, new LogMongoErrorRepository())
}
