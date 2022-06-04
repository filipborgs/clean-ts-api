import { MissingParamError } from '../../erros'
import { RequiredFieldValidation } from './required-field-validation'

describe('RequiredFieldValidation', () => {
  const makeSut = (): RequiredFieldValidation => new RequiredFieldValidation('field')
  test('Should returns MissingParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({})
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should not returns MissingParamError if validation succeeds', () => {
    const sut = makeSut()
    const response = sut.validate({ field: 'any_value' })
    expect(response).toBeFalsy()
  })
})
