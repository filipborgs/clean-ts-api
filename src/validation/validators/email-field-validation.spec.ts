import { InvalidParamError } from '@/presentation/erros'
import { EmailFieldValidation } from './email-field-validation'
import { mockEmailValidator } from '@/validation/test'
import { EmailValidator } from '@/validation/protocols'

describe('EmailFieldValidation', () => {
  interface sutTypes {
    sut: EmailFieldValidation
    emailValidatorStub: EmailValidator
  }

  const makeSut = (): sutTypes => {
    const emailValidatorStub = mockEmailValidator()
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
