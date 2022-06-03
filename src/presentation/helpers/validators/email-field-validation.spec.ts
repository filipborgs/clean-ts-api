import { InvalidParamError } from '../../erros'
import { EmailValidator } from '../../protocols'
import { EmailFieldValidation } from './email-field-validation'

describe('EmailFieldValidation', () => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  interface sutTypes {
    sut: EmailFieldValidation
    emailValidatorStub: EmailValidatorStub
  }

  const makeSut = (): sutTypes => {
    const emailValidatorStub = new EmailValidatorStub()
    const sut = new EmailFieldValidation('any_field', emailValidatorStub)
    return { sut, emailValidatorStub }
  }

  test('should call emailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const emailValidatorSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const anyField = 'any_field'
    sut.validate({ any_field: anyField })
    expect(emailValidatorSpy).toBeCalledWith(anyField)
  })

  test('should return an error if emailValidator return false', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const anyField = 'any_field'
    const isValid = sut.validate({ any_field: anyField })
    expect(isValid).toEqual(new InvalidParamError('any_field'))
  })

  test('should throw if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    const throwFunction = (email: string): boolean => { throw new Error() }
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(throwFunction)

    expect(sut.validate).toThrow()
  })
})
