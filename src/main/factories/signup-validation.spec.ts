import { CompareFieldValidation } from '../../presentation/helpers/validators/compare-field-validation'
import { EmailFieldValidation } from '../../presentation/helpers/validators/email-field-validation'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { Validation } from '../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { EmailValidator } from '../../presentation/protocols'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { makeSignUpValidation } from './signup-validation'

jest.mock('../../presentation/helpers/validators/validation-composite')
describe('ValidationComposite', () => {
  const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
      isValid (email: string): boolean {
        return true
      }
    }

    return new EmailValidatorStub()
  }

  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    requiredFields.forEach(
      field => validations.push(new RequiredFieldValidation(field)))
    validations.push(new CompareFieldValidation('password', 'passwordConfirmation'))
    validations.push(new EmailFieldValidation('email', makeEmailValidator()))

    expect(ValidationComposite).toBeCalledWith(validations)
  })
})
