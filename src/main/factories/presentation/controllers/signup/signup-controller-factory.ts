import { LogMongoErrorRepository } from '../../../../../infra/db/mongodb/log/log-repository'
import { SingUpController } from '../../../../../presentation/controllers/singup/singup-controller'
import { Controller } from '../../../../../presentation/protocols'
import { LogControllerDecorator } from '../../../../decorators/log-controller-decorator'
import { makeDbAddAccount } from '../../../data/usecases/db-add-account-factory'
import { makeDbAuthentication } from '../../../data/usecases/db-authentication-factory'
import { makeSignUpValidation } from './signup-validation-factory'

export const makeSignUpController = (): Controller => {
  const singUpController = new SingUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication())
  return new LogControllerDecorator(singUpController, new LogMongoErrorRepository())
}
