import { RequiredFieldValidation, EmailFieldValidation, ValidationComposite } from '../../../presentation/helpers/validators'
import { Validation } from '../../../presentation/protocols'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeLoginValidation = (): Validation => {
  const validations: Validation[] = []
  const requiredFields = ['email', 'password']
  requiredFields.forEach(field => validations.push(new RequiredFieldValidation(field)))
  validations.push(new EmailFieldValidation('email', new EmailValidatorAdapter()))
  const validationComposite = new ValidationComposite(validations)
  return validationComposite
}
