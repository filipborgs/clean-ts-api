import { InvalidParamError } from '../../presentation/erros'
import { CompareFieldValidation } from './compare-field-validation'

describe('CompareFieldValidation', () => {
  const makeSut = (): CompareFieldValidation => new CompareFieldValidation('field', 'fieldToCompare')
  test('Should returns InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any_value', fieldToCompare: 'wrong_value' })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  test('Should not returns InvalidParamError if validation succeeds', () => {
    const sut = makeSut()
    const response = sut.validate({ field: 'any_value', fieldToCompare: 'any_value' })
    expect(response).toBeFalsy()
  })
})
