import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { Validation } from '../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'

export const makeSignUpValidation = (): Validation => {
  const validations: Validation[] = []
  const requiredFields = ['name', 'email', 'password', 'passwordCOnfirmation']
  requiredFields.forEach(field => validations.push(new RequiredFieldValidation(field)))
  const validationComposite = new ValidationComposite(validations)
  return validationComposite
}
