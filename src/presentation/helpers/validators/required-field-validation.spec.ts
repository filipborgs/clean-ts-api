import { MissingParamError } from '../../erros'
import { RequiredFieldValidation } from './required-field-validation'

describe('RequiredFieldValidation', () => {
  test('Should returns MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidation('field')
    const error = sut.validate({})
    expect(error).toEqual(new MissingParamError('field'))
  })
})
