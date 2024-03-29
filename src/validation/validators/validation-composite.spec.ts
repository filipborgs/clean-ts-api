import { mockValidationStub } from '@/validation/test/mock-validation'
import { ValidationComposite } from './validation-composite'

describe('ValidationComposite', () => {
  const makeSut = (): any => {
    const fakeValidationStubs = [mockValidationStub(), mockValidationStub()]
    const sut = new ValidationComposite(fakeValidationStubs)
    return {
      sut,
      fakeValidationStubs
    }
  }
  test('Should returns an Error if validation fails', () => {
    const { sut, fakeValidationStubs } = makeSut()
    jest.spyOn(fakeValidationStubs[1], 'validate').mockReturnValueOnce(new Error('ValidationError'))
    const error = sut.validate({})
    expect(error).toEqual(new Error('ValidationError'))
  })

  test('Should returns the first Error if more then one validation fails', () => {
    const { sut, fakeValidationStubs } = makeSut()
    jest.spyOn(fakeValidationStubs[0], 'validate').mockReturnValueOnce(new Error('FirstValidationError'))
    jest.spyOn(fakeValidationStubs[1], 'validate').mockReturnValueOnce(new Error('SecondValidationError'))
    const error = sut.validate({})
    expect(error).toEqual(new Error('FirstValidationError'))
  })

  test('Should not returns MissingParamError if validation succeeds', () => {
    const { sut } = makeSut()
    const response = sut.validate({ field: 'any_value' })
    expect(response).toBeFalsy()
  })
})
