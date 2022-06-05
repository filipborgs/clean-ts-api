import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { LogMongoErrorRepository } from '../../../infra/db/mongodb/log/log-repository'
import { SingUpController } from '../../../presentation/controllers/singup/singup-controller'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeSignUpValidation } from './signup-validation-factory'

export const makeSignUpController = (): Controller => {
  const singUpController = new SingUpController(
    new DbAddAccount(new BcryptAdapter(12), new AccountMongoRepository()), makeSignUpValidation())
  return new LogControllerDecorator(singUpController, new LogMongoErrorRepository())
}
