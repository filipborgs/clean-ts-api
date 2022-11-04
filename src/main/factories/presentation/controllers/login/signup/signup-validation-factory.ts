import { EmailValidatorAdapter } from '../../../../../../infra/validators/email-validator-adapter'
import { Validation } from '../../../../../../presentation/protocols'
import { CompareFieldValidation, EmailFieldValidation, RequiredFieldValidation, ValidationComposite } from '../../../../../../validation/validators'

export const makeSignUpValidation = (): Validation => {
  const validations: Validation[] = []
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
  requiredFields.forEach(field => validations.push(new RequiredFieldValidation(field)))
  validations.push(new CompareFieldValidation('password', 'passwordConfirmation'))
  validations.push(new EmailFieldValidation('email', new EmailValidatorAdapter()))
  const validationComposite = new ValidationComposite(validations)
  return validationComposite
}
