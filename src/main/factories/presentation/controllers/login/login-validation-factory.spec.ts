import { EmailFieldValidation, RequiredFieldValidation, ValidationComposite } from '../../../../../validation/validators'
import { Validation } from '../../../../../presentation/protocols'
import { makeLoginValidation } from './login-validation-factory'
import { EmailValidator } from '../../../../../validation/protocols'

jest.mock('../../../../../validation/validators/validation-composite')
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
    makeLoginValidation()
    const validations: Validation[] = []
    const requiredFields = ['email', 'password']
    requiredFields.forEach(
      field => validations.push(new RequiredFieldValidation(field)))
    validations.push(new EmailFieldValidation('email', makeEmailValidator()))

    expect(ValidationComposite).toBeCalledWith(validations)
  })
})
