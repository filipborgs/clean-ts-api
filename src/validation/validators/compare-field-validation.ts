import { InvalidParamError } from '../../presentation/erros'
import { Validation } from '../../presentation/protocols/validation'

export class CompareFieldValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly fieldToCompare: string
  ) {}

  validate (input: any): Error | undefined {
    if (input[this.fieldName] !== input[this.fieldToCompare]) {
      return new InvalidParamError(this.fieldToCompare)
    }
  }
}
