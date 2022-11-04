import { CompareFieldValidation, EmailFieldValidation, RequiredFieldValidation, ValidationComposite } from '../../../../../../validation/validators'
import { Validation } from '../../../../../../presentation/protocols'
import { EmailValidator } from '../../../../../../validation/protocols'
import { makeSignUpValidation } from './signup-validation-factory'

jest.mock('../../../../../../validation/validators/validation-composite')
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
