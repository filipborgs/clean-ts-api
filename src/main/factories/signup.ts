import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { SingUpController } from '../../presentation/controllers/singup/singup'
import { Controller } from '../../presentation/protocols'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { LogControllerDecorator } from '../decorators/log'

export const makeSignUpController = (): Controller => {
  const singUpController = new SingUpController(
    new EmailValidatorAdapter(),
    new DbAddAccount(new BcryptAdapter(12), new AccountMongoRepository()))
  return new LogControllerDecorator(singUpController, null as any)
}
