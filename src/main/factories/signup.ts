import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { LogMongoErrorRepository } from '../../infra/db/mongodb/log-repository/log'
import { SingUpController } from '../../presentation/controllers/singup/singup'
import { Controller } from '../../presentation/protocols'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { LogControllerDecorator } from '../decorators/log'
import { makeSignUpValidation } from './signup-validation'

export const makeSignUpController = (): Controller => {
  const singUpController = new SingUpController(
    new EmailValidatorAdapter(),
    new DbAddAccount(new BcryptAdapter(12), new AccountMongoRepository()), makeSignUpValidation())
  return new LogControllerDecorator(singUpController, new LogMongoErrorRepository())
}
