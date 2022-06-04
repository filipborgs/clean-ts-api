import { RequiredFieldValidation, EmailFieldValidation, CompareFieldValidation, ValidationComposite } from '../../../presentation/helpers/validators'
import { Validation } from '../../../presentation/protocols'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeSignUpValidation = (): Validation => {
  const validations: Validation[] = []
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
  requiredFields.forEach(field => validations.push(new RequiredFieldValidation(field)))
  validations.push(new CompareFieldValidation('password', 'passwordConfirmation'))
  validations.push(new EmailFieldValidation('email', new EmailValidatorAdapter()))
  const validationComposite = new ValidationComposite(validations)
  return validationComposite
}
