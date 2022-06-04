import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

describe('ValidationComposite', () => {
  const makeValidationStub = (): Validation => {
    class FakeValidationStub implements Validation {
      validate (input: any): Error | undefined {
        return undefined
      }
    }
    return new FakeValidationStub()
  }
  const makeSut = (): any => {
    const fakeValidation = makeValidationStub()
    const sut = new ValidationComposite([fakeValidation])
    return {
      sut,
      fakeValidation
    }
  }
  test('Should returns an Error if validation fails', () => {
    const { sut, fakeValidation } = makeSut()
    jest.spyOn(fakeValidation, 'validate').mockReturnValueOnce(new Error())
    const error = sut.validate({})
    expect(error).toEqual(new Error())
  })

  test('Should not returns MissingParamError if validation succeeds', () => {
    const { sut } = makeSut()
    const response = sut.validate({ field: 'any_value' })
    expect(response).toBeFalsy()
  })
})
