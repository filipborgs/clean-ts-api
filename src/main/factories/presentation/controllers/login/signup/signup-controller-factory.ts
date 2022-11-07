import { LogMongoErrorRepository } from '@/infra/db/mongodb/log/log-repository'
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator'
import { makeDbAddAccount } from '@/main/factories/data/usecases/account/db-add-account-facotry'
import { makeDbAuthentication } from '@/main/factories/data/usecases/authentication/db-authentication-factory'
import { SingUpController } from '@/presentation/controllers/login/singup/singup-controller'
import { Controller } from '@/presentation/protocols'
import { makeSignUpValidation } from './signup-validation-factory'

export const makeSignUpController = (): Controller => {
  const singUpController = new SingUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication())
  return new LogControllerDecorator(singUpController, new LogMongoErrorRepository())
}
