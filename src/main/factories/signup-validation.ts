import { CompareFieldValidation } from '../../presentation/helpers/validators/compare-field-validation'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { Validation } from '../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'

export const makeSignUpValidation = (): Validation => {
  const validations: Validation[] = []
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
  requiredFields.forEach(field => validations.push(new RequiredFieldValidation(field)))
  validations.push(new CompareFieldValidation('password', 'passwordConfirmation'))
  const validationComposite = new ValidationComposite(validations)
  return validationComposite
}
