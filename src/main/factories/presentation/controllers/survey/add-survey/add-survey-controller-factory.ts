import { LogMongoErrorRepository } from '@/infra/db/mongodb/log/log-repository'
import { AddSurveyController } from '@/presentation/controllers/survey/add-survey/add-survey-controller'
import { Controller } from '@/presentation/protocols'
import { makeDbAddSurvey } from '@/main/factories/data/usecases/survey/db-add-survey-facotry'
import { makeAddSurveyValidation } from './add-survey-validation-factory'
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator'

export const makeAddSurveyController = (): Controller => {
  const addSurveyController = new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey())
  return new LogControllerDecorator(addSurveyController, new LogMongoErrorRepository())
}
