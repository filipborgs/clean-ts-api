import { LogMongoErrorRepository } from '../../../../../infra/db/mongodb/log/log-repository'
import { LoginController } from '../../../../../presentation/controllers/login/login-controller'
import { Controller } from '../../../../../presentation/protocols'
import { LogControllerDecorator } from '../../../../decorators/log-controller-decorator'
import { makeDbAuthentication } from '../../../data/usecases/db-authentication-factory'
import { makeLoginValidation } from './login-validation-factory'

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(makeDbAuthentication(), makeLoginValidation())
  return new LogControllerDecorator(loginController, new LogMongoErrorRepository())
}
