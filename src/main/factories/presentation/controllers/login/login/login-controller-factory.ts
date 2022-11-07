import { LogMongoErrorRepository } from '@/infra/db/mongodb/log/log-repository'
import { LoginController } from '@/presentation/controllers/login/login/login-controller'
import { Controller } from '@/presentation/protocols'
import { makeDbAuthentication } from '@/main/factories/data/usecases/authentication/db-authentication-factory'
import { makeLoginValidation } from './login-validation-factory'
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator'

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(makeDbAuthentication(), makeLoginValidation())
  return new LogControllerDecorator(loginController, new LogMongoErrorRepository())
}
